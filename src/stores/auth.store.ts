import { create } from "zustand";
import axiosInstance from "../libs/axios"; // ✅ ใช้ axiosInstance แบบ code 2
import { AxiosError } from "axios";

const API_URL = "/auth"; // ✅ ตัด localhost ออกเพราะ axiosInstance ตั้ง baseURL ไว้แล้ว

interface User {
  u_id: number;
  u_email: string;
  u_fullname: string;
  isVerify: boolean;
  u_role: "admin" | "student"; // ✅ เพิ่มตรงนี้
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  login: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(`${API_URL}/login`, { email });
      console.log("🧩 User Response:", res.data.user);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || "Login failed",
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError;
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axiosInstance.get(`${API_URL}/check-auth`);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));
