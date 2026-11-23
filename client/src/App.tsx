import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen bg-[#f7f9fd] flex items-center justify-center p-6 text-center font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5850ec] text-white flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h1 className="text-xl font-bold text-slate-800">Welcome to Dashboard</h1>
                <p className="text-sm text-slate-500">
                  You are logged in. Dashboard features will be connected in the next phase.
                </p>
                <a
                  href="/login"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#5850ec] text-white text-xs font-semibold hover:bg-[#4a42db] transition-colors"
                >
                  Back to Login
                </a>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
