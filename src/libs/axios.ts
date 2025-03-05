import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5090", // ✅ baseURL ควรเป็นแค่ URL หลัก
  withCredentials: true, // ✅ ส่ง cookie ไปพร้อม request
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;
