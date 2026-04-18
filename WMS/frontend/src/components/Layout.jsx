import React, { useState } from "react";
import { AppSidebar } from "./Sidebar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main
        style={{
          marginLeft: collapsed ? "70px" : "220px",
          marginTop: "58px",
          padding: "20px",
          minHeight: "100vh",
          background: "#f8fafc",
          transition: "all 0.3s ease"
        }}
      >
        {children}
      </main>
    </div>
  );
}