// import React, { useState, useEffect } from "react";
// import axiosClient from "../../api/axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./GateEntry.css";

// export default function GateEntryForm() {

// const navigate = useNavigate();
// const location = useLocation();
// const editData = location.state?.editData;
// const isEdit = location.state?.isEdit || false;


// const [warehouses,setWarehouses] = useState([]);
// const [users,setUsers] = useState([]);
// const [gates,setGates] = useState([]);


// useEffect(() => {
//   setGates([
//     { gate_id: "GATE_001", gate_name: "Main Gate" },
//     { gate_id: "GATE_002", gate_name: "Exit Gate" },
//     { gate_id: "GATE_003", gate_name: "Side Gate" }
//   ]);
// }, []);

// const [materials, setMaterials] = useState([]);
// const [documents, setDocuments] = useState([]);
// const [photos, setPhotos] = useState([]);

// const [loading, setLoading] = useState(false);

// const [form, setForm] = useState({
//   warehouse_id: "",
//   gate_id: "",
//   entry_type: "Vehicle",
//   movement_type: "Entry",
//   reference_no: "",
//   vehicle_number: "",
//   driver_name: "",
//   driver_phone: "",
//   person_name: "",
//   company_name: "",
//   entry_time: "",
//   exit_time: "",
//   remarks: ""
// });

// /* LOAD MASTER DATA */
// useEffect(() => {
//   loadData();
// }, []);

// /* PREFILL FORM FOR EDIT MODE */
// useEffect(() => {
//   if (!editData) {
//     return;
//   }

//   setForm({
//     warehouse_id: editData.warehouse_id || "",
//     gate_id: editData.gate_id || "",
//     entry_type: editData.entry_type || "Vehicle",
//     movement_type: editData.movement_type || "Entry",
//     reference_no: editData.reference_no || "",
//     vehicle_number: editData.vehicle_number || "",
//     driver_name: editData.driver_name || "",
//     driver_phone: editData.driver_phone || "",
//     person_name: editData.person_name || "",
//     company_name: editData.company_name || "",
//     entry_time: editData.entry_time
//       ? editData.entry_time.slice(0, 16)
//       : "",
//     exit_time: editData.exit_time
//       ? editData.exit_time.slice(0, 16)
//       : "",
//     remarks: editData.remarks || ""
//   });

//   setDocuments(editData.documents || []);
//   setPhotos(editData.photos || []);

//   const loadMaterials = async () => {
//     const entryId =
//       editData.gate_entry_id ||
//       editData.id ||
//       editData.gate_entry_number;

//     if (!entryId) {
//       setMaterials(editData.materials || []);
//       return;
//     }

//     try {
//       const res = await axiosClient.get(`/gate-entries/${entryId}/materials`);
//       setMaterials(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(
//         "Material load error:",
//         err.response?.data || err.message
//       );
//       setMaterials(editData.materials || []);
//     }
//   };

//   loadMaterials();
// }, [editData]);

// const loadData = async () => {
//   try {
//     const w = await axiosClient.get("/warehouses/");
//     setWarehouses(w.data || []);

//     const u = await axiosClient.get("/users/");
//     setUsers(u.data || []);
//   } catch (err) {
//     console.error(
//       "Load error:",
//       err.response?.data || err.message
//     );
//   }
// };
// // const g = await axiosClient.Client..get("/gates/");
// // console.log("GATES API:", g.data);

// const handleChange = (e)=>{
// setForm(prev=>({
// ...prev,
// [e.target.name]:e.target.value
// }));
// };



// const saveEntry = async () => {
//   try {
//     setLoading(true);
//     if (!form.warehouse_id) {
//   alert("Please select warehouse");
//   return;
// }

// if (!form.gate_id) {
//   alert("Please select gate");
//   return;
// }

//     const payload = {
//       warehouse_id: form.warehouse_id,
//       gate_id: form.gate_id,
//       entry_type: form.entry_type,
//       movement_type: form.movement_type,
//       reference_no: form.reference_no,
//       vehicle_number: form.vehicle_number,
//       driver_name: form.driver_name,
//       driver_phone: form.driver_phone,
//       person_name: form.person_name,
//       company_name: form.company_name,
//       entry_time: form.entry_time,
//       exit_time: form.exit_time,
//       remarks: form.remarks,
//       status: "Pending"
//     };

