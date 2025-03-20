import axios, { AxiosInstance } from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000", // ✅ ตรวจสอบว่าใช้ `http://localhost:3000`
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;

const axiosInstance = axios.create({
  baseURL: "http://localhost:5090/", // ✅ ตรวจสอบให้แน่ใจว่าไม่มี /student เกินมา
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
