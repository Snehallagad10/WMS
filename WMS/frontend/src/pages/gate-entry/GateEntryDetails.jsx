// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./G-details.css";
// import { useParams, useNavigate } from "react-router-dom";

// const API = "http://localhost:8000";

// export default function GateEntryDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [entry, setEntry] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     fetchEntry();
//   }, [id]);

//   const fetchEntry = async () => {
//     try {
//       const res = await axios.get(
//         `${API}/gate-entries/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setEntry(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       alert("Error loading entry details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p className="loading">Loading...</p>;
//   if (!entry) return <p className="loading">No details found</p>;

//   return (
//     <div className="details-page">
//       <div className="details-topbar">
//         <div>
//           <h1>{entry.gate_entry_id}</h1>
//           <p>Gate Entry Full Details</p>
//         </div>

//         <button
//           className="btn red"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </button>
//       </div>

//       <div className="details-card">
//         {/* TOP STATUS STRIP */}
//         <div className="details-strip">
//           <span className={`status-badge ${entry.status?.toLowerCase()}`}>
//             {entry.status || "Pending"}
//           </span>

//           <span className="movement-text">
//             {entry.movement_type || "-"}
//           </span>

//           <span className="time-text">
//             {entry.entry_time
//               ? new Date(entry.entry_time).toLocaleString()
//               : "-"}
//           </span>
//         </div>

//         {/* BASIC DETAILS */}
//         <div className="details-grid">
//           <div className="detail-item">
//             <label>Warehouse</label>
//             <p>{entry.warehouse_id || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Gate</label>
//             <p>{entry.gate_id || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Entry Type</label>
//             <p>{entry.entry_type || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Movement Type</label>
//             <p>{entry.movement_type || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Reference No</label>
//             <p>{entry.reference_no || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Vehicle Number</label>
//             <p>{entry.vehicle_number || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Driver Name</label>
//             <p>{entry.driver_name || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Driver Phone</label>
//             <p>{entry.driver_phone || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Person Name</label>
//             <p>{entry.person_name || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Company Name</label>
//             <p>{entry.company_name || "-"}</p>
//           </div>

//           <div className="detail-item">
//             <label>Entry Time</label>
//             <p>
//               {entry.entry_time
//                 ? new Date(entry.entry_time).toLocaleString()
//                 : "-"}
//             </p>
//           </div>

//           <div className="detail-item">
//             <label>Exit Time</label>
//             <p>
//               {entry.exit_time
//                 ? new Date(entry.exit_time).toLocaleString()
//                 : "-"}
//             </p>
//           </div>

//           <div className="detail-item">
//             <label>Remarks</label>
//             <p>{entry.remarks || "-"}</p>
//           </div>
//         </div>

//         {/* MATERIAL DETAILS */}
//         <div className="material-section">
//           <h3>Material Details</h3>

//           {entry.materials?.length > 0 ? (
//             <table className="material-table">
//               <thead>
//                 <tr>
//                   <th>SKU Code</th>
//                   <th>Description</th>
//                   <th>Quantity</th>
//                   <th>UOM</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {entry.materials.map((m, i) => (
//                   <tr key={i}>
//                     <td>{m.sku_code || "-"}</td>
//                     <td>{m.description || "-"}</td>
//                     <td>{m.quantity || "-"}</td>
//                     <td>{m.uom || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No materials saved</p>
//           )}
//         </div>

//         {/* DOCUMENT DETAILS */}
//         <div className="material-section">
//           <h3>Documents</h3>

//           {entry.documents?.length > 0 ? (
//             <table className="material-table">
//               <thead>
//                 <tr>
//                   <th>Document Type</th>
//                   <th>Document Number</th>
//                   <th>Upload URL</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {entry.documents.map((d, i) => (
//                   <tr key={i}>
//                     <td>{d.document_type || "-"}</td>
//                     <td>{d.document_number || "-"}</td>
//                     <td>{d.document_url || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No documents saved</p>
//           )}
//         </div>

//         {/* PHOTO DETAILS */}
//         <div className="material-section">
//           <h3>Photos</h3>

//           {entry.photos?.length > 0 ? (
//             <table className="material-table">
//               <thead>
//                 <tr>
//                   <th>Photo Type</th>
//                   <th>Preview</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {entry.photos.map((p, i) => (
//                   <tr key={i}>
//                     <td>{p.photo_type || "-"}</td>
//                     <td>
//                       {p.preview || p.url ? (
//                         <img
//                           src={p.preview || p.url}
//                           alt="preview"
//                           style={{
//                             width: "80px",
//                             height: "80px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                           }}
//                         />
//                       ) : (
//                         "No image"
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No photos saved</p>
//           )}
//         </div>

//         {/* INSPECTION DETAILS */}
//         <div className="material-section">
//           <h3>Inspection Details</h3>

//           <div className="details-grid">
//             <div className="detail-item">
//               <label>Vehicle Condition OK</label>
//               <p>
//                 {entry.vehicle_condition_ok ? "Yes" : "No"}
//               </p>
//             </div>

//             <div className="detail-item">
//               <label>Seal Number</label>
//               <p>{entry.seal_number || "-"}</p>
//             </div>

//             <div className="detail-item">
//               <label>Seal Intact</label>
//               <p>{entry.seal_intact ? "Yes" : "No"}</p>
//             </div>

