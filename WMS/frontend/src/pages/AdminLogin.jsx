import React, { useState } from "react";
import axiosClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";



export default function AdminLogin() {
  const navigate = useNavigate();


  // =============================
  // STATE (ADDED)
  // =============================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =============================
  // HANDLE LOGIN (REGISTER FIRST)
  // =============================




  
  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await axiosClient.post("/auth/login", {
      username,
      password,
    });

    console.log(res.data);

    const token = res.data.access_token || res.data.token;
    const role = res.data.roles?.[0] || "wms_admin";

    // 🔥 IMPORTANT SAFETY CHECK
    if (!token) {
      alert("Login Failed");
      return;
    }

    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);

    if (role === "wms_admin") {
      alert("Login success");
window.location.href = "/dashboard";
    } else if (role === "supervisor") {
      navigate("/supervisor-dashboard");
    }

  } catch (err) {
    console.error(err);
    alert("Login Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
    className="login-page"
   
  >
  

      {/* ================= LEFT SIDE ================= */}
      <div className="login-left">
        <h1>
          Optimize Warehouse.
          <br />
          Deliver Results.
        </h1>

        <div className="feature">
          <div className="feature-icon">🏭</div>
          <div>
            <h3>
              Streamline Operations
            </h3>
            <p>
              Improve inventory tracking, order fulfillment, and warehouse
              efficiency with our powerful WMS solutions.
            </p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">📊</div>
          <div>
            <h3>
              Enhance Visibility
            </h3>
            <p>
              Gain real-time insights and detailed reporting to monitor stock
              levels and performance.
            </p>
          </div>
        </div>
      </div>

      {/* ================= LOGIN CARD ================= */}
      <div className="login-right">
        <div
         className="login-card">
          <h2>
            WMS Login
          </h2>          

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="login-input"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="login-input"
          />

          {/* Remember */}
          <label className="remember">
            <input type="checkbox" />
            Remember me
          </label>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="login-btn"          
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-subtext">
            Don't have an account ?
            <span>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
