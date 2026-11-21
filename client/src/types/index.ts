export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  memberSince?: string;
  createdAt?: string;
  status?: string;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteStats {
  total: number;
  pinned: number;
  archived: number;
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
  statusCode?: number;
  message: string;
  data: T;
}