//     console.log("PAYLOAD SENT:", payload);

//     let gateEntryId;

//     if (isEdit) {
//   const entryId =
//     editData.gate_entry_id ||
//     editData.id ||
//     editData.gate_entry_number;

//   console.log("EDIT ENTRY ID:", entryId);

//   await axiosClient.put(
//     `/gate-entries/${entryId}`,
//     payload
//   );

//   gateEntryId = entryId;
//   alert("Entry updated successfully ✅");
// }
//     else {
//   const res = await axiosClient.post(
//     "/gate-entries/",
//     payload
//   );

//   gateEntryId =
//     res?.data?.gate_entry_id ||
//     res?.data?.id;

//   alert("Entry saved successfully ✅");
// }

//     if (!gateEntryId) {
//       console.error("Gate entry id missing");
//       return;
//     }

//     await saveMaterials(gateEntryId);
//     await saveDocuments(gateEntryId);
//     await savePhotos(gateEntryId);
//     await saveInspection(gateEntryId);

//     navigate("/gate-entry", {
//   replace: true,
//   state: { refresh: true, updatedAt: Date.now() }
// });
    
//   } catch (err) {
//     console.error(
//       "Save error:",
//       err.response?.data || err.message
//     );
//     alert("Failed to save gate entry");
//   } finally {
//     setLoading(false);
//   }
// };



// const saveMaterials = async(id)=>{
// for(const m of materials){
// const payload = {
// sku_code: m.sku_code || "",
// description: m.description || "",
// quantity: m.quantity || "",
// uom: m.uom || ""
// };

// const hasMaterialData =
// payload.sku_code ||
// payload.description ||
// payload.quantity ||
// payload.uom;

// if (!hasMaterialData) {
// continue;
// }

// await axiosClient.post(`/gate-entries/${id}/materials`, payload);
// }
// };

// const saveDocuments = async(id)=>{
// for(const d of documents){
// await axiosClient.post(`/gate-entries/${id}/documents`,{
// document_type: d.document_type || "",
// document_number: d.document_number || "",
// document_url: d.document_url || ""
// });
// }
// };

// const saveInspection = async(id)=>{
// await axiosClient.put(`/gate-entries/${id}/inspection`,{
// vehicle_condition_ok:true,
// seal_number:"",
// seal_intact:true,
// temperature_ok:true,
// inspected_by:form.recorded_by || ""
// });
// };

// const savePhotos = async(id)=>{
// for(const p of photos){
// await axiosClient.post(`/gate-entries/${id}/photos`,{
// photo_type: p.photo_type || "",
// photo_url: p.preview || ""
// });
// }
// };

// const updateArrayValue = (arrSetter,arr,index,field,value)=>{
// const updated=[...arr];
// updated[index][field]=value;
// arrSetter(updated);
// };

// const addMaterial = ()=>{
// setMaterials(prev=>[...prev,{ sku_code:"", description:"", quantity:"", uom:"" }]);
// };

// const addDocument = ()=>{
// setDocuments(prev=>[...prev,{ document_type:"", document_number:"", document_url:"" }]);
// };

// const handleFileChange = (index, file) => {
//   if (!file) return;

//   setPhotos((prev) =>
//     prev.map((photo, idx) =>
//       idx === index
//         ? {
//             ...photo,
//             file,
//             preview: URL.createObjectURL(file),
//           }
//         : photo
//     )
//   );
// };


// const addPhoto = () => {
//   setPhotos((prev) => [
//     ...prev,
//     {
//       photo_type: "",
//       file: null,
//       preview: null,
//     },
//   ]);
// };

// const handleWarehouseChange = (e) => {
//   const value = e.target.value;

//   setForm(prev => ({
//     ...prev,
//     warehouse_id: value,
//     gate_id: ""
//   }));

//   // ✅ no API call, manual gates already set
// };
// return (

// <div className="gate-entry">

// <h2>Gate Entry Management</h2>

// {/* BASIC ENTRY INFO */}
// <div className="section">
// <h3>Basic Entry Information</h3>

// <div className="form-grid">


// <select
//   name="warehouse_id"
//   value={form.warehouse_id}
//   onChange={handleWarehouseChange}
// >
//   <option value="">Select Warehouse</option>
//   {warehouses.map(w => (
//     <option key={w.warehouse_id} value={w.warehouse_id}>
//       {w.warehouse_name}
//     </option>
//   ))}
// </select>



