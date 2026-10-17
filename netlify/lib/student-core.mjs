import { readSessionUser, response } from './auth-core.mjs';

const studentView = user => ({ username: user.username, email: user.email || '', created: user.created, status: user.disabled ? 'paused' : 'active' });

export function createStudentHandler({ store, now = () => Date.now() }) {
  return async req => {
    try {
      const account = await readSessionUser(req, store, now);
      if (!account) return response({ error: 'Please sign in.' }, 401);
      if (account.user.role !== 'owner') return response({ error: 'Only the owner can manage student accounts.' }, 403);
      if (req.method === 'GET') {
        const url = new URL(req.url);
        const search = (url.searchParams.get('search') || '').trim().toLowerCase();
        const after = url.searchParams.get('after') || '';
        if (!/^[a-z0-9_]{0,24}$/.test(search) || !/^[a-z0-9_]{0,24}$/.test(after)) return response({ error: 'Search by the start of a username.' }, 400);
        const keys = (await store.list('users/' + search)).filter(key => key !== 'users/' + account.user.username && key.slice(6) > after).sort();
        const page = keys.slice(0, 50);
        const rows = await Promise.all(page.map(key => store.read(key)));
        return response({ students: rows.filter(Boolean).map(row => studentView(row.value)), nextCursor: keys.length > 50 ? page.at(-1).slice(6) : null });
      }
      if (req.method !== 'POST') return response({ error: 'Method not allowed.' }, 405);
      if (req.headers.get('origin') !== new URL(req.url).origin) return response({ error: 'Please use the form on this website.' }, 403);
      if (!req.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'Please send the form again.' }, 415);
      if (Number(req.headers.get('content-length') || 0) > 4096) return response({ error: 'Form is too large.' }, 413);
      const text = await req.text();
      if (text.length > 4096) return response({ error: 'Form is too large.' }, 413);
      let body;
      try { body = JSON.parse(text); } catch { return response({ error: 'Please check the form.' }, 400); }
      if (!body || !['pause', 'activate'].includes(body.action) || typeof body.username !== 'string' || !/^[a-z0-9_]{3,24}$/.test(body.username)) return response({ error: 'Choose a student and an account action.' }, 400);
      if (body.username === account.user.username) return response({ error: 'The owner account cannot be changed here.' }, 403);
      for (let attempt = 0; attempt < 8; attempt++) {
        const key = 'users/' + body.username;
        const current = await store.read(key);
        if (!current) return response({ error: 'Student account was not found.' }, 404);
        const disabled = body.action === 'pause';
        const updated = { ...current.value, disabled, sessionVersion: (current.value.sessionVersion || 0) + (disabled && !current.value.disabled ? 1 : 0) };
        if (await store.write(key, updated, current.etag)) return response({ student: studentView(updated) });
      }
      return response({ error: 'This account changed elsewhere. Refresh and try again.' }, 409);
    } catch {
      return response({ error: 'Student accounts are temporarily unavailable. Please try again shortly.' }, 503);
    }
  };
}
