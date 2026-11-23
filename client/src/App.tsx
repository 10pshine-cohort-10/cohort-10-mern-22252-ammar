import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotesPage } from "./pages/NotesPage";
import { NoteEditorPage } from "./pages/NoteEditorPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuthStore } from "./stores/authStore";
import { authService } from "./services/auth/authService";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090c1f] flex items-center justify-center text-white text-sm font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { token, setAuth, logout, setLoading } = useAuthStore();

  useEffect(() => {
    let isSubscribed = true;
    const currentSessionToken = token;

    if (currentSessionToken) {
      setLoading(true);
      authService
        .getCurrentUser()
        .then((res) => {
          // Check that effect is still mounted and session hasn't changed
          const activeToken = useAuthStore.getState().token;
          if (isSubscribed && activeToken === currentSessionToken) {
            if (res.success && res.data) {
              setAuth(res.data, currentSessionToken);
            } else {
              logout();
            }
          }
        })
        .catch((error: unknown) => {
          const activeToken = useAuthStore.getState().token;
          if (isSubscribed && activeToken === currentSessionToken) {
            // Only clear session if server explicitly returns 401 Unauthorized
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              logout();
            }
            // In case of network errors or server downtime, retain existing stored credentials
          }
        })
        .finally(() => {
          if (isSubscribed) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard (with Analytics Charts) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Dedicated My Notes Page (without charts, pure notes management) */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />

        {/* Professional Note Editor Page */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <NoteEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <NoteEditorPage />
            </ProtectedRoute>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
