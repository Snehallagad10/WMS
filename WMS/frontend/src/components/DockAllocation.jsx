import React, { useEffect, useState } from "react";
import { getGateEntries, createDockAllocation } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DockAllocation() {
  const navigate = useNavigate();

  const [gateEntries, setGateEntries] = useState([]);
  const [form, setForm] = useState({
    inbound_id: "",
    dock_number: "",
    assigned_by: "",
    status: "ASSIGNED",
    remarks: "",
  });

  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchGateEntries();
  }, []);

  const fetchGateEntries = async () => {
    const res = await getGateEntries();
    setGateEntries(res.data);
  };

  const handleStart = () => {
    const now = new Date().toISOString();
    setStartTime(now);

    setForm({ ...form, status: "IN_PROGRESS" });

    // 🚀 redirect to unloading page
    navigate(`/unloading/${form.inbound_id}`);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      assigned_time: new Date().toISOString(),
      unloading_start_time: startTime,
    };

    await createDockAllocation(payload);
    alert("Dock Allocated Successfully");
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Dock Allocation</h2>

      <select
        style={styles.input}
        onChange={(e) =>
          setForm({ ...form, inbound_id: e.target.value })
        }
      >
        <option>Select Inbound</option>
        {gateEntries.map((g) => (
          <option key={g.gate_entry_id} value={g.gate_entry_number}>
            {g.gate_entry_number} - {g.transporter_name}
          </option>
        ))}
      </select>

      <input
        style={styles.input}
        placeholder="Dock Number"
        onChange={(e) =>
          setForm({ ...form, dock_number: e.target.value })
        }
      />

      <input
        style={styles.input}
        placeholder="Assigned By"
        onChange={(e) =>
          setForm({ ...form, assigned_by: e.target.value })
        }
      />

      <select
        style={styles.input}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option>ASSIGNED</option>
        <option>IN_PROGRESS</option>
        <option>COMPLETED</option>
      </select>

      <button style={styles.startBtn} onClick={handleStart}>
        ▶ Start Unloading
      </button>

      {startTime && (
        <p style={styles.time}>Started at: {startTime}</p>
      )}

      <textarea
        style={styles.textarea}
        placeholder="Remarks"
        onChange={(e) =>
          setForm({ ...form, remarks: e.target.value })
        }
      />

      <button style={styles.saveBtn} onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}

/* 🔥 INLINE STYLES */
const styles = {
  card: {
    maxWidth: "500px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "15px",
    fontSize: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "80px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  startBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  saveBtn: {
    background: "#10b981",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
    cursor: "pointer",
  },
  time: {
    fontSize: "12px",
    color: "#6b7280",
  },
};