import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ButtonSpinner } from "../components/ButtonSpinner";
import "./Profile.css";

interface AdminProfile {
  _id: string;
  username: string;
  email: string;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get("/admin/profile");
      setProfile(data);
      setFormData((prev) => ({
        ...prev,
        username: data.username,
      }));
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match if new password is provided
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("New passwords do not match");
      return;
    }

    // Validate password length
    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      const updateData: any = {
        username: formData.username,
      };

      // Only include password fields if new password is provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const data = await api.put("/admin/profile", updateData);
      setProfile(data.admin);
      toast.success("Profile updated successfully!");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="profile-loading">
            <ScaleLoader
              color="#facc15"
              height={35}
              width={4}
              radius={2}
              margin={2}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Management</h1>
          <p>Update your account credentials</p>
        </div>

        <div className="profile-card">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={profile?.email || ""}
                disabled
                className="disabled-input"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="password-section">
              <h3>Change Password</h3>
              <p className="section-description">
                Leave blank if you don't want to change your password
              </p>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-field">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    disabled={!formData.newPassword}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    tabIndex={-1}
                    aria-label={
                      showPassword.current
                        ? "Hide current password"
                        : "Show current password"
                    }
                    disabled={!formData.newPassword}
                  >
                    {showPassword.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-field">
                  <input
                    type={showPassword.next ? "text" : "password"}
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        next: !prev.next,
                      }))
                    }
                    aria-label={
                      showPassword.next
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showPassword.next ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-field">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={!formData.newPassword}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    tabIndex={-1}
                    aria-label={
                      showPassword.confirm
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                    disabled={!formData.newPassword}
                  >
                    {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <ButtonSpinner /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};


