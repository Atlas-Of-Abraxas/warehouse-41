"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailStatus, setEmailStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      setEmailStatus({ type: "error", message: "Invalid email format" });
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: emailForm.currentPassword,
          newEmail: emailForm.newEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailStatus({ type: "error", message: data.error });
      } else {
        setEmailStatus({
          type: "success",
          message: "Email updated. Please sign out and sign in with your new email.",
        });
        setEmailForm({ currentPassword: "", newEmail: "" });
      }
    } catch {
      setEmailStatus({ type: "error", message: "Something went wrong" });
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "Password must be at least 8 characters",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordStatus({ type: "error", message: data.error });
      } else {
        setPasswordStatus({
          type: "success",
          message: "Password updated successfully.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch {
      setPasswordStatus({ type: "error", message: "Something went wrong" });
    } finally {
      setPasswordLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Update your admin login credentials.
      </p>

      <div className="grid gap-8 max-w-lg">
        {/* Change Email */}
        <form
          onSubmit={handleEmailChange}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Change Email</h2>

          {emailStatus && (
            <div
              className={`px-4 py-2 rounded text-sm mb-4 ${
                emailStatus.type === "success"
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {emailStatus.message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={emailForm.currentPassword}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, currentPassword: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Email
              </label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, newEmail: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={emailLoading}
              className="bg-[var(--color-accent)] text-white px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handlePasswordChange}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          {passwordStatus && (
            <div
              className={`px-4 py-2 rounded text-sm mb-4 ${
                passwordStatus.type === "success"
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {passwordStatus.message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
                minLength={8}
                className={inputClass}
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Minimum 8 characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
                minLength={8}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[var(--color-accent)] text-white px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
