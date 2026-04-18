import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import API from "../api";

export default function UserManagementPage() {

  const location = useLocation(); 
  const roleRef = useRef(null);
  const warehouseRef = useRef(null);
  

  
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    status: "active"
  });

  const [roles, setRoles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  const { id } = useParams();
const [editMode, setEditMode] = useState(false);
useEffect(() => {
  if (id) {
    setEditMode(true);
  }
}, [id]);

useEffect(() => {
  if (id && roles.length > 0 && warehouses.length > 0) {
    fetchUserById();
  }
}, [id, roles, warehouses]);
  


  const fetchUserById = async () => {
  try {
    const res = await API.get("/users/", getAuthHeader());

    const found = res.data.find(u => u.user_id === id);

    if (!found) return;

    // ✅ BASIC INFO
    setUserInfo(prev => ({
      ...prev,
      username: found.username || "",
      email: found.email || "",
      phone: found.phone || "",
      status: found.force_password_change
  ? "reset"
  : found.is_locked
  ? "locked"
  : "active"
    }));

    // ✅ ROLE PREFILL
    const role = roles.find(r => r.role_name === found.role_name);
    if (role) {
      setSelectedRoles([role.role_id]);
    }

    
    if (found.warehouse_ids) {
setSelectedWarehouses(found.warehouse_ids || []);
    }

  } catch (err) {
    console.error("Failed to fetch user");
  }
};

  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Login again");
      window.location.href="/";
      return {};
    }

    return {
      headers:{ Authorization:`Bearer ${token}` }
    };
  };

  useEffect(()=>{
    fetchRoles();
    fetchWarehouses();
  },[]);

  useEffect(()=>{

    const handleClickOutside = (event)=>{

      if(roleRef.current && !roleRef.current.contains(event.target)){
        setShowRoleDropdown(false);
      }

      if(warehouseRef.current && !warehouseRef.current.contains(event.target)){
        setShowWarehouseDropdown(false);
      }

    };

    document.addEventListener("mousedown",handleClickOutside);

    return ()=>{
      document.removeEventListener("mousedown",handleClickOutside);
    };

  },[]);

  const fetchRoles = async ()=>{
    try{
      const res = await API.get("/users/roles",getAuthHeader());
      setRoles(Array.isArray(res.data)?res.data:[]);
    }catch{
      setRoles([]);
    }
  };

  const fetchWarehouses = async ()=>{
    try{
      const res = await API.get("/warehouses/",getAuthHeader());
      setWarehouses(Array.isArray(res.data)?res.data:[]);
    }catch{
      setWarehouses([]);
    }
  };

  const handleChange=(e)=>{
    const {name,value} = e.target;

    setUserInfo(prev=>({
      ...prev,
      [name]:value
    }));
  };

  const toggleRole = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const toggleWarehouse=(id)=>{
    if(selectedWarehouses.includes(id)){
      setSelectedWarehouses(selectedWarehouses.filter(w=>w!==id));
    }else{
      setSelectedWarehouses([...selectedWarehouses,id]);
    }
  };

  const handleSubmit = async()=>{


    if (userInfo.password !== userInfo.confirmPassword) {
  alert("Passwords do not match");
  return;
}
    const payload={

      user_information:{
        username:userInfo.username,
        email:userInfo.email,
        phone:userInfo.phone,
        password:userInfo.password,
        confirm_password:userInfo.confirmPassword,
        status: userInfo.status  

      },


      

      // ✅ FIXED ROLE PAYLOAD
    assigned_roles: selectedRoles.map(roleId => {
  const role = roles.find(r => r.role_id === roleId);

  if (!role || !role.role_code) {
    alert("Role code missing — check backend /users/roles API");
    return null;
  }

  return { role_code: role.role_code };
}).filter(Boolean),

      // ✅ FIXED WAREHOUSE PAYLOAD
      assigned_warehouses:selectedWarehouses.map(id=>({
        warehouse_id:id
      }))
    };

    try{
      const res = await API.post("/users/",payload,getAuthHeader());

      alert(`User created\nUsername:${res.data.username}`);
      window.location.href = "/users?refresh=" + Date.now();

      // setSelectedRoles([]);
      // setSelectedWarehouses([]);

    }catch(error){
      alert(error.response?.data?.detail || "Failed");
    }

  };
  
