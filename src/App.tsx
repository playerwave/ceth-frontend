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
import CreateActivityAdmin from "./pages/Admin/activity-admin/create_activity_admin";
import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity_info_admin";
import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled_list_admin";
import UpdateActivityAdmin from "./pages/Admin/activity-admin/update_activity_admin";
// import Crud_Test from "./pages/Test/crud_test";

//import toast
import { Toaster } from "sonner";

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
            path="/manage-activity-admin"
            element={
              <Navbar>
                <ManageActivityAdmin />
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
            path="/activity-info-admin"
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
            path="/update-activity-admin"
            element={
              <Navbar>
                <UpdateActivityAdmin />
              </Navbar>
            }
          />
          <Route
            path="/enrolled_list_admin/:id"
            element={
              <Navbar>
                <EnrolledListAdmin />
              </Navbar>
            }
          />
        </Routes>

        {/* Student Routes */}
        <Routes>
          <Route></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
