import axiosInstance from "../../libs/axios";
import { AuthResponse, ApiLoginRequest } from "../../stores/api/auth.api";

export const login = async (
  payload: ApiLoginRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    payload
  );
  
  // เก็บ token ใน localStorage
  if (response.data.token) {
    localStorage.setItem('auth-token', response.data.token);
  }
  
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
  // ลบ token จาก localStorage
  localStorage.removeItem('auth-token');
  sessionStorage.removeItem('auth-token');
};

export const fetchMe = async (): Promise<AuthResponse["user"]> => {
  try {
    // axios interceptor จะเพิ่ม token อัตโนมัติแล้ว
    const response = await axiosInstance.get("/auth/me");
    
    // ✅ ตรวจสอบ response data
    if (!response.data) {
      throw new Error("No user data received");
    }
    
    // ✅ Backend ส่ง user object โดยตรง (ไม่มี wrapper)
    if (typeof response.data === 'object' && response.data.users_id) {
      return response.data;
    }
    
    // ✅ ตรวจสอบว่า response.data เป็น user object หรือไม่ (fallback)
    if (typeof response.data === 'object' && response.data.user) {
      return response.data.user;
    }
    
    throw new Error("Invalid user data format");
  } catch (error) {
    console.error("❌ fetchMe error:", error);
    throw error;
  }
};

const authService = {
  login,
  logout,
  fetchMe,
};

export default authService;
