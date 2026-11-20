import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authorization = error.config?.headers?.Authorization;
      const failedToken = typeof authorization === "string"
        ? authorization.replace(/^Bearer\s+/i, "")
        : null;
      if (failedToken) {
        const authStore = useAuthStore.getState();
        const currentToken = authStore.token ?? localStorage.getItem("auth_token");
        if (currentToken === failedToken) authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);
