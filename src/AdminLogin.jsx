import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLogin, goBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      alert("Invalid admin username or password.");
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        {/* BRAND */}

        <div className="admin-login-brand">
          <div className="admin-login-logo">
            💊
          </div>

          <div>
            <h2>MediPharm</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        {/* TITLE */}

        <div className="admin-login-heading">

          <div className="admin-login-icon">
            🔐
          </div>

          <h1>Welcome Back</h1>

          <p>
            Sign in to manage the MediPharm system
          </p>

        </div>

        {/* FORM */}

        <div className="admin-login-form">

          <div className="admin-input-group">

            <label>
              Username
            </label>

            <div className="admin-input-wrapper">

              <span>👤</span>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />

            </div>

          </div>

          <div className="admin-input-group">

            <label>
              Password
            </label>

            <div className="admin-input-wrapper">

              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          <button
            className="admin-login-button-clean"
            onClick={handleLogin}
          >
            Login to Admin Panel
            <span>→</span>
          </button>

        </div>

        {/* DEMO LOGIN */}

        <div className="admin-demo-box">

          <div className="demo-title">
            <span>💡</span>
            Demo Credentials
          </div>

          <div className="demo-row">
            <span>Username</span>
            <strong>admin</strong>
          </div>

          <div className="demo-row">
            <span>Password</span>
            <strong>admin123</strong>
          </div>

        </div>

        {/* BACK */}

        <button
          className="admin-back-home"
          onClick={goBack}
        >
          ← Back to Home
        </button>

      </div>

    </main>
  );
}

export default AdminLogin;