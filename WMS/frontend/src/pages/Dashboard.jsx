import { useOutletContext } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const { warehouses, selectedWarehouse } = useOutletContext() || {};

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <div className="dashboard-topbar__title">Warehouse Management System</div>

        <div className="dashboard-topbar__right">
          <span className="dashboard-topbar__bell">{"\uD83D\uDD14"}</span>

          <div className="dashboard-profile">
            <div>
              <div className="dashboard-profile__name">Admin</div>
              <div className="dashboard-profile__role">Administrator</div>
            </div>

            <div className="dashboard-profile__avatar">A</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-heading">
          <h1 className="dashboard-heading__title">Dashboard</h1>
          <p className="dashboard-heading__subtitle">
            Overview of warehouse operations
          </p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card dashboard-card--blue">
            <p className="dashboard-card__label">Total Warehouses</p>
            <h2 className="dashboard-card__value">{warehouses?.length || 0}</h2>
          </div>

          <div className="dashboard-card dashboard-card--green">
            <p className="dashboard-card__label">Active Warehouse</p>
            <h2 className="dashboard-card__value">{selectedWarehouse ? "1" : "0"}</h2>
          </div>

          <div className="dashboard-card dashboard-card--amber">
            <p className="dashboard-card__label">System Status</p>
            <h2 className="dashboard-card__value">Live</h2>
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="dashboard-section__title">Overview</h3>

          <p className="dashboard-section__text">
            Welcome to the Warehouse Management Dashboard.
          </p>

          {selectedWarehouse && (
            <p className="dashboard-section__text dashboard-section__text--highlight">
              Selected Warehouse: <b>{selectedWarehouse.name}</b>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
