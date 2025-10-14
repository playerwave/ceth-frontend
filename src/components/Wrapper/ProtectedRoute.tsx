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

  const publicPaths = ["/visitor", "/activity-info-visitor"];
  
  // ✅ ตรวจสอบว่าเป็น public path หรือไม่ (รวม path ที่ขึ้นต้นด้วย)
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));
  
  console.log("🔍 [ProtectedRoute] Path check:", {
    path,
    isPublicPath,
    publicPaths
  });

  useEffect(() => {
    // ✅ ตรวจสอบ token ใน localStorage ก่อน
    const token = localStorage.getItem('auth-token');
    
    // ✅ เรียก fetchMe เฉพาะเมื่อยังไม่มี user และไม่ใช่ public path และมี token
    if (!user && !isPublicPath && token) {
      console.log("🔁 [ProtectedRoute] Fetching user from /me");
      fetchMe();
    }
  }, [fetchMe, user, path, isPublicPath]);

  // ⏳ กำลังโหลด
  if (authLoading) {
    console.log("⏳ [ProtectedRoute] Loading...");
    return null;
  }

  // ✅ เปิดให้หน้า public เข้าได้เสมอ แม้ไม่มี user
  if (isPublicPath) {
    console.log("✅ [ProtectedRoute] Public path - allowing access");
    return children;
  }
  
  // ✅ ตรวจสอบเฉพาะ path ที่ขึ้นต้นด้วย /activity-info-visitor
  if (path.startsWith("/activity-info-visitor")) {
    console.log("✅ [ProtectedRoute] Activity info visitor path - allowing access");
    return children;
  }

  // ⛔ ถ้าไม่ auth และไม่ใช่ public page → redirect ไป visitor page
  if (!isAuthenticated || !user) {
    console.log("❌ [ProtectedRoute] Not authenticated, redirecting to visitor page");
    
    // ✅ แสดง error message ถ้ามี
    if (authError) {
      console.log("❌ Auth error:", authError);
    }
    
    // 🔄 Redirect ไป visitor page (ไม่ไป login)
    return <Navigate to="/visitor" replace />;
  }

  // 🔍 Debug: ตรวจสอบ role และ path
  console.log("✅ [ProtectedRoute] User authenticated, allowing access");
  console.log("👤 [ProtectedRoute] User role:", user.role);
  console.log("🎯 [ProtectedRoute] Current path:", path);

  return children;
}
