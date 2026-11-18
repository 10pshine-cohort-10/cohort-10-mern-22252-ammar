export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  memberSince?: string;
  status?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
