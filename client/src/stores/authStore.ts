import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

const defaultUser: User = {
  id: "user-1",
  name: "Ammara Zahid",
  email: "ammar@example.com",
  role: "Standard User",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  memberSince: "Nov 10, 2025",
  status: "Active",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultUser,
  token: typeof window !== "undefined" ? (localStorage.getItem("auth_token") || "demo-token") : "demo-token",
  isAuthenticated: true,
  setAuth: (user: User, token: string) => {
    localStorage.setItem("auth_token", token);
    set({ user, token, isAuthenticated: true });
  },
  updateUser: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
