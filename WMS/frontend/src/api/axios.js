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

import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://wms-469e.onrender.com",
});

export default axiosClient;