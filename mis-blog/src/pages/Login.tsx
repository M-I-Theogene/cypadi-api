import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import { ButtonSpinner } from "../components/ButtonSpinner";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await api.post("/admin/login", { username, password });
      localStorage.setItem("adminToken", data.token);

      const redirectPath =
        (location.state as any)?.from &&
        (location.state as any).from !== "/login"
          ? (location.state as any).from
          : "/";

      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Cypadi Blog Admin</h1>
        <p className="login-subtitle">
          Sign in to manage posts, comments and more.
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Username
            <input
              className="login-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Password
            <div className="login-password-field">
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <ButtonSpinner /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
