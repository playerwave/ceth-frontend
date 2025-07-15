import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5090/api/" // ✅ แก้เป็น Backend
      : "/api",
  withCredentials: true, // ✅ ส่ง cookie ไปพร้อม request
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for logging requests (comment ถ้าเป็นตอนที่ขึ้น production)
axiosInstance.interceptors.request.use(
  (config) => {
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
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default axiosInstance;
