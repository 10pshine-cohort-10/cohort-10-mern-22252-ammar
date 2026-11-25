import React, { useState } from "react";
import { Calendar, ShieldCheck, Edit2, LogOut, Check } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth/authService";

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "Ammar Zahid");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getInitials = (userName?: string) => {
    if (!userName) return "AZ";
    const parts = userName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return userName.slice(0, 2).toUpperCase();
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await authService.updateProfile({ name: name.trim() });
      if (res.success && res.data) {
        updateUser({ name: res.data.name });
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const memberSinceFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Nov 10, 2025";

  return (
    <div className="flex min-h-screen bg-[#f8faff] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar */}
      <AppSidebar activeTab="profile" />

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card matching image design */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
            {/* User Identity Section */}
            <div className="flex items-center gap-6">
              {/* Default Avatar with clean initials */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#5850ec] via-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-2xl uppercase shadow-md shadow-indigo-600/30">
                  {getInitials(user?.name)}
                </div>
              </div>

              {/* Name & Email */}
              <div className="space-y-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3 py-1.5 text-base font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5850ec]"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-3 py-1.5 bg-[#5850ec] text-white text-xs font-semibold rounded-xl"
                    >
                      {isSaving ? "..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <h2 className="text-xl font-extrabold text-slate-800">
                    {user?.name || "Ammar Zahid"}
                  </h2>
                )}

                <p className="text-xs text-slate-400 font-medium">
                  {user?.email || "ammar@example.com"}
                </p>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{user?.status || "Active Account"}</span>
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-2xl flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully in MongoDB!</span>
              </div>
            )}

            {/* Account Details Rows */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm py-2">
                <div className="flex items-center gap-3 text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Member Since</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {memberSinceFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-600 font-medium">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Account Status</span>
                </div>
                <span className="font-semibold text-emerald-600">
                  {user?.status || "Active"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-3 px-4 rounded-2xl border border-indigo-200 text-[#5850ec] hover:bg-indigo-50/50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
