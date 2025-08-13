export const TOKEN_KEY = "token";  // Key to store JWT token in localStorage
export const USER_KEY = "user";    // Key to store user info in localStorage

import authEvent from "./authEvent"; // Custom event emitter for auth state changes

/**
 * Save token and optional user info to localStorage and notify listeners
 * @param {string} token - JWT token string
 * @param {object|null} user - Optional user object to store
 */
export function login(token, user = null) {
  if (!token) return; // Don't proceed if no token provided
  localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  authEvent.emit(); // Notify subscribed components about login state change
}

/**
 * Clear auth data from localStorage and notify listeners
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  authEvent.emit(); // Notify subscribed components about logout
}

/**
 * Check if user is currently logged in (token exists)
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Retrieve stored JWT token from localStorage
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retrieve stored user info object from localStorage
 * @returns {object|null}
 */
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (err) {
    console.error("Error parsing user", err);
    return null; // Return null if JSON parsing fails
  }
}

/**
 * Retrieve the user's name from stored user info, or fallback to "User"
 * @returns {string}
 */
export function getUsername() {
  return getUser()?.name || "User";
}
