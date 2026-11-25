import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Pin,
  Archive,
  User as UserIcon,
  LogOut,
  Edit3,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/utils";

interface AppSidebarProps {
  activeTab?: "dashboard" | "notes" | "pinned" | "archived" | "profile";
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get("filter");
  const { user, logout } = useAuthStore();

  // Highlight exact active tab
  const current = activeTab || (
    location.pathname.startsWith("/profile")
      ? "profile"
      : location.pathname.startsWith("/notes")
      ? "notes"
      : filter === "pinned"
      ? "pinned"
      : filter === "archived"
      ? "archived"
      : "dashboard"
  );

  const getInitials = (name?: string) => {
    if (!name) return "AZ";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to log out of your NotesApp account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5850ec",
      cancelButtonColor: "#e2e8f0",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-['Plus_Jakarta_Sans',sans-serif]",
        confirmButton: "rounded-xl font-semibold px-4 py-2 text-sm",
        cancelButton: "rounded-xl font-semibold px-4 py-2 text-sm text-slate-700",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <aside className="w-64 bg-[#0c0f24] text-white flex flex-col justify-between p-6 shrink-0 min-h-screen">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5850ec] flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            NotesApp
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
              current === "dashboard"
                ? "bg-[#5850ec] text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          {/* Dedicated My Notes Link */}
          <Link
            to="/notes"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
              current === "notes"
                ? "bg-[#5850ec] text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <FileText className="w-4 h-4" />
            <span>My Notes</span>
          </Link>

          <Link
            to="/notes?filter=pinned"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
              current === "pinned"
                ? "bg-[#5850ec] text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Pin className="w-4 h-4" />
            <span>Pinned</span>
          </Link>

          <Link
            to="/notes?filter=archived"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
              current === "archived"
                ? "bg-[#5850ec] text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Archive className="w-4 h-4" />
            <span>Archived</span>
          </Link>
        </nav>
      </div>

      {/* User & Profile Controls */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="space-y-1.5">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all",
              current === "profile"
                ? "bg-[#5850ec] text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* User Card with default initials avatar */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5850ec] to-purple-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">
              {user?.name || "Ammar Zahid"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.email || "ammar@example.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
