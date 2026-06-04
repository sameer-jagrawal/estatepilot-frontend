export function getFallbackUser() {
  return {
    name: "User",
    email: "",
    role: "owner",
    company: "",
  };
}

export function getFallbackAdmin() {
  return {
    name: "Admin",
    email: "",
    role: "super-admin",
  };
}

export function isProtectedPath(pathname) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
}
