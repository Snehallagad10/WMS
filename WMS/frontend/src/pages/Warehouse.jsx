import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./Warehouses.css";

export default function Warehouse() {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    warehouses,
    setWarehouses,
    setSelectedWarehouse
  } = useOutletContext();
  console.log("WAREHOUSE DATA:", warehouses);

  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("ALL");
  const [sortKey,setSortKey] = useState("warehouse_name");
  const [page,setPage] = useState(1);
  const [dateFilter,setDateFilter] = useState("");

useEffect(() => {
  const loadWarehouses = async () => {
    try {
      const res = await API.get("/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Failed loading warehouses", err);
    }
  };
  loadWarehouses();

  
}, [location]);

const pageSize = 5;

let filtered = warehouses.filter(w => {

  const matchesDate =
    !dateFilter ||
    (w.created_at &&
      new Date(w.created_at).toLocaleDateString("en-CA") === dateFilter);

  const matchesSearch =
    w.warehouse_name?.toLowerCase().includes(search.toLowerCase()) ||
    w.warehouse_code?.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter==="ALL" || w.status===statusFilter;

  return matchesSearch && matchesStatus && matchesDate;
});

filtered.sort((a,b)=>{
  return String(a[sortKey] || "").localeCompare(
    String(b[sortKey] || "")
  );
});

const totalPages = Math.ceil(filtered.length / pageSize);

const paginated = filtered.slice(
  (page-1)*pageSize,
  page*pageSize
);

const deleteWarehouse = async(id)=>{
  await API.delete(`/warehouses/${id}`);
  setWarehouses(prev =>
    prev.filter(w => w.warehouse_id !== id)
  );
};

return (
<>
<div className="warehouse-page">

  <h1 className="warehouse-title">Warehouse Management</h1>
  <p className="warehouse-subtitle">
    Easily manage and monitor all warehouses across your platform.
  </p>

  {/* TOOLBAR */}
  <div className="warehouse-toolbar">

    <div className="toolbar-left">
      <input
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search"
        className="toolbar-input"
      />

      <select
        value={statusFilter}
        onChange={(e)=>setStatusFilter(e.target.value)}
        className="toolbar-input"
      >
        <option value="ALL">Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>

      <input
        type="date"
        value={dateFilter}
        onChange={(e)=>setDateFilter(e.target.value)}
        className="toolbar-pill"
      />

      <button
        onClick={()=>{
          setSelectedWarehouse(null);
          navigate("/add-warehouse");
        }}
        className="add-btn"
      >
        + Add Warehouse
      </button>
    </div>

  </div>

  {/* TABLE */}
  <div className="warehouse-card">

    <table className="warehouse-table">
      <thead>
        <tr>
          <th onClick={()=>setSortKey("warehouse_name")}>Warehouse Name</th>
          <th onClick={()=>setSortKey("warehouse_code")}>Code</th>
          <th>City</th>
          <th>State</th>
          <th>Status</th>
          <th>Created Date</th>
          <th className="actions-header">Actions</th>
        </tr>
      </thead>

      <tbody>
        {paginated.map((w)=>(
          <tr key={w.warehouse_id}>

            <td>{w.warehouse_name}</td>
            <td>{w.warehouse_code}</td>
            <td>{w.city}</td>
            <td>{w.state}</td>

            <td>
              <span
  className={
    w.status === "ACTIVE"
      ? "badge-active"
      : w.status === "FULL"
      ? "badge-full"
      : "badge-inactive"
  }
>
                {w.status}
              </span>
            </td>

            <td className="created-date">
              {w.created_at
                ? new Date(w.created_at).toLocaleDateString("en-CA")
                : "-"}
            </td>

            <td className="actions-cell">

              <td className="actions-cell">
  <FiEdit2
    className="edit-icon"
    onClick={() => {
      setSelectedWarehouse(w);
      navigate(`/add-warehouse`);
    }}
  />

  <div className="action-divider"></div>

  <FiTrash2
    className="delete-icon"
    onClick={() => deleteWarehouse(w.warehouse_id)}
  />
</td>

            </td>

          </tr>
        ))}
      </tbody>
    </table>

  </div>

  {/* PAGINATION */}
  <div className="pagination">
    {Array.from({length:totalPages}).map((_,i)=>(
      <button
        key={i}
        onClick={()=>setPage(i+1)}
        className={page===i+1 ? "page-active" : "page-btn"}
      >
        {i+1}
      </button>
    ))}
  </div>

</div>   {/* warehouse-page */}
</>
);
}