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
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.name || "User";
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    return null;
  }
}

