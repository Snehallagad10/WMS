import React, { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import "./UnloadingDetails.css";

export default function UnloadingDetails() {
  const [photos, setPhotos] = useState([]);
  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    inbound_id: "",
    staging_area: "",
    total_cartons: "",
    unloaded_by: "",
    unloading_start: "",
    unloading_end: "",
  });

  useEffect(() => {
    fetchGateEntries();
  }, []);

  const fetchGateEntries = async () => {
    try {
      const res = await axiosClient.get("/gate-entries/");
      setEntries(res.data || []);
    } catch (error) {
      console.error("Error fetching gate entries:", error);
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="unload-page">
      <h1>Unloading Details</h1>

      <div className="unload-grid">
        <div className="card">
          <h2>Unloading Information</h2>

          <div className="grid-2">
            <select
              name="inbound_id"
              value={form.inbound_id}
              onChange={handleChange}
            >
              <option value="">Select inbound entry</option>
              {entries.map((item) => (
                <option
                  key={item.gate_entry_id}
                  value={item.gate_entry_id}
                >
                  {item.gate_entry_id} — {item.vehicle_number}
                </option>
              ))}
            </select>

            <input
              name="staging_area"
              placeholder="Staging Area"
              onChange={handleChange}
            />

            <input
              name="total_cartons"
              placeholder="Total Cartons"
              type="number"
              onChange={handleChange}
            />

            <input
              name="unloaded_by"
              placeholder="Unloaded By"
              onChange={handleChange}
            />

            <input
              type="datetime-local"
              name="unloading_start"
              onChange={handleChange}
            />

            <input
              type="datetime-local"
              name="unloading_end"
              onChange={handleChange}
            />
          </div>

          <div className="actions">
            <button>Cancel</button>
            <button className="save-btn">Save Details</button>
          </div>
        </div>

        <div className="card">
          <h2>Upload Photos</h2>

          <input type="file" multiple onChange={handleUpload} />

          <div className="photo-grid">
            {photos.map((file, index) => (
              <div key={index} className="photo-item">
                {file.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}