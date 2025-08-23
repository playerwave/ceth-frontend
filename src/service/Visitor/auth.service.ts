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
  // axios interceptor จะเพิ่ม token อัตโนมัติแล้ว
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

const authService = {
  login,
  logout,
  fetchMe,
};

export default authService;
