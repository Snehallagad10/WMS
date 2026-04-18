import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";
import "./Unloading.css";

export default function Unloading() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchGateEntries();
  }, []);

  const fetchGateEntries = async () => {
    try {
      const res = await axiosClient.get("/dock-allocation/");
      setRows(res.data || []);
    } catch (error) {
      console.error("Error fetching unloading list:", error);
    }
  };

  const filteredRows = useMemo(() => {
    let filtered = rows;

    filtered = filtered.filter(
      (item) =>
        (item.status || "pending").toLowerCase() ===
        activeTab.toLowerCase()
    );

    if (search.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.vehicle_number
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.material_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [rows, search, activeTab]);

  const pendingCount = rows.filter(
    (r) => (r.status || "pending").toLowerCase() === "pending"
  ).length;

  const progressCount = rows.filter(
    (r) => (r.status || "").toLowerCase() === "approved"
  ).length;

  const completedCount = rows.filter(
    (r) => (r.status || "").toLowerCase() === "completed"
  ).length;

  return (
    <div className="unloading-page">
      <h1 className="page-title">Unloading Management</h1>
      <p className="page-subtitle">
        Track and manage unloading tasks across warehouses
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon pending-icon">◔</div>
          <div>
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress-icon">◔</div>
          <div>
            <div className="stat-number">{progressCount}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon complete-icon">✓</div>
          <div>
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

<div className="search-box">
  <input
    className="search-input"
    placeholder="Search by vehicle or goods..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

<div className="table-card">
  <div className="tabs">
    <button
      className={`tab-btn ${
        activeTab === "pending" ? "active-tab" : ""
      }`}
      onClick={() => setActiveTab("pending")}
    >
      Pending ({pendingCount})
    </button>

    <button
      className={`tab-btn ${
        activeTab === "approved" ? "active-tab" : ""
      }`}
      onClick={() => setActiveTab("approved")}
    >
      In Progress ({progressCount})
    </button>

    <button
      className={`tab-btn ${
        activeTab === "completed" ? "active-tab" : ""
      }`}
      onClick={() => setActiveTab("completed")}
    >
      Completed ({completedCount})
    </button>
  </div>

  <table className="unloading-table">
    <thead>
      <tr>
        <th>Inbound ID</th>
        <th>Vehicle</th>
        <th>Dock</th>
        <th>Assigned By</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {filteredRows.length > 0 ? (
        filteredRows.map((item, index) => (
          <tr
            key={index}
            className="clickable-row"
            onClick={() =>
              navigate(
                `/unloading-details/${
                  item.inbound_id || item.gate_entry_id
                }`,
                { state: item }
              )
            }
          >
            <td>
              {item.inbound_id || item.gate_entry_id || "—"}
            </td>
            <td>{item.vehicle_number || "—"}</td>
            <td>{item.dock_number || "—"}</td>
            <td>{item.assigned_by || "—"}</td>
            <td>
              <span
                className={`status-badge ${
                  (item.status || "pending").toLowerCase()
                }`}
              >
                {item.status || "Pending"}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" style={{ textAlign: "center" }}>
            No unloading records found
          </td>
        </tr>
      )}
     </tbody>
      </table>
    </div>
  </div>
);
}