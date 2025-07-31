
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// component
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/Wrapper/ProtectedRoute";
import { SecureRoute } from "./routes/secure/SecureRoute";

// auth
import Login from "./pages/login";

// main pages
import Main from "./pages/Teacher/dashboard-teacher/main_teacher";
import MainStudent from "./pages/Student/main-student/main_student";
import TestCardPage from "./pages/Test/test_card";

// activity routes config
import { activityRoutes } from "./routes/activity.route"
import {assessmentRoutes} from "./routes/assessment.route"
import {certificateRoutes} from "./routes/certificate.route"
import {activityHistoryRoutes} from "./routes/activity-history.route"
import {userRoutes} from "./routes/user.route"
import {foodRoutes} from "./routes/food.route"
import {roomRoutes} from "./routes/room.route"

// auth store
import { useAuthStore } from "./stores/Visitor/auth.store";

// utils
import { ProtectionLevel } from "./routes/secure/urlEnCryption";

function App() {
  const { user } = useAuthStore();
  const role: string =
    typeof user?.role === "string"
      ? user.role
      : user?.role?.role_name || "Visitor";
  
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
    return routes
      .filter(route => !route.roles || route.roles.includes(role))
      .map((route, index) => {
        const protectionLevel = route.protectionLevel || ProtectionLevel.NONE;
        
        return (
          <Route
            key={`secure-route-${index}`}
            path={route.path}
            element={
              <ProtectedRoute>
                <Navbar>
                  <SecureRoute protectionLevel={protectionLevel}>
                    {route.element}
                  </SecureRoute>
                </Navbar>
              </ProtectedRoute>
            }
          />
        );
      });
  };

  // 🔐 ฟังก์ชันสำหรับสร้างเส้นทางปกติ (ไม่เข้ารหัส)
  const renderRoutesByRole = (
    routes: {
      path: string;
      element: JSX.Element;
      roles?: string[];
    }[],
    role: string
  ) => {
    return routes
      .filter(route => !route.roles || route.roles.includes(role))
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate 
                to={role === "Student" ? "/main-student" : "/"} 
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

        {/* 🧪 test */}
        <Route
          path="/test-card"
          element={
            <Navbar>
              <TestCardPage />
            </Navbar>
          }
        />
      </Routes>
    </>
  );
}

export default App;