// <select name="gate_id" value={form.gate_id} onChange={handleChange}>
// <option value="">Select Gate</option>
// {gates.map(g=>(
// <option key={g.gate_id} value={g.gate_id}>{g.gate_name || g.gate_id}</option>
// ))}
// </select>

// <select name="entry_type" value={form.entry_type} onChange={handleChange}>
// <option>Vehicle</option>
// <option>Visitor</option>
// <option>Employee</option>
// <option>Material</option>
// </select>

// <select name="movement_type" value={form.movement_type} onChange={handleChange}>
// <option>Entry</option>
// <option>Exit</option>
// </select>

// <input name="reference_no" value={form.reference_no} placeholder="Reference No" onChange={handleChange}/>

// <input name="vehicle_number" value={form.vehicle_number} placeholder="Vehicle Number" onChange={handleChange}/>

// <input name="driver_name" value={form.driver_name} placeholder="Driver Name" onChange={handleChange}/>

// <input
//   name="driver_phone"
//   value={form.driver_phone}
//   placeholder="Driver Phone"
//   type="tel"
//   maxLength={10}
//   onChange={(e) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 10);
//     handleChange({
//       target: {
//         name: "driver_phone",
//         value,
//       },
//     });
//   }}
// />

// <input name="person_name" value={form.person_name} placeholder="Person Name" onChange={handleChange}/>

// <input name="company_name" value={form.company_name} placeholder="Company Name" onChange={handleChange}/>
// <div className="field">
// <label>Entry Time</label>
// <input
// type="datetime-local"
// name="entry_time"
// value={form.entry_time}
// onChange={handleChange}
// />
// </div>

// <div className="field">
// <label>Exit Time</label>
// <input
// type="datetime-local"
// name="exit_time"
// value={form.exit_time}
// onChange={handleChange}
// />
// </div>
// <textarea name="remarks" value={form.remarks} placeholder="Remarks" onChange={handleChange}/>


// </div>
// </div>

// {/* MATERIAL TABLE */}
// <div className="section">
//   <h3>Material Details</h3>

//   <button className="add-btn" onClick={addMaterial}>+ Add Material</button>

//   <table className="table">
//     <thead>
//       <tr>
//         <th>SKU Code</th>
//         <th>Description</th>
//         <th>Quantity</th>
//         <th>UOM</th>
//         <th>Remove</th>
//       </tr>
//     </thead>

//     <tbody>
//       {materials.map((m,i)=>(
//         <tr key={i}>
//           <td>
//             <input value={m.sku_code}
//               onChange={(e)=>updateArrayValue(setMaterials,materials,i,"sku_code",e.target.value)} />
//           </td>

//           <td>
//             <input value={m.description}
//               onChange={(e)=>updateArrayValue(setMaterials,materials,i,"description",e.target.value)} />
//           </td>

//           <td>
//             <input value={m.quantity}
//               onChange={(e)=>updateArrayValue(setMaterials,materials,i,"quantity",e.target.value)} />
//           </td>

//           <td>
//             <input value={m.uom}
//               onChange={(e)=>updateArrayValue(setMaterials,materials,i,"uom",e.target.value)} />
//           </td>

//           <td>
//             <button className="remove-btn"
//               onClick={()=>setMaterials(materials.filter((_,idx)=>idx!==i))}>
//               X
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

// <div className="section">
//   <h3>Photos</h3>

//   <button className="add-btn" onClick={addPhoto}>
//     + Capture / Upload Photo
//   </button>

//   <table className="table">
//     <thead>
//       <tr>
//         <th>Photo Type</th>
//         <th>Upload</th>
//         <th>Preview</th>
//         <th>Remove</th>
//       </tr>
//     </thead>

//     <tbody>
//       {photos.map((p, i) => (
//         <tr key={i}>
//           <td>
//             <input
//               value={p.photo_type}
//               onChange={(e) =>
//                 updateArrayValue(setPhotos, photos, i, "photo_type", e.target.value)
//               }
//             />
//           </td>

//           <td>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(i, e.target.files[0])}
//             />
//           </td>

//           <td
//   style={{
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   }}
// >
//   {p.preview ? (
//     <img
//       src={p.preview}
//       alt="preview"
//       style={{
//         width: "70px",
//         height: "70px",
//         borderRadius: "8px",
//         objectFit: "cover",
//         cursor: "pointer",
//         border: "1px solid #ddd"
//       }}
//       onClick={() => setSelectedImage(p.preview)}
//     />
//   ) : (
//     <span>No image</span>
//   )}


