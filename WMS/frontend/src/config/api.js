import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://wms-469e.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default apiClient;
