
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// component
import Navbar from "./components/Navbar";
import QRCodeLayout from "./components/QRCodeLayout";
import ProtectedRoute from "./components/Wrapper/ProtectedRoute";
import { SecureRoute } from "./routes/secure/SecureRoute";

// auth
import Login from "./pages/visitor/login/login";

// main pages
import Main from "./pages/Teacher/dashboard-teacher/main_teacher";
import MainStudent from "./pages/Student/main-student/main_student";
import TestCardPage from "./pages/Test/test_card";
import TestQrAuth from "./pages/Test/test_qr_auth";

// activity routes config
import { activityRoutes } from "./routes/activity.route"
import {assessmentRoutes} from "./routes/assessment.route"
import {certificateRoutes} from "./routes/certificate.route"
import {activityHistoryRoutes} from "./routes/activity-history.route"
import {userRoutes} from "./routes/user.route"
import {foodRoutes} from "./routes/food.route"
import {roomRoutes} from "./routes/room.route"
import {emailRoutes} from "./routes/email.route"

// Visitor pages
import VisitorActivityList from "./pages/visitor/activity-list/visiter";

// auth store
import { useAuthStore } from "./stores/Visitor/auth.store";

// utils
import { ProtectionLevel } from "./routes/secure/urlEnCryption";

function App() {
  const { user } = useAuthStore();
  
  // ✅ แก้ไข: ใช้ role จาก user object โดยตรง
  const role: string = user?.role || "Visitor";
  
  console.log('user in App.tsx:', user);
  console.log('role: ', role);

  // 🔐 ฟังก์ชันสำหรับสร้างเส้นทางที่เข้ารหัส
  const renderSecureRoutesByRole = (
    routes: {
      path: string;
      element: JSX.Element;
      roles?: string[];
      protectionLevel?: ProtectionLevel;
    }[],
    role: string
  ) => {
    console.log("🔍 App: Processing secure routes for role:", role);
    console.log("🔍 App: Available routes:", routes.map(r => ({ path: r.path, roles: r.roles, protectionLevel: r.protectionLevel })));
    
    const filteredRoutes = routes.filter(route => !route.roles || route.roles.includes(role));
    console.log("🔍 App: Filtered routes:", filteredRoutes.map(r => r.path));
    
    return filteredRoutes.map((route, index) => {
      const protectionLevel = route.protectionLevel || ProtectionLevel.NONE;
      
      console.log("🔍 App: Creating route:", { path: route.path, protectionLevel, roles: route.roles });
      
      // ใช้ QRCodeLayout สำหรับหน้า QR code
      const isQRCodePage = route.path.includes("qr-activity-checkinout-student");
      
      return (
        <Route
          key={`secure-route-${index}`}
          path={route.path}
          element={
            <ProtectedRoute>
              {isQRCodePage ? (
                <QRCodeLayout>
                  <SecureRoute protectionLevel={protectionLevel}>
                    {route.element}
                  </SecureRoute>
                </QRCodeLayout>
              ) : (
                <Navbar>
                  <SecureRoute protectionLevel={protectionLevel}>
                    {route.element}
                  </SecureRoute>
                </Navbar>
              )}
            </ProtectedRoute>
          }
        />
      );
    });
  };

  // 🔐 ฟังก์ชันสำหรับสร้างเส้นทางปกติ (ไม่เข้ารหัส)
  const renderRoutesByRole = (
    routes: any[],
    role: string
  ) => {
    return routes
      .filter(route => route && (!route.roles || route.roles.includes(role)))
      .map((route, index) => (
        <Route
          key={`route-${index}`}
          path={route.path}
          element={
            <ProtectedRoute>
              <Navbar>{route.element}</Navbar>
            </ProtectedRoute>
          }
        />
      ));
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* หน้าหลัก */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar>
                <Main />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/main-student"
          element={
            <ProtectedRoute>
              <Navbar>
                <MainStudent />
              </Navbar>
            </ProtectedRoute>
          }
        />

        {/* 🔄 Default route - redirect ตาม role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate 
                to={
                  role === "Student" ? "/main-student" : 
                  role === "Teacher" || role === "Admin" ? "/" : 
                  "/visitor"
                } 
                replace 
              />
            </ProtectedRoute>
          }
        />

        {/* 📌 เส้นทางที่เข้ารหัส */}
        {renderSecureRoutesByRole(activityRoutes, role)}
        
        {/* 📌 เส้นทางปกติ (ยังไม่เข้ารหัส) */}
        {renderRoutesByRole(assessmentRoutes, role)}
        {renderRoutesByRole(activityHistoryRoutes, role)}
        {renderRoutesByRole(certificateRoutes, role)}
        {renderRoutesByRole(userRoutes, role)}
        {renderRoutesByRole(foodRoutes, role)}
        {renderRoutesByRole(roomRoutes, role)}
        {renderRoutesByRole(emailRoutes, role)}

        {/* 👥 Visitor routes */}
        <Route
          path="/visitor"
          element={
            <Navbar>
              <VisitorActivityList />
            </Navbar>
          }
        />



        {/* 🧪 test */}
        <Route
          path="/test-card"
          element={
            <Navbar>
              <TestCardPage />
            </Navbar>
          }
        />
        <Route
          path="/test-qr-auth"
          element={
            <Navbar>
              <TestQrAuth />
            </Navbar>
          }
        />

      </Routes>
    </>
  );
}

export default App;
