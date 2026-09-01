import { useState } from "react";

function PharmacistLogin({
  onLogin,
  goBack,
  pharmacists = [],
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    const enteredUsername = username.trim();
    const enteredPassword = password;

    const pharmacist = pharmacists.find(
      (item) =>
        String(item.username || "").trim() ===
          enteredUsername &&
        String(item.password || "") ===
          enteredPassword
    );

    if (!pharmacist) {
      alert("Invalid pharmacist username or password.");
      return;
    }

    if (!pharmacist.pharmacy) {
      alert(
        "No pharmacy is assigned to this pharmacist."
      );
      return;
    }

    onLogin(pharmacist);
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-icon">
          👨‍⚕️
        </div>

        <h1>Pharmacist Login</h1>

        <p>
          Login to manage your assigned pharmacy
        </p>

        <div className="admin-form">

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter pharmacist username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter pharmacist password"
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
            className="admin-login-button"
            onClick={handleLogin}
          >
            🔑 Login
          </button>

          <button
            className="admin-back-button"
            onClick={goBack}
          >
            ← Back
          </button>

        </div>

        <div className="demo-login">
          <p>
            Login using the credentials created
            by Admin.
          </p>
        </div>

      </div>
    </main>
  );
}

export default PharmacistLogin;