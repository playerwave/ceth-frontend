import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://vps.theapds.org:8069/api/", // ✅ Production VPS
  withCredentials: true, // ✅ ส่ง cookie ไปพร้อม request
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for logging requests และเพิ่ม token อัตโนมัติ
axiosInstance.interceptors.request.use(
  (config) => {
    // เพิ่ม token ใน Authorization header อัตโนมัติ
    const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📤 [Request]", {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("❌ [Request Error]", error);
    return Promise.reject(error);
  },
);

// Interceptors for logging responses (comment ถ้าเป็นตอนที่ขึ้น production)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("📥 [Response]", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ [Response Error]", {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    });
    
    // ✅ ตรวจสอบ authentication error
    if (error.response?.status === 401) {
      console.log("🔐 Authentication error detected, redirecting to login...");
      // ล้าง localStorage และ redirect ไปหน้า login
      localStorage.clear();
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  },
);

export default axiosInstance;
