import apiClient from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "./types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/Auth/login",
      credentials,
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/Auth/register",
      userData,
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined") return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem("token");
  },

  async agreeToTerms() {
    const response = await apiClient.post("/Auth/agree-terms");
    return response.data;
  },

  async getCurrentUserFromApi() {
    const response = await apiClient.get("/Auth/me");
    return response.data;
  },
};
