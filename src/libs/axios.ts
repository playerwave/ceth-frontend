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
      ? "http://localhost:5090/student/" // ✅ แก้เป็น Backend
      : "/student",
  withCredentials: true, // ✅ ส่ง cookie ไปพร้อม request
});

export default axiosInstance;
