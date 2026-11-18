import { axiosClient } from "../api/axiosClient";
import type { LoginFormData, SignupFormData } from "@/validations/auth.validation";
import type { ApiResponse, User } from "@/types";

export const authService = {
  async login(credentials: LoginFormData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await axiosClient.post<ApiResponse<{ token: string; user: User }>>("/auth/login", credentials);
    return response.data;
  },

  async signup(data: SignupFormData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await axiosClient.post<ApiResponse<{ token: string; user: User }>>("/auth/signup", data);
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await axiosClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await axiosClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },
};

