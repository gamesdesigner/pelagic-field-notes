import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
const SESSION_AGE = 60 * 60 * 24 * 7;
const digest = value => createHash('sha256').update(value).digest('hex');
const derive = (password, salt) => scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
const publicUser = user => ({ username: user.username });
const cookieValue = req => (req.headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith('mb_session='))?.slice(11);
const sessionCookie = (req, value, age) => `mb_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(req.url).protocol === 'https:' ? '; Secure' : ''}`;
function response(data, status = 200, cookie) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(JSON.stringify(data), { status, headers });
}

// The store exposes conditional writes so concurrent sign-ups cannot claim one name.
export function createAuthHandler({ store, now = () => Date.now(), clientIP = () => 'local' }) {
  async function rateLimit(req) {
    const key = 'limits/' + digest(clientIP(req));
    for (let attempt = 0; attempt < 8; attempt++) {
      const current = await store.read(key);
      const fresh = !current || current.value.reset <= now();
      const value = fresh ? { count: 1, reset: now() + 15 * 60 * 1000 } : { ...current.value, count: current.value.count + 1 };
      if (value.count > 20) return false;
      if (await store.write(key, value, current?.etag)) return true;
    }
    return false;
  }
  async function startSession(req, user) {
    const token = randomBytes(32).toString('hex');
    await store.write('sessions/' + digest(token), { username: user.username, expires: now() + SESSION_AGE * 1000 });
    return response({ user: publicUser(user) }, 200, sessionCookie(req, token, SESSION_AGE));
  }
  return async function handler(req) {
    try {
      const token = cookieValue(req);
      const sessionKey = token && /^[a-f0-9]{64}$/.test(token) ? 'sessions/' + digest(token) : null;
      if (req.method === 'GET') {
        const session = sessionKey && await store.read(sessionKey);
        if (!session || session.value.expires <= now()) {
          if (session) await store.remove(sessionKey);
          return response({ user: null }, 200, token ? sessionCookie(req, '', 0) : undefined);
        }
        return response({ user: { username: session.value.username } });
      }
      if (req.method !== 'POST') return response({ error: 'Method not allowed.' }, 405);
      if (req.headers.get('origin') !== new URL(req.url).origin) return response({ error: 'Please use the form on this website.' }, 403);
      if (!req.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'Please send the account form again.' }, 415);
      if (Number(req.headers.get('content-length') || 0) > 4096) return response({ error: 'Form is too large.' }, 413);
      const text = await req.text();
      if (text.length > 4096) return response({ error: 'Form is too large.' }, 413);
      let body;
      try { body = JSON.parse(text); } catch { return response({ error: 'Please check the form.' }, 400); }
      if (!body || typeof body !== 'object') return response({ error: 'Please check the form.' }, 400);
      if (body.action === 'sign-out') {
        if (sessionKey) await store.remove(sessionKey);
        return response({ user: null }, 200, sessionCookie(req, '', 0));
      }
      if (!['sign-in', 'sign-up'].includes(body.action)) return response({ error: 'Unknown account action.' }, 400);
      if (!await rateLimit(req)) return response({ error: 'Too many attempts. Please try again in 15 minutes.' }, 429);
      const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';
      if (!/^[a-z0-9_]{3,24}$/.test(username)) return response({ error: 'Use 3–24 letters, numbers, or underscores for your username.' }, 400);
      if (password.length < 12 || password.length > 128) return response({ error: 'Use a password with 12–128 characters.' }, 400);
      const key = 'users/' + username;
      if (body.action === 'sign-up') {
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return response({ error: 'Enter a valid email or leave it blank.' }, 400);
        const salt = randomBytes(16).toString('hex');
        const hash = (await derive(password, salt)).toString('hex');
        const user = { username, salt, hash, ...(email ? { email } : {}), created: now(), passwordVersion: 1 };
        if (!await store.write(key, user)) return response({ error: 'That username is already in use. Please choose another.' }, 409);
        return await startSession(req, user);
      }
      const found = await store.read(key);
      const salt = found?.value.salt || '00000000000000000000000000000000';
      const actual = await derive(password, salt);
      const expected = found ? Buffer.from(found.value.hash, 'hex') : Buffer.alloc(64);
      const valid = expected.length === actual.length && timingSafeEqual(actual, expected);
      if (!found || !valid) return response({ error: 'Username or password is incorrect.' }, 401);
      return await startSession(req, found.value);
    } catch {
      // Never log account forms, credentials, session tokens, or storage responses.
      return response({ error: 'Accounts are temporarily unavailable. Please try again shortly.' }, 503);
    }
  };
}

// Disposable, server-only local store for development and automated tests.
export function createMemoryStore() {
  const entries = new Map(); let revision = 0;
  return {
    async read(key) { return entries.has(key) ? structuredClone(entries.get(key)) : null; },
    async write(key, value, etag) {
      const current = entries.get(key);
      if (etag ? current?.etag !== etag : !!current) return false;
      entries.set(key, { value: structuredClone(value), etag: String(++revision) }); return true;
    },
    async remove(key) { entries.delete(key); },
  };
}
