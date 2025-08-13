/* eslint-disable no-unused-vars */

/**
 * Retrieves a cached value from localStorage by key.
 * Checks if the cached item has expired and cleans it up if so.
*/
export function getCache(key) {
  try {
    // Get raw data string from localStorage
    const raw = localStorage.getItem(key);
    if (!raw) return null; // No data found

    // Parse the stored JSON string into an object
    const parsed = JSON.parse(raw);

    // If there's an expiry timestamp and it's passed, remove the item and return null
    if (parsed?.expires && Date.now() > parsed.expires) {
      localStorage.removeItem(key);
      return null;
    }

    // Return the actual cached value
    return parsed.value;
  } catch (err) {
    // If JSON parsing or other error occurs, return null safely
    return null;
  }
}

/**
 * Saves a value in localStorage under a key, with an expiration time (TTL).
 */
export function setCache(key, value, ttlMs = 1000 * 60 * 60 * 24) {
  // Create payload with value and an expires timestamp (current time + TTL)
  const payload = { value, expires: Date.now() + ttlMs };

  try {
    // Store the stringified payload in localStorage
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    // Fail silently if storage is full or unavailable
    return null;
  }
}
