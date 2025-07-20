// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../../stores/Visitor/auth.store";

// export default function ProtectedRoute({ children }: { children: JSX.Element }) {
//   const { isAuthenticated, authLoading } = useAuthStore();

//   if (authLoading) {
//     return <div>Loading...</div>; // หรือจะทำ spinner ก็ได้
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

//version 2
// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../../stores/Visitor/auth.store";

// export default function ProtectedRoute({ children }: { children: JSX.Element }) {
//   const { isAuthenticated, authLoading, fetchMe } = useAuthStore();

//   useEffect(() => {
//     fetchMe(); // ✅ ดึงข้อมูลผู้ใช้เมื่อเข้า route
//   }, []);

//   if (authLoading) return null; // หรือแสดง loader

//   if (!isAuthenticated) return <Navigate to="/login" replace />;

//   return children;
// }

import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/Visitor/auth.store";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, authLoading, user, fetchMe } = useAuthStore();
  const location = useLocation();

  // useEffect(() => {
  //   fetchMe(); // ดึงข้อมูลผู้ใช้เมื่อเข้า route
  // }, []);

  useEffect(() => {
  fetchMe(); // ✅ ดึงผู้ใช้ตอน mount
  // เพิ่ม log ช่วย debug ได้เลย
  console.log("🔁 Fetching user from /me");
}, []);


  if (authLoading) return null; // หรือแสดง loader

  if (!isAuthenticated || !user) {
    
    return <Navigate to="/activity-list-visitor" replace />;
  }

  // ✅ แยกตาม path ที่เข้าว่าใช้ role อะไร
  const path = location.pathname;

  // 👨‍🎓 นักเรียนเข้าได้เฉพาะ path ที่มี "student"
  if (path.includes("student") && user.role !== "Student") {
    return <Navigate to="/login" replace />;
  }

  // 👩‍🏫 อาจารย์/แอดมิน เข้าได้เฉพาะ path ที่มี "admin" หรือ "/" แรก
  if (
    (path.includes("admin") || path === "/") &&
    user.role !== "Teacher" &&
    user.role !== "Admin" 
  ) {
    if (!user.role) {
  console.warn("❌ Missing user.role. Redirecting to login.");
  return <Navigate to="/login" replace />;
}
  }

  // ✅ อนุญาตให้เข้า
  return children;
}
