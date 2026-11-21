import { axiosClient } from "../api/axiosClient";
import type { LoginFormData, SignupFormData } from "@/validations/auth.validation";
import type { ApiResponse, User } from "@/types";

export const authService = {
  async login(credentials: LoginFormData): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const response = await axiosClient.post<ApiResponse<{ token: string; user: User }>>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signup(data: SignupFormData): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await axiosClient.post<ApiResponse<{ user: User }>>("/auth/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await axiosClient.get<ApiResponse<User>>("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<ApiResponse<User>> {
    try {
      const response = await axiosClient.put<ApiResponse<User>>("/auth/profile", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await axiosClient.post<ApiResponse<null>>("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
