// src/api/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5090/api",
});

// ✅ interceptor: แนบ token อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token"); // หรือดึงจาก Zustand/Redux ก็ได้
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