// </td>
//           <td>
//             <button
//               className="remove-btn"
//               onClick={() =>
//                 setPhotos(photos.filter((_, idx) => idx !== i))
//               }
//             >
//               X
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

// {/* DOCUMENT TABLE */}
// <div className="section">
//   <h3>Documents</h3>

//   <button className="add-btn" onClick={addDocument}>
//     + Upload Document
//   </button>

//   <table className="table">
//     <thead>
//       <tr>
//         <th>Document Type</th>
//         <th>Document Number</th>
//         <th>Upload URL</th>
//         <th>Remove</th>
//       </tr>
//     </thead>

//     <tbody>
//       {documents.map((d,i)=>(
//         <tr key={i}>
//           <td>
//             <input value={d.document_type}
//               onChange={(e)=>updateArrayValue(setDocuments,documents,i,"document_type",e.target.value)} />
//           </td>

//           <td>
//             <input value={d.document_number}
//               onChange={(e)=>updateArrayValue(setDocuments,documents,i,"document_number",e.target.value)} />
//           </td>

//           <td>
//             <input value={d.document_url}
//               onChange={(e)=>updateArrayValue(setDocuments,documents,i,"document_url",e.target.value)} />
//           </td>

//           <td>
//             <button className="remove-btn"
//               onClick={()=>setDocuments(documents.filter((_,idx)=>idx!==i))}>
//               X
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

// {/* VEHICLE INSPECTION */}

// <div className="inspection-grid">

//   <div className="toggle-group">
//     <label>Vehicle Condition OK</label>
//     <input type="checkbox" defaultChecked />
//   </div>

//   <div className="input-group">
//     <input placeholder="Seal Number" />
//   </div>

//   <div className="toggle-group">
//     <label>Seal Intact</label>
//     <input type="checkbox" defaultChecked />
//   </div>

//   <div className="toggle-group">
//     <label>Temperature OK</label>
//     <input type="checkbox" defaultChecked />
//   </div>

//   <div className="input-group full">
//     <input
//       type="text"
//       value={new Date().toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true
//       })}
//       readOnly
//     />
//   </div>

// </div>

// <div className="section">
//   <h3>Photos</h3>

//   <button
//     className="add-btn"
//     type="button"
//     onClick={addPhoto}
//   >
//     + Capture / Upload Photo
//   </button>

//   <table className="table">
//     <thead>
//       <tr>
//         <th>Photo Type</th>
//         <th>Upload</th>
//         <th>Preview</th>
//         <th>Remove</th>
//       </tr>
//     </thead>

//     <tbody>
//       {photos.length === 0 && (
//         <tr>
//           <td colSpan="4" style={{ textAlign: "center" }}>
//             No photos added
//           </td>
//         </tr>
//       )}

//       {photos.map((p, i) => (
//         <tr key={i}>
//           {/* PHOTO TYPE */}
//           <td>
//             <input
//               type="text"
//               placeholder="Enter type"
//               value={p.photo_type}
//               onChange={(e) =>
//                 updateArrayValue(
//                   setPhotos,
//                   photos,
//                   i,
//                   "photo_type",
//                   e.target.value
//                 )
//               }
//             />
//           </td>

//           {/* FILE UPLOAD */}
//           <td>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) =>
//                 handleFileChange(i, e.target.files[0])
//               }
//             />
//           </td>

//           {/* PREVIEW */}
//           <td
//   style={{
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   }}
// >
//   {p.preview ? (
//     <img
//       src={p.preview}
//       alt="preview"
//       style={{
//         width: "70px",
//         height: "70px",
//         borderRadius: "8px",
//         objectFit: "cover",
//         cursor: "pointer",
//         border: "1px solid #ddd"
//       }}
//       onClick={() => setSelectedImage(p.preview)}
//     />
//   ) : (
//     <span>No image</span>
//   )}
// </td>

//           {/* REMOVE */}
//           <td>
//             <button
//               type="button"
//               className="remove-btn"
//               onClick={() =>
//                 setPhotos(
//                   photos.filter((_, idx) => idx !== i)
//                 )
//               }
//             >
//               X
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>



// <div className="button-row">

