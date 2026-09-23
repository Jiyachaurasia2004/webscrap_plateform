import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Save,
  LoaderCircle,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Settings = () => {
  const { user, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Name is required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.put(
        "/auth/profile",
        {
          name: name.trim(),
        }
      );

      if (response.data.success) {
        setMessage(
          "Profile updated successfully."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <SettingsIcon
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Settings
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage your account settings
              </p>
            </div>

          </div>

        </div>

        {message && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-5 py-4">
            {message}
          </div>
        )}

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-6 border-b border-slate-200">

            <h2 className="text-lg font-bold text-slate-900">
              Profile Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your personal information.
            </p>

          </div>

          <form
            onSubmit={handleUpdateProfile}
            className="p-6 space-y-6"
          >

            {/* Name */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500"
                />

              </div>

              <p className="text-xs text-slate-400 mt-2">
                Email cannot be changed from this page.
              </p>

            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-3 rounded-xl font-semibold"
            >
              {loading ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">

          <div className="p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Account
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Sign out from your WebScrape account.
            </p>

            <button
              onClick={logout}
              className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;