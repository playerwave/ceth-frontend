// axios.ts
import axios, { AxiosInstance } from "axios";

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl) return envUrl;                 // ใช้ค่าจาก .env.[mode] ก่อนเสมอ
  
  // Preview mode: ใช้ Cloudflare proxy
  if (import.meta.env.MODE === "preview") {
    return "/api/";
  }
  
  // Development mode: ใช้ localhost
  if (import.meta.env.DEV) {
    return "http://localhost:8069/api/";
  }
  
  // Production mode: ใช้ Cloudflare proxy
  return "/api/";
};

const getCredentials = () => {
  const c = (import.meta.env.VITE_WITH_CREDENTIALS as string) ?? "";
  if (c) return c === "true";                // allow override
  
  // Preview mode: ปิด credentials เพื่อหลีกเลี่ยง CORS issues
  if (import.meta.env.MODE === "preview") {
    return false;
  }
  
  return import.meta.env.DEV;                // dev = true, prod = false
};

console.log("🔧 Environment:", {
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  API_URL: getApiUrl(),
  CREDENTIALS: getCredentials(),
});

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  withCredentials: getCredentials(),
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
