import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import axiosClient from "../../api/axios";
import "./GateEntryList.css";

export default function GateEntryList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { warehouses = [] } = useOutletContext() || {};

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosClient.get("/gate-entries/");
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setEntries(data);
      } catch (err) {
        console.error("Gate entry list load error:", err);
        setEntries([]);

        const status = err.response?.status;
        const detail =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to load gate entries from the backend.";

        if (status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          navigate("/login", { replace: true });
          return;
        }

        if (status === 403) {
          setError(`Access denied: ${detail}`);
          return;
        }

        setError(detail);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [location.state, navigate]);

  const warehouseMap = useMemo(() => {
    return warehouses.reduce((acc, warehouse) => {
      acc[warehouse.warehouse_id] = warehouse.warehouse_name;
      return acc;
    }, {});
  }, [warehouses]);

  const getMovementType = (entry) => {
    return (entry.movement_type || entry.movementType || entry.movement || entry.type || "")
      .toString()
      .trim()
      .toLowerCase();
  };

  const getMovementLabel = (entry) => {
    const movement = getMovementType(entry);
    return movement === "exit" || movement === "outward" ? "Outward" : "Inward";
  };

  const getMovementClass = (entry) => {
    const movement = getMovementType(entry);
    return movement === "exit" || movement === "outward"
      ? "gate-entry-list__type gate-entry-list__type--outward"
      : "gate-entry-list__type gate-entry-list__type--inward";
  };

  const getStatusClass = (status) => {
    const value = (status || "pending").toLowerCase();

    if (value === "completed") {
      return "gate-entry-list__status gate-entry-list__status--completed";
    }

    if (value === "approved") {
      return "gate-entry-list__status gate-entry-list__status--approved";
    }

    return "gate-entry-list__status gate-entry-list__status--pending";
  };

  const formatTimestamp = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const filteredEntries = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const movement = getMovementType(entry);
      const isOutward = movement === "exit" || movement === "outward";
      const tabMatch =
        activeTab === "all" ||
        (activeTab === "inward" && !isOutward) ||
        (activeTab === "outward" && isOutward);

      const searchMatch =
        !searchTerm ||
        [
          entry.gate_entry_id,
          entry.vehicle_number,
          entry.driver_name,
          entry.company_name,
          entry.material_name,
          warehouseMap[entry.warehouse_id],
        ]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(searchTerm));

      return tabMatch && searchMatch;
    });
  }, [activeTab, entries, search, warehouseMap]);

  const inwardCount = entries.filter((entry) => {
    const movement = getMovementType(entry);
    return movement !== "exit" && movement !== "outward";
  }).length;

  const outwardCount = entries.filter((entry) => {
    const movement = getMovementType(entry);
    return movement === "exit" || movement === "outward";
  }).length;

  return (
    <div className="gate-entry-list">
      <div className="gate-entry-list__topbar">
        <div className="gate-entry-list__topbar-title">Warehouse Management System</div>

        <div className="gate-entry-list__topbar-profile">
          <span className="gate-entry-list__bell">{"\uD83D\uDD14"}</span>
          <div>
            <div className="gate-entry-list__profile-name">Admin</div>
            <div className="gate-entry-list__profile-role">Administrator</div>
          </div>
          <div className="gate-entry-list__avatar">A</div>
        </div>
      </div>

      <div className="gate-entry-list__content">
        <div className="gate-entry-list__header">
          <div>
            <h1 className="gate-entry-list__title">Gate Entry Management</h1>
            <p className="gate-entry-list__subtitle">
              Track vehicle inward and outward entries
            </p>
          </div>

          <button className="gate-entry-list__new-btn" onClick={() => navigate("/gate-entry/new")}>
            + New Entry
          </button>
        </div>

        <div className="gate-entry-list__search-row">
          <div className="gate-entry-list__search-box">
            <span className="gate-entry-list__search-icon">{"\u2315"}</span>
            <input
              className="gate-entry-list__search-input"
              placeholder="Search by entry #, vehicle, or transporter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="gate-entry-list__tabs">
          <button
            className={`gate-entry-list__tab${activeTab === "all" ? " gate-entry-list__tab--active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All ({entries.length})
          </button>

          <button
            className={`gate-entry-list__tab${activeTab === "inward" ? " gate-entry-list__tab--active" : ""}`}
            onClick={() => setActiveTab("inward")}
          >
            Inward ({inwardCount})
          </button>

          <button
            className={`gate-entry-list__tab${activeTab === "outward" ? " gate-entry-list__tab--active" : ""}`}
            onClick={() => setActiveTab("outward")}
          >
            Outward ({outwardCount})
          </button>
        </div>

        <div className="gate-entry-list__table-card">
          <div className="gate-entry-list__table-wrap">
            <table className="gate-entry-list__table">
              <thead>
                <tr>
                  <th>Entry #</th>
                  <th>Type</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Transporter</th>
                  <th>Material</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="gate-entry-list__state">
                      Loading gate entries...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="gate-entry-list__state gate-entry-list__state--error">
                      {error}
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="gate-entry-list__state">
                      No matching gate entries found.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, index) => (
                    <tr
                      key={entry.gate_entry_id || index}
                      className="gate-entry-list__row"
                      onClick={() =>
                        navigate("/gate-entry/new", {
                          state: {
                            editData: entry,
                            isEdit: true,
                          },
                        })
                      }
                    >
                      <td>{entry.gate_entry_id || "-"}</td>
                      <td>
                        <span className={getMovementClass(entry)}>{getMovementLabel(entry)}</span>
                      </td>
                      <td>{entry.vehicle_number || "-"}</td>
                      <td>{entry.driver_name || "-"}</td>
                      <td>{entry.company_name || "-"}</td>
                      <td>{entry.material_name || "-"}</td>
                      <td>{entry.qty || "-"}</td>
                      <td>
                        <span className={getStatusClass(entry.status)}>{entry.status || "Pending"}</span>
                      </td>
                      <td>{formatTimestamp(entry.entry_time || entry.exit_time)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && (
            <div className="gate-entry-list__footer-note">Showing {filteredEntries.length} entries</div>
          )}
        </div>
      </div>
    </div>
  );
}
