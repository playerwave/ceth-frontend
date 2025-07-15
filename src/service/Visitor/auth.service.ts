import axiosInstance from "../../libs/axios";
import { AuthResponse, ApiLoginRequest } from "../../stores/api/auth.api";

export const login = async (
  payload: ApiLoginRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    payload
  );
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

export const fetchMe = async (): Promise<AuthResponse["user"]> => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

const authService = {
  login,
  logout,
  fetchMe,
};

export default authService;
