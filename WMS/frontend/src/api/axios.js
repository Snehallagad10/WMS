// import axios from "axios";

// const API = "http://localhost:8000";

// const axiosClient = axios.create({
//   baseURL: API
// });

// axiosClient.interceptors.request.use((config) => {

//   const token = localStorage.getItem("token");

//   console.log("Token Being Sent: ", token);

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }

//   return config;

// });

// export default axiosClient;

import apiClient from "../config/api";

export default apiClient;
