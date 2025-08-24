// import axios, { AxiosInstance } from "axios";

// // ✅ Dynamic API URL based on environment
// const getApiUrl = () => {
//   // Development: ใช้ backend โดยตรง
//   if (import.meta.env.DEV) {
//     return "http://vps.theapds.org:8069/api/";
//   }
  
//   // Production/Preview: ใช้ Cloudflare Pages proxy
//   return "https://cooperative-system-buu.pages.dev/api/";
// };

// // ✅ Dynamic credentials based on environment
// const getCredentials = () => {
//   // Development: ไม่ใช้ credentials เพื่อหลีกเลี่ยง CORS issues
//   if (import.meta.env.DEV) {
//     return false;
//   }
  
//   // Production/Preview: ใช้ credentials
//   return true;
// };

// // ✅ Debug: Log current environment
// console.log("🔧 Environment:", {
//   DEV: import.meta.env.DEV,
//   MODE: import.meta.env.MODE,
//   API_URL: getApiUrl(),
//   CREDENTIALS: getCredentials()
// });

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: getApiUrl(),
//   withCredentials: getCredentials(), // ✅ Dynamic credentials
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptors for logging requests (comment ถ้าเป็นตอนที่ขึ้น production)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log("📤 [Request]", {
//       url: config.url,
//       method: config.method,
//       data: config.data,
//       params: config.params,
//       headers: config.headers,
//     });
//     return config;
//   },
//   (error) => {
//     console.error("❌ [Request Error]", error);
//     return Promise.reject(error);
//   },
// );

// // Interceptors for logging responses (comment ถ้าเป็นตอนที่ขึ้น production)
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("📥 [Response]", {
//       url: response.config.url,
//       status: response.status,
//       data: response.data,
//     });
//     return response;
//   },
//   (error) => {
//     console.error("❌ [Response Error]", {
//       url: error.config?.url,
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//       code: error.code,
//     });
    
//     // ✅ ตรวจสอบ authentication error
//     if (error.response?.status === 401) {
//       console.log("🔐 Authentication error detected, redirecting to login...");
//       // ล้าง localStorage และ redirect ไปหน้า login
//       localStorage.clear();
//       window.location.href = "/login";
//     }
    
//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

// axios.ts
import axios, { AxiosInstance } from "axios";

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl) return envUrl;                 // ใช้ค่าจาก .env.[mode] ก่อนเสมอ
  if (import.meta.env.DEV) return "http://vps.theapds.org:8069/api/";
  return "/api/";                            // บน Pages (prod) ใช้ proxy same-origin
};

const getCredentials = () => {
  const c = (import.meta.env.VITE_WITH_CREDENTIALS as string) ?? "";
  if (c) return c === "true";                // allow override (เช่น preview)
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
