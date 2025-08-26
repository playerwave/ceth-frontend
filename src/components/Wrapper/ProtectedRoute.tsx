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

  // 🔍 Debug: ตรวจสอบ role และ path
  console.log("🔍 [ProtectedRoute] Checking access:", {
    path,
    userRole: user.role,
    userRoleId: user.role_id,
    isAuthenticated,
  });

  // 👨‍🎓 Student route
  if (path.includes("student") && user.role !== "Student") {
    console.log("❌ [ProtectedRoute] Student route access denied");
    return <Navigate to="/login" replace />;
  }

  // 👩‍🏫 Teacher/Admin route
  if (
    (path.includes("admin") || path === "/") &&
    user.role !== "Teacher" &&
    user.role !== "Admin"
  ) {
    console.log("❌ [ProtectedRoute] Teacher/Admin route access denied");
    return <Navigate to="/login" replace />;
  }

  // ✅ ให้เข้าได้
  return children;
}
