export const TOKEN_KEY = "token";
export const USER_KEY = "user";

import authEvent from "./authEvent";

export function login(token, user = null) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  authEvent.emit();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  authEvent.emit();
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (err) {
    console.error("Error parsing user", err);
    return null;
  }
}

export function getUsername() {
  return getUser()?.name || "User";
}