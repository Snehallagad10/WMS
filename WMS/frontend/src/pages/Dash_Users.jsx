import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useLocation } from "react-router-dom";

export default function Dash_Users() {

  const navigate = useNavigate();
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const createdUser = queryParams.get("created");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get("/users/", getAuthHeader());
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await API.get("/users/roles", getAuthHeader());
      setRoles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

const filteredUsers = users
  .filter(u => {
    const role = u.role_name?.toLowerCase() || "";
    return role !== "wms admin" && role !== "supervisor";
  })
  .filter(u => {
    const username = u.username?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";

    const matchSearch =
      username.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase());

    const matchRole =
      roleFilter === "" || u.role_name === roleFilter;

    return matchSearch && matchRole;
  });

const deleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  try {
    await API.delete(`/users/${id}`, getAuthHeader());
    loadUsers();
  } catch (err) {
    alert("Delete failed");
  }
};

return (
  <div style={styles.page}>
    <div style={styles.card}>
      <div style={styles.topHeader}>
        <div>
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>
            Manage users, roles, and warehouse assignments
          </p>
        </div>

        <button
          style={styles.createBtn}
          onClick={() => navigate("/users/create")}
        >
          + Add User
        </button>
      </div>

      <div style={styles.header}>
        <input
          style={styles.search}
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.filter}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Filter by Role</option>

          {roles.map((r) => (
            <option key={r.role_id} value={r.role_name}>
              {r.role_name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>NAME</th>
              <th style={styles.th}>ROLE</th>
              <th style={styles.th}>WAREHOUSE</th>
              <th style={styles.th}>PHONE</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>CREATED</th>
              <th style={styles.th}>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.user_id}
                style={styles.row}
                onClick={() =>
                  navigate(`/users/edit/${user.user_id}`)
                }
              >
                <td style={styles.td}>
                  <div style={styles.userBox}>
                    <div style={styles.avatar}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.name}>
                        {user.username}
                      </div>
                      <div style={styles.email}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={styles.td}>
                  <span style={styles.roleBadge}>
                    {user.role_name}
                  </span>
                </td>

                <td style={styles.td}>
                  {user.warehouse_name || "WH-Mumbai-01"}
                </td>

                <td style={styles.td}>
                  {user.phone || "-"}
                </td>

                <td style={styles.td}>
                  <span style={styles.statusBadge}>
                    {user.is_active ? "Active" : "Locked"}
                  </span>
                </td>

                <td style={styles.td}>
                  {user.created_at
                    ? user.created_at.slice(0, 10)
                    : "-"}
                </td>

                <td style={styles.td}>
                  <button
                    style={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUser(user.user_id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}
const styles = {
  page: {
    padding: "18px 20px",
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif"
  },

  card: {
    width: "100%",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
  },

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px"
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    color: "#111827"
  },

  subtitle: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#64748b"
  },

  header: {
    display: "flex",
    gap: "12px",
    marginBottom: "18px"
  },

  createBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },

  search: {
    flex: 1,
    height: "42px",
    padding: "0 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none"
  },

  filter: {
    width: "180px",
    height: "42px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none"
  },

  tableWrapper: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  thead: {
    background: "#f8fafc"
  },

  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    borderBottom: "1px solid #e5e7eb"
  },

  td: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#1e293b",
    borderBottom: "1px solid #f1f5f9"
  },

  row: {
    cursor: "pointer"
  },

  userBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px"
  },

  name: {
    fontWeight: "600",
    fontSize: "13px",
    color: "#111827"
  },

  email: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px"
  },

  roleBadge: {
    background: "#dbeafe",
    color: "#2563eb",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600"
  },

  statusBadge: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600"
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500"
  }
};
