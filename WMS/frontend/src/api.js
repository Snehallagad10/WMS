import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // FIXED KEY

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired / invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {

      // remove invalid token
      localStorage.removeItem("access_token");

      // redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;