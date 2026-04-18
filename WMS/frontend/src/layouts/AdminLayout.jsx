// 

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api";
import  Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found. Skipping warehouse load.");
      return;
    }

    const loadWarehouses = async () => {
      try {
        const res = await API.get("/warehouses");
        setWarehouses(res.data);
      } catch (err) {
        console.error("Failed loading warehouses", err);
      }
    };

    loadWarehouses();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar
        warehouses={warehouses}
        setSelectedWarehouse={setSelectedWarehouse}
      />

      <div
  className="main-content"
  style={{
    marginLeft: "220px",
    padding: "20px",
    minHeight: "100vh",
    background: "#f8fafc"
  }}
>
        <Outlet
          context={{
            warehouses: warehouses || [],
            setWarehouses,
            selectedWarehouse,
            setSelectedWarehouse
          }}
        />
      </div>
    </div>
  );
}