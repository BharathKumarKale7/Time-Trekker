import authEvent from "./authEvent";

export function logout() {
  localStorage.removeItem("token");
  authEvent.emit();  // Notify listeners
}

export function login(token) {
  localStorage.setItem("token", token);
  authEvent.emit();  // Notify listeners
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
