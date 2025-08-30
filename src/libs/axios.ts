// axios.ts
import axios, { AxiosInstance } from "axios";

const getApiUrl = () => {
  
  // Preview mode: ใช้ VPS backend โดยตรง
  // if (import.meta.env.MODE === "preview") {
  //   return "http://vps.theapds.org:8069/api/";
  // }
  
  // // Development mode: ใช้ localhost
  // if (import.meta.env.DEV) {
  //   return "http://localhost:5090/api/";
  // }
  
  // // Production mode: ใช้ custom domain
  // return "https://ceth-api.theapds.org/api/";

  const developmentMode = import.meta.env.DEV_API_URL;
  const productionMode = import.meta.env.PROD_API_URL;

    if (import.meta.env.MODE === "preview") {
    return String(productionMode);
  }
  
  // Development mode: ใช้ localhost
  if (import.meta.env.DEV) {
    return String(developmentMode);
  }
  
  // Production mode: ใช้ custom domain
  return String(productionMode);
};

const getCredentials = () => {
  const c = (import.meta.env.VITE_WITH_CREDENTIALS as string) ?? "";
  if (c) return c === "true";                // allow override
  
  // ✅ เปิด credentials ในทุก environment เพื่อให้ cookies ทำงานได้
  return true;
  
  // Preview mode: ปิด credentials เพื่อหลีกเลี่ยง CORS issues
  // if (import.meta.env.MODE === "preview") {
  //   return false;
  // }
  
  // Production mode: ปิด credentials เพื่อหลีกเลี่ยง CORS issues
  // if (!import.meta.env.DEV) {
  //   return false;
  // }
  
  // return import.meta.env.DEV;                // dev = true, prod = false
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

// ✅ เพิ่ม request interceptor เพื่อจัดการ token อัตโนมัติ
axiosInstance.interceptors.request.use(
  (config) => {
    // ดึง token จาก localStorage
    const token = localStorage.getItem('auth-token');
    
    if (token) {
      // Set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 [Axios] Authorization header set for:", config.url);
    } else {
      console.log("⚠️ [Axios] No token found for request:", config.url);
    }
    
    return config;
  },
  (error) => {
    console.error("❌ [Axios] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ เพิ่ม response interceptor เพื่อจัดการ error
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ [Axios] Response successful for:", response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ [Axios] Response error for:", error.config?.url, error.response?.status);
    
    // ✅ ตรวจสอบว่าเป็น QR code request หรือไม่
    const isQRCodeRequest = error.config?.url?.includes('/teacher/qr-code');
    
    // ถ้า token หมดอายุหรือไม่ถูกต้อง และไม่ใช่ QR code request
    if (error.response?.status === 401 && !isQRCodeRequest) {
      console.log("🚫 [Axios] Unauthorized - redirecting to login");
      // ลบ token และ redirect ไป login
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    } else if (error.response?.status === 401 && isQRCodeRequest) {
      console.log("🚫 [Axios] QR Code request unauthorized - letting component handle it");
      // ไม่ redirect สำหรับ QR code requests - ให้ component จัดการเอง
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