//             <div className="detail-item">
//               <label>Temperature OK</label>
//               <p>
//                 {entry.temperature_ok ? "Yes" : "No"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ============================================================
// GateEntryDetails.jsx  —  FIXED
// Changes:
//  1. Photos: read p.photo_url (not p.preview || p.url)
//  2. Added remarks to the display grid (was missing)
//  3. Added retry / error state instead of bare alert
//  4. Cleaner null-safe rendering throughout
// ============================================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./G-details.css";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

export default function GateEntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEntry = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/gate-entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntry(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError("Failed to load entry details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error)
    return (
      <div className="loading">
        <p>{error}</p>
        <button onClick={fetchEntry}>Retry</button>
      </div>
    );
  if (!entry) return <p className="loading">No details found</p>;

  return (
    <div className="details-page">
      <div className="details-topbar">
        <div>
          <h1>{entry.gate_entry_id}</h1>
          <p>Gate Entry Full Details</p>
        </div>
        <button className="btn red" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="details-card">
        {/* ── STATUS STRIP ── */}
        <div className="details-strip">
          <span className={`status-badge ${entry.status?.toLowerCase()}`}>
            {entry.status || "Pending"}
          </span>
          <span className="movement-text">{entry.movement_type || "-"}</span>
          <span className="time-text">
            {entry.entry_time
              ? new Date(entry.entry_time).toLocaleString()
              : "-"}
          </span>
        </div>

        {/* ── BASIC DETAILS ── */}
        <div className="details-grid">
          <div className="detail-item">
            <label>Warehouse</label>
            <p>{entry.warehouse_id || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Gate</label>
            <p>{entry.gate_id || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Entry Type</label>
            <p>{entry.entry_type || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Movement Type</label>
            <p>{entry.movement_type || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Reference No</label>
            {/* FIX #12 — was showing "-" because backend wasn't returning remarks;
                now backend is fixed to return reference_no properly */}
            <p>{entry.reference_no || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Vehicle Number</label>
            <p>{entry.vehicle_number || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Driver Name</label>
            <p>{entry.driver_name || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Driver Phone</label>
            <p>{entry.driver_phone || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Person Name</label>
            <p>{entry.person_name || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Company Name</label>
            <p>{entry.company_name || "-"}</p>
          </div>
          <div className="detail-item">
            <label>Entry Time</label>
            <p>
              {entry.entry_time
                ? new Date(entry.entry_time).toLocaleString()
                : "-"}
            </p>
          </div>
          <div className="detail-item">
            <label>Exit Time</label>
            <p>
              {entry.exit_time
                ? new Date(entry.exit_time).toLocaleString()
                : "-"}
            </p>
          </div>
          {/* FIX #2 — Remarks was completely missing from this grid */}
          <div className="detail-item">
            <label>Remarks</label>
            <p>{entry.remarks || "-"}</p>
          </div>
        </div>

        {/* ── MATERIAL DETAILS ── */}
        <div className="material-section">
          <h3>Material Details</h3>
          {entry.materials?.length > 0 ? (
            <table className="material-table">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                {entry.materials.map((m, i) => (
                  <tr key={m.id ?? i}>
                    <td>{m.sku_code || "-"}</td>
                    <td>{m.description || "-"}</td>
                    <td>{m.quantity ?? "-"}</td>
                    <td>{m.uom || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No materials saved</p>
          )}
        </div>

        {/* ── DOCUMENTS ── */}
        <div className="material-section">
          <h3>Documents</h3>
          {entry.documents?.length > 0 ? (
            <table className="material-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Document Number</th>
                  <th>Upload URL</th>
                </tr>
              </thead>
              <tbody>
                {entry.documents.map((d, i) => (
                  <tr key={d.id ?? i}>
                    <td>{d.document_type || "-"}</td>
                    <td>{d.document_number || "-"}</td>
                    <td>
                      {d.document_url ? (
                        <a
                          href={d.document_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No documents saved</p>
          )}
        </div>

        {/* ── PHOTOS ── */}
        <div className="material-section">
          <h3>Photos</h3>
          {entry.photos?.length > 0 ? (
            <table className="material-table">
              <thead>
                <tr>
                  <th>Photo Type</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {entry.photos.map((p, i) => (
                  <tr key={p.id ?? i}>
                    <td>{p.photo_type || "-"}</td>
                    <td>
                      {/* FIX #11 — backend returns photo_url, not preview/url */}
                      {p.photo_url ? (
                        <img
                          src={p.photo_url}
                          alt={p.photo_type || "photo"}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No photos saved</p>
          )}
        </div>

        {/* ── INSPECTION ── */}
        <div className="material-section">
          <h3>Inspection Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Vehicle Condition OK</label>
              <p>{entry.vehicle_condition_ok ? "Yes" : "No"}</p>
            </div>
            <div className="detail-item">
              <label>Seal Number</label>
              <p>{entry.seal_number || "-"}</p>
            </div>
            <div className="detail-item">
              <label>Seal Intact</label>
              <p>{entry.seal_intact ? "Yes" : "No"}</p>
            </div>
            <div className="detail-item">
              <label>Temperature OK</label>
              <p>{entry.temperature_ok ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
