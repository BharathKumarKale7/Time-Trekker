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

export function getUsername() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.name || null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    return null;
  }
}

