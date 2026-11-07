export const ACCOUNT_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

// Check on page load, then at most daily while the page stays open. Both the
// timer and returning to a visible tab share this gate. Failed attempts also
// count, so a storage outage cannot cause a burst of retries on tab switches.
/** @param {() => Promise<unknown>} check @param {() => number} [now] */
export function createDailyAccountCheck(check, now = () => Date.now()) {
  let lastAttempt;
  let running = false;
  return async function refresh() {
    const time = now();
    if (running || (lastAttempt !== undefined && time - lastAttempt < ACCOUNT_CHECK_INTERVAL)) return false;
    lastAttempt = time;
    running = true;
    try {
      await check();
      return true;
    } finally {
      running = false;
    }
  };
}
