import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axios";
import "./permissions.css";

export default function Permissions() {

    const [roles, setRoles] = useState([]);
    const [permissionsData, setPermissionsData] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [showModal, setShowModal] = useState(false);

    // ✅ FIX 1: ADD THIS
    const [isEditMode, setIsEditMode] = useState(false);
    const [roleFilter, setRoleFilter] = useState("");


    useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchRolePermissions();

}, []);

    const fetchRoles = async () => {
        const res = await axiosClient.get("/roles/");
        setRoles(res.data);
    };

    const fetchPermissions = async () => {
        const res = await axiosClient.get("/permissions");
        setPermissionsData(res.data);
    };

    const fetchRolePermissions = async () => {
        const res = await axiosClient.get("/roles/with-permissions");
        setTableData(res.data);
    };

    const groupedPermissions = useMemo(() => {
        return permissionsData.reduce((acc, p) => {
            const module = p.module || "others";
            if (!acc[module]) acc[module] = [];
            acc[module].push(p);
            return acc;
        }, {});
    }, [permissionsData]);

    const togglePermission = (code) => {
        if (selectedPermissions.includes(code)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== code));
        } else {
            setSelectedPermissions([...selectedPermissions, code]);
        }
    };

    // ✅ EDIT MODE
    const handleEditRole = (row) => {
        setShowModal(true);
        setIsEditMode(true);   // ✅ FIX
        setSelectedRole(row.role_code);
        setSelectedPermissions(row.permissions || []);
    };

    // ✅ CREATE MODE
    const handleCreate = () => {
        setShowModal(true);
        setIsEditMode(false);  // ✅ FIX
        setSelectedRole("");
        setSelectedPermissions([]);
    };

    const savePermissions = async () => {
        if (!selectedRole) {
            alert("Please select a role");
            return;
        }

        try {
            const roleObj = roles.find(r => r.role_code === selectedRole);

            const token = localStorage.getItem("access_token");

            await axiosClient.put(
                `/roles/${roleObj.role_id}/permissions`,
                { permissions: selectedPermissions },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            await fetchRolePermissions();

            setShowModal(false);
            setSelectedPermissions([]);
            setSelectedRole("");
            setIsEditMode(false);

            alert("Permissions updated successfully");

        } catch {
            alert("Failed to save permissions");
        }
    };

    const deleteRole = async (roleCode) => {
        if (!window.confirm("Delete this role?")) return;

        const roleObj = roles.find(r => r.role_code === roleCode);

        await axiosClient.delete(`/roles/${roleObj.role_id}`);

        fetchRolePermissions();
    };

  return (
  <div className="roles-page">

    {/* HEADER */}
    <div className="page-header">
      <div>
        <h1 className="page-title">Roles & Permissions</h1>
        <p className="page-subtitle">
          Manage user roles, access levels, and module permissions
        </p>
      </div>

      <button className="assign-btn" onClick={handleCreate}>
        + Assign New Role
      </button>
    </div>


    {/* FILTERS */}
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search role name or permission..."
        className="search-input"
      />

     <select
  className="filter-select"
  value={roleFilter}
  onChange={(e) => setRoleFilter(e.target.value)}
>
  <option value="">All Roles</option>

  {roles.map((role) => (
    <option key={role.role_id} value={role.role_name}>
      {role.role_name}
    </option>
  ))}
</select>

      <select className="filter-select">
        <option>Recently Updated</option>
      </select>
    </div>

    {/* TABLE */}
    <table className="roles-table">
      <thead>
        <tr>
          <th>Role Name</th>
          <th>Permissions</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {tableData
  .filter(
    row =>
      row.permissions &&
      row.permissions.length > 0 &&
      (roleFilter === "" || row.role === roleFilter)
  )
          .map((row, index) => (
            <tr
              key={index}
              onClick={() => handleEditRole(row)}
              style={{ cursor: "pointer" }}
            >
              <td>{row.role}</td>

              <td>
                {Object.entries(
                  row.permissions.reduce((acc, p) => {
                    const [module, action] = p.split(".");
                    if (!acc[module]) acc[module] = [];
                    acc[module].push(action);
                    return acc;
                  }, {})
                ).map(([module, actions], i) => (
                  <div key={i} className="permission-row">
                    <span className="module-chip">{module}</span>
                    <span>{actions.join(", ")}</span>
                  </div>
                ))}
              </td>

              <td className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRole(row);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRole(row.role_code);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>

    {/* MODAL */}
    {showModal && (
      <div className="modal-overlay">
        <div className="modal">

          <h2>
            {isEditMode
              ? "Edit Role Permissions"
              : "Assign Role Permissions"}
          </h2>

          <label>Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => {
              const roleCode = e.target.value;
              setSelectedRole(roleCode);

              const roleData = tableData.find(
                r => r.role_code === roleCode
              );
              setSelectedPermissions(roleData?.permissions || []);
            }}
            disabled={isEditMode}
          >
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.role_id} value={r.role_code}>
                {r.role_name}
              </option>
            ))}
          </select>

          <h3>Permissions</h3>

          {Object.keys(groupedPermissions).map(module => (
            <div key={module} className="module-card">
              <b>Module: {module}</b>

              {groupedPermissions[module].map(p => (
                <label key={p.permission_code}>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(
                      p.permission_code
                    )}
                    onChange={() =>
                      togglePermission(p.permission_code)
                    }
                  />
                  {p.action}
                </label>
              ))}
            </div>
          ))}

          <div className="modal-buttons">
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedRole("");
                setSelectedPermissions([]);
                setIsEditMode(false);
              }}
            >
              Cancel
            </button>

            <button onClick={savePermissions}>Save</button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}