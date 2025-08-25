import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/Visitor/auth.store";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, authLoading, user, fetchMe, authError } = useAuthStore();
  const location = useLocation();
  const path = location.pathname;

  const publicPaths = ["/activity-list-visitor", "/activity-info-visitor"];

  useEffect(() => {
    // ✅ เรียก fetchMe เฉพาะเมื่อยังไม่มี user และไม่ใช่ public path
    if (!user && !publicPaths.includes(path)) {
      fetchMe();
      console.log("🔁 Fetching user from /me");
    }
  }, [fetchMe, user, path]);

  // ⏳ กำลังโหลด
  if (authLoading) return null;

  // ✅ เปิดให้หน้า public เข้าได้เสมอ แม้ไม่มี user
  if (publicPaths.includes(path)) {
    return children;
  }

  // ⛔ ถ้าไม่ auth และไม่ใช่ public page → redirect ตาม role
  if (!isAuthenticated || !user) {
    // ✅ แสดง error message ถ้ามี
    if (authError) {
      console.log("❌ Auth error:", authError);
    }
    
    // 🔄 Redirect ไป dashboard ที่จะ redirect ตาม role อีกที
    return <Navigate to="/activity-list-visitor" replace />;
  }

  // 👨‍🎓 Student route
  if (path.includes("student") && user.role_id !== 3) {
    return <Navigate to="/login" replace />;
  }

  // 👩‍🏫 Teacher/Admin route
  if (
    (path.includes("admin") || path === "/") &&
    user.role_id !== 2 &&
    user.role_id !== 1
  ) {
    return <Navigate to="/login" replace />;
  }

  // ✅ ให้เข้าได้
  return children;
}
