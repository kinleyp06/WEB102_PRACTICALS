import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isAuthRequest =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register");

    // Do not redirect when login/signup itself failed
    if (status === 401 && !isAuthRequest && typeof window !== "undefined") {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
