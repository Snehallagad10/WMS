import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Warehouse", path: "/warehouse" },
  { name: "Users", path: "/users" },
  { name: "Gate Entry", path: "/gate-entry" },
  { name: "Dock Allocation", path: "/dock-allocation" },
  { name: "Unloading List", path: "/unloading-list" },
  { name: "Unloading", path: "/unloading" },
  { name: "Permissions", path: "/permissions" }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__logo-box">
        <span className="app-sidebar__eyebrow">Warehouse Control</span>
        <h2 className="app-sidebar__logo">WareFlow</h2>
        <p className="app-sidebar__subtitle">Management System</p>
      </div>

      <nav className="app-sidebar__menu" aria-label="Sidebar navigation">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`app-sidebar__item${
              isActive(item.path) ? " app-sidebar__item--active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="app-sidebar__item-label">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
