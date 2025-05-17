import axios, { AxiosInstance } from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000", // ✅ ตรวจสอบว่าใช้ `http://localhost:3000`
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;

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
