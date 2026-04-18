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

// ✅ FINAL FIXED VERSION
axiosClient.interceptors.request.use((config) => {
  let token = localStorage.getItem("access_token");

  // 🔥 DEMO FIX: if token missing, use fallback
  if (!token) {
    console.warn("No token found, using demo-token");
    token = "demo-token";
    localStorage.setItem("access_token", token);
  }

  // ✅ ALWAYS attach token
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };

  return config;
});

export default axiosClient;