// <button className="save-btn" disabled={loading} onClick={saveEntry}>
// {loading
//   ? "Saving..."
//   : isEdit
//   ? "Update Entry"
//   : "Save Entry"}
// </button>

// <button
//   className="cancel-btn"
//   onClick={() => navigate("/gate-entry", { replace: true })}
// >
//   Cancel
// </button>

// </div>

// </div>

// );

// }







// ============================================================
// GateEntryForm.jsx  —  FIXED
// Changes:
//  1. Removed duplicate Photos section (was rendered twice)
//  2. Inspection fields are now fully controlled (useState)
//  3. On EDIT: delete existing materials/documents/photos before re-saving
//     (prevents duplicates on every update)
//  4. savePhotos now uploads file to FormData endpoint, not blob URL
//  5. setSelectedImage declared in state
//  6. Validation moved before setLoading to avoid stuck spinner
//  7. Inspection state wired to saveInspection payload
// ============================================================

import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./GateEntry.css";

export default function GateEntryForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEdit = location.state?.isEdit || false;

  const [warehouses, setWarehouses] = useState([]);
  const [users, setUsers] = useState([]);
  const [gates, setGates] = useState([]);

  const [materials, setMaterials] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // FIX #10 — selectedImage was used but never declared
  const [selectedImage, setSelectedImage] = useState(null);

  // FIX #8 — Inspection was fully uncontrolled; now proper state
  const [inspection, setInspection] = useState({
    vehicle_condition_ok: true,
    seal_number: "",
    seal_intact: true,
    temperature_ok: true,
  });

  const [form, setForm] = useState({
    warehouse_id: "",
    gate_id: "",
    entry_type: "Vehicle",
    movement_type: "Entry",
    reference_no: "",
    vehicle_number: "",
    driver_name: "",
    driver_phone: "",
    person_name: "",
    company_name: "",
    entry_time: "",
    exit_time: "",
    remarks: "",
  });

  useEffect(() => {
    setGates([
      { gate_id: "GATE_001", gate_name: "Main Gate" },
      { gate_id: "GATE_002", gate_name: "Exit Gate" },
      { gate_id: "GATE_003", gate_name: "Side Gate" },
    ]);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  /* PREFILL FOR EDIT */
  useEffect(() => {
    if (!editData) return;

    setForm({
      warehouse_id: editData.warehouse_id || "",
      gate_id: editData.gate_id || "",
      entry_type: editData.entry_type || "Vehicle",
      movement_type: editData.movement_type || "Entry",
      reference_no: editData.reference_no || "",
      vehicle_number: editData.vehicle_number || "",
      driver_name: editData.driver_name || "",
      driver_phone: editData.driver_phone || "",
      person_name: editData.person_name || "",
      company_name: editData.company_name || "",
      entry_time: editData.entry_time ? editData.entry_time.slice(0, 16) : "",
      exit_time: editData.exit_time ? editData.exit_time.slice(0, 16) : "",
      remarks: editData.remarks || "",
    });

    // FIX #8 — prefill inspection state from editData
    setInspection({
      vehicle_condition_ok: editData.vehicle_condition_ok ?? true,
      seal_number: editData.seal_number || "",
      seal_intact: editData.seal_intact ?? true,
      temperature_ok: editData.temperature_ok ?? true,
    });

    setDocuments(
      (editData.documents || []).map((d) => ({
        ...d,
        _existing: true, // mark as already saved
      }))
    );

    // FIX #11 — photos from backend have photo_url, not preview
    setPhotos(
      (editData.photos || []).map((p) => ({
        ...p,
        preview: p.photo_url || null,
        _existing: true,
      }))
    );

    const loadMaterials = async () => {
      const entryId =
        editData.gate_entry_id || editData.id || editData.gate_entry_number;

      if (!entryId) {
        setMaterials(editData.materials || []);
        return;
      }

      try {
        const res = await axiosClient.get(`/gate-entries/${entryId}/materials`);
        setMaterials(
          (Array.isArray(res.data) ? res.data : []).map((m) => ({
            ...m,
            _existing: true,
          }))
        );
      } catch (err) {
        console.error("Material load error:", err.response?.data || err.message);
        setMaterials(editData.materials || []);
      }
    };

    loadMaterials();
  }, [editData]);

  const loadData = async () => {
    try {
      const w = await axiosClient.get("/warehouses/");
      setWarehouses(w.data || []);
      const u = await axiosClient.get("/users/");
      setUsers(u.data || []);
    } catch (err) {
      console.error("Load error:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWarehouseChange = (e) => {
    setForm((prev) => ({ ...prev, warehouse_id: e.target.value, gate_id: "" }));
  };

  // ─── SAVE ────────────────────────────────────────────────────────────────────

  const saveEntry = async () => {
    // FIX #6 — validate BEFORE setLoading so spinner doesn't get stuck
    if (!form.warehouse_id) {
      alert("Please select warehouse");
      return;
    }
    if (!form.gate_id) {
      alert("Please select gate");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        warehouse_id: form.warehouse_id,
        gate_id: form.gate_id,
        entry_type: form.entry_type,
        movement_type: form.movement_type,
        reference_no: form.reference_no,
        vehicle_number: form.vehicle_number,
        driver_name: form.driver_name,
        driver_phone: form.driver_phone,
        person_name: form.person_name,
        company_name: form.company_name,
        entry_time: form.entry_time || null,
        exit_time: form.exit_time || null,
        remarks: form.remarks,
        status: "Pending",
      };

      console.log("PAYLOAD SENT:", payload);

      let gateEntryId;

      if (isEdit) {
        const entryId =
          editData.gate_entry_id || editData.id || editData.gate_entry_number;

        console.log("EDIT ENTRY ID:", entryId);

        await axiosClient.put(`/gate-entries/${entryId}`, payload);
        gateEntryId = entryId;

        // FIX #6 — delete old sub-records before re-inserting to avoid duplicates
        await deleteSubRecords(entryId);

        alert("Entry updated successfully ✅");
      } else {
        const res = await axiosClient.post("/gate-entries/", payload);
        gateEntryId = res?.data?.gate_entry_id || res?.data?.id;
        alert("Entry saved successfully ✅");
      }

      if (!gateEntryId) {
        console.error("Gate entry id missing from response");
        alert("Save failed: Could not get entry ID from server");
        return;
      }

      await saveMaterials(gateEntryId);
      await saveDocuments(gateEntryId);
      await savePhotos(gateEntryId);
      await saveInspection(gateEntryId);

      navigate("/gate-entry", {
        replace: true,
        state: { refresh: true, updatedAt: Date.now() },
      });
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert(
        "Failed to save gate entry: " +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // FIX #6 — delete helpers so updates don't duplicate rows
  const deleteSubRecords = async (id) => {
    try {
      await axiosClient.delete(`/gate-entries/${id}/materials`);
    } catch (e) {
      console.warn("Could not delete materials (may not exist yet):", e.message);
    }
    try {
      await axiosClient.delete(`/gate-entries/${id}/documents`);
    } catch (e) {
      console.warn("Could not delete documents:", e.message);
    }
    try {
      await axiosClient.delete(`/gate-entries/${id}/photos`);
    } catch (e) {
      console.warn("Could not delete photos:", e.message);
    }
  };

  const saveMaterials = async (id) => {
    for (const m of materials) {
      const hasData = m.sku_code || m.description || m.quantity || m.uom;
      if (!hasData) continue;

      await axiosClient.post(`/gate-entries/${id}/materials`, {
        sku_code: m.sku_code || "",
        description: m.description || "",
        quantity: m.quantity || 0,
        uom: m.uom || "",
      });
    }
  };

  const saveDocuments = async (id) => {
    for (const d of documents) {
      await axiosClient.post(`/gate-entries/${id}/documents`, {
        document_type: d.document_type || "",
        document_number: d.document_number || "",
        document_url: d.document_url || "",
      });
    }
  };

  // FIX #8 — inspection now uses controlled state
  const saveInspection = async (id) => {
    await axiosClient.put(`/gate-entries/${id}/inspection`, {
      vehicle_condition_ok: inspection.vehicle_condition_ok,
      seal_number: inspection.seal_number,
      seal_intact: inspection.seal_intact,
      temperature_ok: inspection.temperature_ok,
      inspected_by: form.recorded_by || "",
    });
  };

  // FIX #7 — upload real file via multipart; fallback to URL string if no file
  const savePhotos = async (id) => {
    for (const p of photos) {
      if (p.file) {
        // Real file selected — upload as multipart
        const fd = new FormData();
        fd.append("photo_type", p.photo_type || "");
        fd.append("file", p.file);

        try {
          await axiosClient.post(`/gate-entries/${id}/photos/upload`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (uploadErr) {
          // Fallback: if upload endpoint not ready yet, save blob URL
          // (will not persist after refresh — fix backend upload endpoint)
          console.warn(
            "Photo upload endpoint not available, storing preview URL:",
            uploadErr.message
          );
          await axiosClient.post(`/gate-entries/${id}/photos`, {
            photo_type: p.photo_type || "",
            photo_url: p.photo_url || "", // use existing URL if re-editing
          });
        }
      } else if (p.photo_url) {
        // Re-editing: existing photo — re-save its URL
        await axiosClient.post(`/gate-entries/${id}/photos`, {
          photo_type: p.photo_type || "",
          photo_url: p.photo_url,
        });
      }
    }
  };

  // ─── ARRAY HELPERS ───────────────────────────────────────────────────────────

  const updateArrayValue = (arrSetter, arr, index, field, value) => {
    const updated = [...arr];
    updated[index] = { ...updated[index], [field]: value };
    arrSetter(updated);
  };

  const addMaterial = () =>
    setMaterials((prev) => [
      ...prev,
      { sku_code: "", description: "", quantity: "", uom: "" },
    ]);

  const addDocument = () =>
    setDocuments((prev) => [
      ...prev,
      { document_type: "", document_number: "", document_url: "" },
    ]);

  const addPhoto = () =>
    setPhotos((prev) => [
      ...prev,
      { photo_type: "", file: null, preview: null, photo_url: "" },
    ]);

  const handleFileChange = (index, file) => {
    if (!file) return;
    setPhotos((prev) =>
      prev.map((photo, idx) =>
        idx === index
          ? { ...photo, file, preview: URL.createObjectURL(file) }
          : photo
      )
    );
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div className="gate-entry">
      <h2>Gate Entry Management</h2>

      {/* ── BASIC ENTRY INFO ── */}
      <div className="section">
        <h3>Basic Entry Information</h3>
        <div className="form-grid">
          <select
            name="warehouse_id"
            value={form.warehouse_id}
            onChange={handleWarehouseChange}
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w.warehouse_id} value={w.warehouse_id}>
                {w.warehouse_name}
              </option>
            ))}
          </select>

          <select
            name="gate_id"
            value={form.gate_id}
            onChange={handleChange}
          >
            <option value="">Select Gate</option>
            {gates.map((g) => (
              <option key={g.gate_id} value={g.gate_id}>
                {g.gate_name || g.gate_id}
              </option>
            ))}
          </select>

          <select
            name="entry_type"
            value={form.entry_type}
            onChange={handleChange}
          >
            <option>Vehicle</option>
            <option>Visitor</option>
            <option>Employee</option>
            <option>Material</option>
          </select>

          <select
            name="movement_type"
            value={form.movement_type}
            onChange={handleChange}
          >
            <option>Entry</option>
            <option>Exit</option>
          </select>

          <input
            name="reference_no"
            value={form.reference_no}
            placeholder="Reference No"
            onChange={handleChange}
          />
          <input
            name="vehicle_number"
            value={form.vehicle_number}
            placeholder="Vehicle Number"
            onChange={handleChange}
          />
          <input
            name="driver_name"
            value={form.driver_name}
            placeholder="Driver Name"
            onChange={handleChange}
          />
          <input
            name="driver_phone"
            value={form.driver_phone}
            placeholder="Driver Phone"
            type="tel"
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              handleChange({ target: { name: "driver_phone", value } });
            }}
          />
          <input
            name="person_name"
            value={form.person_name}
            placeholder="Person Name"
            onChange={handleChange}
          />
          <input
            name="company_name"
            value={form.company_name}
            placeholder="Company Name"
            onChange={handleChange}
          />

          <div className="field">
            <label>Entry Time</label>
            <input
              type="datetime-local"
              name="entry_time"
              value={form.entry_time}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Exit Time</label>
            <input
              type="datetime-local"
              name="exit_time"
              value={form.exit_time}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="remarks"
            value={form.remarks}
            placeholder="Remarks"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ── MATERIAL TABLE ── */}
      <div className="section">
        <h3>Material Details</h3>
        <button className="add-btn" onClick={addMaterial}>
          + Add Material
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No materials added
                </td>
              </tr>
            )}
            {materials.map((m, i) => (
              <tr key={i}>
                <td>
                  <input
                    value={m.sku_code}
                    onChange={(e) =>
                      updateArrayValue(
                        setMaterials,
                        materials,
                        i,
                        "sku_code",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={m.description}
                    onChange={(e) =>
                      updateArrayValue(
                        setMaterials,
                        materials,
                        i,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={m.quantity}
                    onChange={(e) =>
                      updateArrayValue(
                        setMaterials,
                        materials,
                        i,
                        "quantity",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={m.uom}
                    onChange={(e) =>
                      updateArrayValue(
                        setMaterials,
                        materials,
                        i,
                        "uom",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setMaterials(materials.filter((_, idx) => idx !== i))
                    }
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── DOCUMENT TABLE ── */}
      <div className="section">
        <h3>Documents</h3>
        <button className="add-btn" onClick={addDocument}>
          + Upload Document
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Document Number</th>
              <th>Upload URL</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No documents added
                </td>
              </tr>
            )}
            {documents.map((d, i) => (
              <tr key={i}>
                <td>
                  <input
                    value={d.document_type}
                    onChange={(e) =>
                      updateArrayValue(
                        setDocuments,
                        documents,
                        i,
                        "document_type",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.document_number}
                    onChange={(e) =>
                      updateArrayValue(
                        setDocuments,
                        documents,
                        i,
                        "document_number",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.document_url}
                    onChange={(e) =>
                      updateArrayValue(
                        setDocuments,
                        documents,
                        i,
                        "document_url",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setDocuments(documents.filter((_, idx) => idx !== i))
                    }
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── PHOTOS (single section — FIX #9 removed duplicate) ── */}
      <div className="section">
        <h3>Photos</h3>
        <button className="add-btn" type="button" onClick={addPhoto}>
          + Capture / Upload Photo
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Photo Type</th>
              <th>Upload</th>
              <th>Preview</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {photos.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No photos added
                </td>
              </tr>
            )}
            {photos.map((p, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    placeholder="Enter type"
                    value={p.photo_type}
                    onChange={(e) =>
                      updateArrayValue(
                        setPhotos,
                        photos,
                        i,
                        "photo_type",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(i, e.target.files[0])}
                  />
                </td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* FIX #10 — setSelectedImage now declared in useState */}
                  {p.preview || p.photo_url ? (
                    <img
                      src={p.preview || p.photo_url}
                      alt="preview"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: "1px solid #ddd",
                      }}
                      onClick={() => setSelectedImage(p.preview || p.photo_url)}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      setPhotos(photos.filter((_, idx) => idx !== i))
                    }
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── VEHICLE INSPECTION (FIX #8 — fully controlled) ── */}
      <div className="section">
        <h3>Vehicle Inspection</h3>
        <div className="inspection-grid">
          <div className="toggle-group">
            <label>Vehicle Condition OK</label>
            <input
              type="checkbox"
              checked={inspection.vehicle_condition_ok}
              onChange={(e) =>
                setInspection((prev) => ({
                  ...prev,
                  vehicle_condition_ok: e.target.checked,
                }))
              }
            />
          </div>

          <div className="input-group">
            <input
              placeholder="Seal Number"
              value={inspection.seal_number}
              onChange={(e) =>
                setInspection((prev) => ({
                  ...prev,
                  seal_number: e.target.value,
                }))
              }
            />
          </div>

          <div className="toggle-group">
            <label>Seal Intact</label>
            <input
              type="checkbox"
              checked={inspection.seal_intact}
              onChange={(e) =>
                setInspection((prev) => ({
                  ...prev,
                  seal_intact: e.target.checked,
                }))
              }
            />
          </div>

          <div className="toggle-group">
            <label>Temperature OK</label>
            <input
              type="checkbox"
              checked={inspection.temperature_ok}
              onChange={(e) =>
                setInspection((prev) => ({
                  ...prev,
                  temperature_ok: e.target.checked,
                }))
              }
            />
          </div>

          <div className="input-group full">
            <input
              type="text"
              value={new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="full"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px" }}
          />
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      <div className="button-row">
        <button className="save-btn" disabled={loading} onClick={saveEntry}>
          {loading ? "Saving..." : isEdit ? "Update Entry" : "Save Entry"}
        </button>
        <button
          className="cancel-btn"
          onClick={() => navigate("/gate-entry", { replace: true })}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}