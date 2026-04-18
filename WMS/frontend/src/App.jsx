import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AddWarehouse from "./pages/AddWarehouse";
import Warehouse from "./pages/Warehouse";
import UserManagementPage from "./pages/User";
import Dash_Users from "./pages/Dash_Users";
import GateEntryList from "./pages/gate-entry/GateEntryList";
import GateEntryForm from "./pages/gate-entry/GateEntryForm";
import GateEntryDetails from "./pages/gate-entry/GateEntryDetails";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import Permissions from "./pages/permissions";
import UnloadingPage from "./pages/Unloading";
import UnloadingList from "./pages/UnloadingDetails";
import DockAllocation from "./pages/DockAllocation";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="unloading" element={<UnloadingPage />} />
          <Route path="unloading-list" element={<UnloadingList />} />
          <Route path="unloading-details" element={<UnloadingList />} />
          <Route path="dock-allocation" element={<DockAllocation />} />
          <Route path="add-warehouse" element={<AddWarehouse />} />
          <Route path="warehouse" element={<Warehouse />} />
          <Route path="users" element={<Dash_Users />} />
          <Route path="users/create" element={<UserManagementPage />} />
          <Route path="users/edit/:id" element={<UserManagementPage />} />
          <Route path="gate-entry" element={<GateEntryList />} />
          <Route path="gate-entry/new" element={<GateEntryForm />} />
          <Route path="gate-entry/:id" element={<GateEntryDetails />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="supervisor-dashboard" element={<SupervisorDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
