// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "http://localhost:8000/api", // your backend
// // });

// // // Gate entries dropdown
// // export const getGateEntries = () => API.get("/gate-entries");

// // // Dock allocation
// // export const createDockAllocation = (data) =>
// //   API.post("/dock-allocation", data);

// // // Unloading
// // export const createUnloading = (data) =>
// //   API.post("/unloading", data);

// // // Upload photos
// // export const uploadPhotos = (formData) =>
// //   API.post("/unloading/photos", formData, {
// //     headers: { "Content-Type": "multipart/form-data" },
// //   });

// // export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000/api",
// });


// // 🔥 TEMP MOCK DATA
// const mockGateEntries = [
//   {
//     gate_entry_id: "1",
//     gate_entry_number: "GE-001",
//     transporter_name: "Blue Dart",
//   },
//   {
//     gate_entry_id: "2",
//     gate_entry_number: "GE-002",
//     transporter_name: "Delhivery",
//   },
// ];

// // ---------------- MOCK FUNCTIONS --------------
// // Gate entries
// export const getGateEntries = () => API.get("/gate-entries");

// // Dock

// export const createDockAllocation = (data) =>
//   API.post("/dock-allocation", data);

// // Unloading
// export const createUnloading = (data) =>
//   API.post("/unloading", data);

// // ✅ ADD THIS
// // export const getUnloadingList = () =>
// //   API.get("/unloading");


// export const getUnloadingList = () => API.get("/unloading");
// // Photos
// export const uploadPhotos = (formData) =>
//   API.post("/unloading/photos", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

  // export default API;
import API from "../config/api";

// Gate entries
export const getGateEntries = () => API.get("/gate-entries");

// Dock allocation
export const createDockAllocation = (data) =>
  API.post("/dock-allocation", data);

// Unloading
export const createUnloading = (data) =>
  API.post("/unloading", data);

// ✅ List
export const getUnloadingList = () =>
  API.get("/unloading");

// Photos
export const uploadPhotos = (formData) =>
  API.post("/unloading/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
