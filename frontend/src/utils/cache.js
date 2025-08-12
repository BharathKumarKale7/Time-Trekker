/* eslint-disable no-unused-vars */
export function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.expires && Date.now() > parsed.expires) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch (err) { return null; }
}
export function setCache(key, value, ttlMs = 1000 * 60 * 60 * 24) {
  const payload = { value, expires: Date.now() + ttlMs };
  try { localStorage.setItem(key, JSON.stringify(payload)); } catch (err) { return null; }
}