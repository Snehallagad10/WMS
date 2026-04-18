import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";
import "./DockAllocation.css";

export default function DockAllocation() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    inbound_id: "",
    dock_number: "",
    assigned_by: "",
    status: "ASSIGNED",
    remarks: "",
    assigned_time: new Date().toLocaleString(),
  });

  useEffect(() => {
    
    fetchGateEntries();
  }, []);
  useEffect(() => {
  if (form.inbound_id) {
    setCurrentStep(1);
  }

  if (form.inbound_id && form.dock_number) {
    setCurrentStep(2);
  }

  if (form.status === "IN_PROGRESS") {
    setCurrentStep(3);
  }
}, [form]);

  const fetchGateEntries = async () => {
    try {
      const res = await axiosClient.get("/gate-entries/");
      setEntries(res.data || []);
    } catch (error) {
      console.error("Error fetching gate entries:", error);
    }
  };


const handleStart = () => {
  if (!form.inbound_id || !form.dock_number) {
    alert("Please select shipment and dock first");
    return;
  }

  alert("Unloading started successfully");

  setForm((prev) => ({
    ...prev,
    status: "IN_PROGRESS",
  }));

  setCurrentStep(3);
};

  const handleSave = () => {
    alert("Dock Allocation Saved Successfully");
    navigate("/unloading-list");
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "inbound_id") {
    setCurrentStep(1);
  }

  if (name === "dock_number" && value) {
    setCurrentStep(2);
  }
};

  
  return (
  <div className="dock-page">
    <h1 className="dock-title">⚓ Dock Allocation</h1>
    <p className="dock-subtitle">
      Assign inbound shipment to unloading dock
    </p>

    {/* Stepper */}
    <div className="stepper-card">
  <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
    {currentStep > 1 ? "✓" : "1"}
    <span>Select Shipment</span>
  </div>

  <div className={`line ${currentStep >= 2 ? "active" : ""}`}></div>

  <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
    {currentStep > 2 ? "✓" : "2"}
    <span>Assign Dock</span>
  </div>

  <div className={`line ${currentStep >= 3 ? "active" : ""}`}></div>

  <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
    ✓
    <span>Start Unloading</span>
  </div>
</div>

    <div className="dock-layout">
      {/* LEFT */}
      <div className="dock-form-card">
        <h2>Shipment & Dock Assignment</h2>

        <div className="grid-2">
          <div>
            <label>Inbound ID (Gate Entry No)</label>
            <select
              name="inbound_id"
              value={form.inbound_id}
              onChange={handleChange}
            >
              <option value="">Select inbound gate entry</option>
              {entries.map((item) => (
                <option
                  key={item.gate_entry_id}
                  value={item.gate_entry_id}
                >
                  {item.gate_entry_id} — {item.vehicle_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Dock Number</label>
            <input
              name="dock_number"
              placeholder="e.g D-01"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Assigned By</label>
            <input
              name="assigned_by"
              placeholder="Staff / Security name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Assigned Time</label>
            <input value={form.assigned_time} readOnly />
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>ASSIGNED</option>
              <option>IN_PROGRESS</option>
              <option>COMPLETED</option>
            </select>
          </div>

          <div>
            <label>Remarks</label>
            <textarea
              name="remarks"
              placeholder="Optional remarks..."
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="unloading-box">
          <h3>▶ Unloading Control</h3>

          <button className="start-btn" onClick={handleStart}>
            ▶ Start Unloading
          </button>
        </div>

        <div className="actions">
          <button className="cancel-btn">Cancel</button>

          <button className="save-btn" onClick={handleSave}>
            Save & Continue
          </button>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="summary-card">
        <h3>Live Summary</h3>

        <p><strong>Inbound ID</strong><br />{form.inbound_id || "—"}</p>
        <p><strong>Dock Number</strong><br />{form.dock_number || "—"}</p>
        <p><strong>Assigned By</strong><br />{form.assigned_by || "—"}</p>
        <p><strong>Assigned Time</strong><br />{form.assigned_time}</p>

        <p>
          <strong>Status</strong><br />
          <span className="status-badge">{form.status}</span>
        </p>
      </div>
    </div>
  </div>
);
}