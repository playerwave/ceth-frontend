import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5090/api"
      : "/api",
  withCredentials: true, // ✅ ส่ง cookie ไปพร้อม request
});

export default axiosInstance;
