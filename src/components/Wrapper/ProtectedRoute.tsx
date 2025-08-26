import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/Visitor/auth.store";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, authLoading, user, fetchMe, authError } = useAuthStore();
  const location = useLocation();
  const path = location.pathname;

  console.log("🔍 [ProtectedRoute] Component rendered:", {
    path,
    isAuthenticated,
    authLoading,
    user: user ? { role: user.role, role_id: user.role_id } : null,
    authError
  });

  const publicPaths = ["/activity-list-visitor", "/activity-info-visitor"];

  useEffect(() => {
    // ✅ ตรวจสอบ token ใน localStorage ก่อน
    const token = localStorage.getItem('auth-token');
    
    // ✅ เรียก fetchMe เฉพาะเมื่อยังไม่มี user และไม่ใช่ public path และมี token
    if (!user && !publicPaths.includes(path) && token) {
      console.log("🔁 [ProtectedRoute] Fetching user from /me");
      fetchMe();
    } else if (!user && !publicPaths.includes(path) && !token) {
      console.log("❌ [ProtectedRoute] No token found - redirecting to login");
      // ไม่มี token และไม่ใช่ public path → redirect ไป login
      window.location.href = '/login';
    }
  }, [fetchMe, user, path, publicPaths]);

  // ⏳ กำลังโหลด
  if (authLoading) {
    console.log("⏳ [ProtectedRoute] Loading...");
    return null;
  }

  // ✅ เปิดให้หน้า public เข้าได้เสมอ แม้ไม่มี user
  if (publicPaths.includes(path)) {
    console.log("✅ [ProtectedRoute] Public path - allowing access");
    return children;
  }

  // ⛔ ถ้าไม่ auth และไม่ใช่ public page → redirect ตาม role
  if (!isAuthenticated || !user) {
    console.log("❌ [ProtectedRoute] Not authenticated, redirecting to visitor page");
    
    // ✅ แสดง error message ถ้ามี
    if (authError) {
      console.log("❌ Auth error:", authError);
    }
    
    // 🔄 Redirect ไป dashboard ที่จะ redirect ตาม role อีกที
    return <Navigate to="/activity-list-visitor" replace />;
  }

  // 🔍 Debug: ตรวจสอบ role และ path
  console.log("✅ [ProtectedRoute] User authenticated, allowing access");
  console.log("👤 [ProtectedRoute] User role:", user.role);
  console.log("🎯 [ProtectedRoute] Current path:", path);

  return children;
}
