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

export default axiosInstance;
