import axiosInstance from "../../libs/axios";
import { AuthResponse, ApiLoginRequest } from "../../stores/api/auth.api";

export const login = async (
  payload: ApiLoginRequest
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      payload
    );
    
    // ✅ ตรวจสอบ response data
    if (!response.data) {
      throw new Error("No response data received");
    }
    
    // เก็บ token ใน localStorage
    if (response.data.token) {
      localStorage.setItem('auth-token', response.data.token);
      // ✅ เพิ่ม token ไปยัง axios instance
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
  // ลบ token จาก localStorage
  localStorage.removeItem('auth-token');
  sessionStorage.removeItem('auth-token');
};

export const fetchMe = async (): Promise<AuthResponse["user"]> => {
  try {
    console.log("🔍 [fetchMe] Starting fetchMe request...");
    
    // ✅ ดึง token จาก localStorage เพื่อตรวจสอบ
    const token = localStorage.getItem('auth-token');
    console.log("🎫 [fetchMe] Token from localStorage:", token ? "Token exists" : "No token");
    
    if (!token) {
      throw new Error("No token found in localStorage");
    }
    
    // ✅ Axios interceptor จะจัดการ Authorization header อัตโนมัติ
    console.log("📡 [fetchMe] Making request to /auth/me...");
    const response = await axiosInstance.get<AuthResponse["user"]>("/auth/me");
    
    console.log("✅ [fetchMe] Response received:", response.data);
    
    if (!response.data) {
      throw new Error("No response data received");
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ [fetchMe] Error:", error);
    throw error;
  }
};

const authService = {
  login,
  logout,
  fetchMe,
};

export default authService;
