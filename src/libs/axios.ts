import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api/", // ✅ ใช้ relative URL เพื่อให้ Netlify proxy ทำงาน
  withCredentials: true, // ✅ ส่ง cookie ไปพร้อม request
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ เพิ่ม token interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // เพิ่ม token จาก localStorage ถ้ามี
    const token = localStorage.getItem('auth-token');
    if (token) {
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

// ✅ ลบ interceptor เดิมที่ซ้ำ

// Interceptors for logging responses (comment ถ้าเป็นตอนที่ขึ้น production)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("📥 [Response]", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    
    // ✅ ตรวจสอบ response data format
    if (response.data && typeof response.data === 'object') {
      // ถ้า response มี error field
      if (response.data.error) {
        console.error("❌ API Error in response:", response.data.error);
        return Promise.reject(new Error(response.data.error));
      }
      
      // ถ้า response มี message field (success/error)
      if (response.data.message && response.data.message.includes('error')) {
        console.error("❌ API Error message:", response.data.message);
        return Promise.reject(new Error(response.data.message));
      }
    }
    
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
