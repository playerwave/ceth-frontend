import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { useEffect } from "react";

//import components
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

//import authStore
import { useAuthStore } from "./stores/auth.store";

//import login
import Login from "./pages/login";

//import pages Admin
import Main from "./pages/Admin/main_admin";
import ListActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin";
// import Crud_Test from "./pages/Test/crud_test";
import ManageActivityStudent from "./pages/Student/activity-student/activity_studen";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth(); // ✅ โหลดข้อมูลผู้ใช้ตอนเปิดเว็บหรือ refresh
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading /> {/* หรือ loading spinner ที่คุณมี */}
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div>
        {/* Un Authenticate Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        {/* Admin Routes */}
        <Routes>
          <Route
            path="/main-admin"
            element={
              <ProtectedRoute>
                <Navbar>
                  <Main />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/List-activity-admin"
            element={
              <Navbar>
                <ListActivityAdmin />
              </Navbar>
            }
          ></Route>
          <Route
            path="/List-activity-student"
            element={
              <Navbar>
                <ManageActivityStudent />
              </Navbar>
            }
          ></Route>
          {/* <Route
            path="/crud-test"
            element={
              <ProtectedRoute>
                <Navbar>
                  <TestCreate />
                </Navbar>
              </ProtectedRoute>
            }
          ></Route> */}
        </Routes>

        {/* Student Routes */}
        <Routes>
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
          <Route
            path="/activity-info-student"
            element={
              <ProtectedRoute>
                <Navbar>
                  <ActivityInfoStudent />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-activity-student"
            element={
              <ProtectedRoute>
                <Navbar>
                  <ListActivityStudent />
                </Navbar>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
