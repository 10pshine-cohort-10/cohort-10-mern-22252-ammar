import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Read saved state on initial script load
const savedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
let initialUser: User | null = null;
try {
  if (savedUserStr) {
    initialUser = JSON.parse(savedUserStr);
  }
} catch {
  initialUser = null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken),
  isLoading: Boolean(savedToken && !initialUser),

  setAuth: (user: User, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  updateUser: (data) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...data } : null;
      if (typeof window !== "undefined" && updatedUser) {
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
