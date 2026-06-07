import axios from "axios";

const serverApiBaseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/";

const api = axios.create({
  baseURL: typeof window === "undefined" ? serverApiBaseUrl : "/api/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "";
    const isTenantApi = !error?.config?.url?.startsWith("super-admin");
    const isAuthPage =
      typeof window !== "undefined" &&
      ["/login", "/register-company", "/verify-otp", "/forgot-password", "/reset-password"].includes(
        window.location.pathname
      );

    if (status === 401 && isTenantApi && typeof window !== "undefined" && !isAuthPage) {
      const next = currentPath && currentPath !== "/" ? `?next=${encodeURIComponent(currentPath)}` : "";
      window.location.assign(`/login${next}`);
    }

    return Promise.reject(error);
  }
);

export default api;