const handleUpdate = async () => {
  try {

    if (userInfo.password && userInfo.password !== userInfo.confirmPassword) {
  alert("Passwords do not match");
  return;
}

    const payload = {
  user_information: {
    username: userInfo.username,
    email: userInfo.email,
    phone: userInfo.phone,
   
    status: userInfo.status
  },

      assigned_roles: selectedRoles.map(roleId => {
        const role = roles.find(r => r.role_id === roleId);
        return role ? { role_code: role.role_code } : null;
      }).filter(Boolean),

      assigned_warehouses: selectedWarehouses.map(id => ({
        warehouse_id: id
      }))
    };

    await API.put(
      `/users/${id}`,
      payload,
      getAuthHeader()
    );

    
alert("User updated ✅");
window.location.href = "/users?refresh=" + Date.now();

  } catch (err) {
    alert("Update failed");
  }
};
  // ✅ redirect fix
  return(

   <div style={styles.container}>
  <div style={styles.card}>

      

  <h2 style={styles.title}>
    {editMode ? "Update User" : "Create User"}
  </h2>

  <h3 style={styles.sectionTitle}>User Information</h3>

  <div style={styles.formGrid}>
    <label style={styles.label}>Username*</label>
    <input style={styles.input} name="username" value={userInfo.username} onChange={handleChange}/>

    <label>Email*</label>
    <input style={styles.input} name="email" value={userInfo.email} onChange={handleChange}/>

    <label>Phone</label>
    <input style={styles.input} name="phone" value={userInfo.phone} onChange={handleChange}/>


    {!editMode && (
      <>
        <label>Password*</label>
        <input
          style={styles.input}
          type="password"
          name="password"
          value={userInfo.password}
          onChange={handleChange}
        />

        <label>Confirm Password</label>
        <input
          style={styles.input}
          type="password"
          name="confirmPassword"
          value={userInfo.confirmPassword}
          onChange={handleChange}
        />
      </>
    )}
  </div>

  {/* STATUS */}
  <div style={styles.radioRow}>
    {["active", "locked", "reset"].map(status => (
      <label key={status} style={styles.radioLabel}>
        <input
          type="radio"
          name="status"
          value={status}
          checked={userInfo.status === status}
          onChange={handleChange}
        />
        {status === "reset" ? "Force Reset Password" : status.charAt(0).toUpperCase() + status.slice(1)}
      </label>
    ))}
  </div>

  {/* ROLES */}
  <h3 style={styles.sectionTitle}>Assign Roles</h3>

  <div style={styles.dropdownWrapper} ref={roleRef}>
    <div
      style={styles.dropdownButton}
      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
    >
      {selectedRoles.length > 0 ? `${selectedRoles.length} selected` : "Select roles..."}
    </div>

    {showRoleDropdown && (
      <div style={styles.dropdownMenu}>
        {roles.map(role => (
          <label key={role.role_id} style={styles.dropdownItem}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={selectedRoles.includes(role.role_id)}
              onChange={() => toggleRole(role.role_id)}
            />
            <span style={styles.itemText}>{role.role_name}</span>
          </label>
        ))}
      </div>
    )}
  </div>

  {/* SELECTED ROLES */}
  <div style={styles.selectedBox}>
    {selectedRoles.map(id => {
      const role = roles.find(r => r.role_id === id);
      return (
        <span key={id} style={styles.tag}>
          {role?.role_name}
        </span>
      );
    })}
  </div>

  {/* WAREHOUSE */}
  <h3 style={styles.sectionTitle}>Assign Warehouses</h3>

  <div style={styles.dropdownWrapper} ref={warehouseRef}>
    <div
      style={styles.dropdownButton}
      onClick={() => setShowWarehouseDropdown(!showWarehouseDropdown)}
    >
      {selectedWarehouses.length > 0 ? `${selectedWarehouses.length} selected` : "Select warehouses..."}
    </div>

    {showWarehouseDropdown && (
      <div style={styles.dropdownMenu}>
        {warehouses.map(wh => (
          <label
            key={wh.warehouse_id}   // ✅ FIXED BUG
            style={styles.dropdownItem}
          >
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={selectedWarehouses.includes(wh.warehouse_id)}
              onChange={() => toggleWarehouse(wh.warehouse_id)}
            />
            <span style={styles.itemText}>{wh.warehouse_name}</span>
          </label>
        ))}
      </div>
    )}
  </div>

  <div style={styles.selectedBox}>
    {selectedWarehouses.map(id => {
      const wh = warehouses.find(w => w.warehouse_id === id);
      return (
        <span key={id} style={styles.tag}>
          {wh?.warehouse_name}
        </span>
      );
    })}
  </div>

  <button
    style={styles.saveBtn}
    onClick={editMode ? handleUpdate : handleSubmit}
  >
    {editMode ? "Update User" : "Save User"}
  </button>
</div>
  </div>
);
}



const styles = {
  container: {
    padding: "32px",
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif"
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb"
  },

  title: {
    fontSize: "34px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px"
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "15px",
    marginBottom: "28px"
  },

  sectionTitle: {
    marginTop: "28px",
    marginBottom: "12px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#374151"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: "14px",
    alignItems: "center"
  },

  label: {
    fontWeight: "500",
    color: "#374151",
    fontSize: "14px"
  },

  input: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
    transition: "0.2s"
  },

  radioRow: {
    display: "flex",
    gap: "24px",
    marginTop: "20px",
    flexWrap: "wrap",
    padding: "12px 0"
  },

  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: "500"
  },

  dropdownWrapper: {
    position: "relative",
    width: "420px"
  },

  dropdownButton: {
    border: "1px solid #d1d5db",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#fff",
    fontSize: "14px"
  },

  dropdownMenu: {
    position: "absolute",
    top: "52px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    width: "420px",
    padding: "8px",
    zIndex: 10,
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    maxHeight: "240px",
    overflowY: "auto"
  },

  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  checkbox: {
    width: "16px",
    height: "16px"
  },

  itemText: {
    flex: 1,
    fontSize: "14px",
    color: "#374151"
  },

  selectedBox: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },

  tag: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "7px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "500"
  },

  saveBtn: {
    marginTop: "32px",
    padding: "14px 28px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 4px 14px rgba(79,70,229,0.3)"
  }
};
