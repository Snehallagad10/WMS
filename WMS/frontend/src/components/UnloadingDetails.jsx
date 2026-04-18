import React, { useState } from "react";
import { createUnloading, uploadPhotos } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UnloadingDetails({ inboundId }) {

  const navigate = useNavigate(); // ✅ inside function

  const [form, setForm] = useState({
    staging_area: "",
    total_cartons: "",
    unloaded_by: "",
    unloading_start: "",
    unloading_end: "",
  });

  const [files, setFiles] = useState([]);
  const [photoType, setPhotoType] = useState("FULL_PALLET");

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        inbound_id: inboundId,
      };

      await createUnloading(payload);

      alert("Unloading Saved");

      // ✅ REDIRECT WORKS NOW
      navigate("/unloading-list");

    } catch (err) {
      console.error(err);
      alert("Error saving unloading");
    }
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("photo_type", photoType);

      await uploadPhotos(formData);

      alert("Photos Uploaded");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Unloading Details</h2>

        <p style={styles.label}>Inbound: {inboundId}</p>

        <input
          style={styles.input}
          placeholder="Staging Area"
          onChange={(e) =>
            setForm({ ...form, staging_area: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Total Cartons"
          onChange={(e) =>
            setForm({ ...form, total_cartons: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Unloaded By"
          onChange={(e) =>
            setForm({ ...form, unloaded_by: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="datetime-local"
          onChange={(e) =>
            setForm({ ...form, unloading_start: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="datetime-local"
          onChange={(e) =>
            setForm({ ...form, unloading_end: e.target.value })
          }
        />

        <h3>📸 Upload Photos</h3>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <div style={styles.radio}>
          <label>
            <input
              type="radio"
              value="FULL_PALLET"
              checked={photoType === "FULL_PALLET"}
              onChange={(e) => setPhotoType(e.target.value)}
            />
            Full Pallet
          </label>

          <label>
            <input
              type="radio"
              value="CARTON_STACK"
              checked={photoType === "CARTON_STACK"}
              onChange={(e) => setPhotoType(e.target.value)}
            />
            Carton Stack
          </label>
        </div>

        <button style={styles.uploadBtn} onClick={handleUpload}>
          Upload Photos
        </button>

        <button style={styles.saveBtn} onClick={handleSubmit}>
          Save Unloading
        </button>
      </div>
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px",
  },
  card: {
    width: "500px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  label: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
  radio: {
    display: "flex",
    gap: "20px",
    margin: "10px 0",
  },
  uploadBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginTop: "10px",
  },
  saveBtn: {
    background: "#10b981",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginTop: "10px",
  },
};