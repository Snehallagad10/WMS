import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import API from "../api";
import "./AddWarehouse.css";   // ⭐ NORMAL CSS

export default function AddWarehouse() {

  const navigate = useNavigate();

  const {
    warehouses,
    setWarehouses,
    selectedWarehouse,
    setSelectedWarehouse
  } = useOutletContext();

  // ================= FORM STATE =================
  const [form,setForm] = useState({
    warehouse_code:"",
    warehouse_name:"",
    status:"ACTIVE",
    address_line1:"",
    address_line2:"",
    city:"",
    state:"",
    country:"",
    postal_code:"",
    total_area_sqft:""
  });

  // ================= LOAD EDIT DATA =================
  useEffect(()=>{
    if(selectedWarehouse){
      setForm({
        warehouse_code: selectedWarehouse.warehouse_code || "",
        warehouse_name: selectedWarehouse.warehouse_name || "",
        status: selectedWarehouse.status || "ACTIVE",
        address_line1: selectedWarehouse.address_line1 || "",
        address_line2: selectedWarehouse.address_line2 || "",
        city: selectedWarehouse.city || "",
        state: selectedWarehouse.state || "",
        country: selectedWarehouse.country || "",
        postal_code: selectedWarehouse.postal_code || "",
        total_area_sqft: selectedWarehouse.total_area_sqft || ""
      });
    }
  },[selectedWarehouse]);

  // ================= INPUT CHANGE =================
  const update = (key,val)=>{
    setForm(prev=>({...prev,[key]:val}));
  };

  // ================= SAVE =================
  const saveWarehouse = async()=>{

    try{

      if(selectedWarehouse){

        const res = await API.put(
          `/warehouses/${selectedWarehouse.warehouse_id}`,
          form
        );

        setWarehouses(prev =>
          prev.map(w =>
            w.warehouse_id === selectedWarehouse.warehouse_id
              ? res.data
              : w
          )
        );

      }else{

        const res = await API.post("/warehouses/",form);
        setWarehouses(prev => [...prev, res.data]);

      }

      // ⭐ FIXED LOGIC
      setSelectedWarehouse(null);
      navigate("/warehouse");

    }catch(err){
      console.error("Save failed",err);
    }

  };

return (

  <div className="addwarehouse-page">

    <h1 className="addwarehouse-title">
      {selectedWarehouse ? "Edit Warehouse" : "Add Warehouse"}
    </h1>

    {/* FORM CARD */}
    <div className="addwarehouse-card">

      <input
        placeholder="Warehouse Code"
        value={form.warehouse_code}
        onChange={(e)=>update("warehouse_code",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="Warehouse Name"
        value={form.warehouse_name}
        onChange={(e)=>update("warehouse_name",e.target.value)}
        className="form-input"
      />

      <select
        value={form.status}
        onChange={(e)=>update("status",e.target.value)}
        className="form-input"
      >
        <option>ACTIVE</option>
        <option>INACTIVE</option>
      </select>

      <input
        placeholder="Address Line 1"
        value={form.address_line1}
        onChange={(e)=>update("address_line1",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="Address Line 2"
        value={form.address_line2}
        onChange={(e)=>update("address_line2",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="City"
        value={form.city}
        onChange={(e)=>update("city",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="State"
        value={form.state}
        onChange={(e)=>update("state",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="Country"
        value={form.country}
        onChange={(e)=>update("country",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="Postal Code"
        value={form.postal_code}
        onChange={(e)=>update("postal_code",e.target.value)}
        className="form-input"
      />

      <input
        placeholder="Total Area (sqft)"
        value={form.total_area_sqft}
        onChange={(e)=>update("total_area_sqft",e.target.value)}
        className="form-input"
      />

    </div>

    {/* BUTTONS */}
    <div className="btn-group">

      <button
        onClick={saveWarehouse}
        className="save-btn"
      >
        {selectedWarehouse ? "Save Changes" : "Save"}
      </button>

      <button
        onClick={()=>navigate("/warehouse")}
        className="cancel-btn"
      >
        Cancel
      </button>

    </div>

  </div>
);
}