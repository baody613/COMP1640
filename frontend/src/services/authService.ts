import apiClient from "../api";
import type { LoginRequest, RegisterRequest, User } from "../types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  async login(data: LoginRequest): Promise<User> {
    try {
      const response = await apiClient.post("/auth/login", data);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user || response.data));
      }

      return user || response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<User> {
    try {
      const response = await apiClient.post("/auth/register", data);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user || response.data));
      }

      return user || response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get("/auth/me");
      const user = response.data;

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      this.logout();
      throw error;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
