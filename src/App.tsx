import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import Navbar from "./components/Navbar";

// Login
import Login from "./pages/login";

// Pages Admin
import Main from "./pages/Admin/main_admin";
import ManageActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin/list_activity_admin";
import TestCreate from "./pages/Test/test_create";
import CreateActivityAdmin from "./pages/Admin/activity-admin/create-activity/create_activity_admin";
import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity-info/activity_info_admin";
import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled-list/enrolled_list_admin";
import UpdateActivityAdmin from "./pages/Admin/activity-admin/update_activity_admin";
import TestCardPage from "./pages/Test/test_card";

// Pages Student
import MainStudent from "./pages/Student/main-student/main_student";
import ActivityInfoStudent from "./pages/Student/activity-student/activity-info/activity_info_student";
import ListActivityStudent from "./pages/Student/activity-student/list_activity_admin/list_activity_student";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div>
        <Routes>
          {/* ✅ Unauthenticated */}
          <Route path="/login" element={<Login />} />

          {/* ✅ Admin */}
          <Route
            path="/"
            element={
              <Navbar>
                <Main />
              </Navbar>
            }
          />
          <Route
            path="/manage-activity-admin"
            element={
              <Navbar>
                <ManageActivityAdmin />
              </Navbar>
            }
          />
          <Route
            path="/activity-info-admin"
            element={
              <Navbar>
                <ActivityInfoAdmin />
              </Navbar>
            }
          />
          <Route
            path="/activity-info-admin/:id"
            element={
              <Navbar>
                <ActivityInfoAdmin />
              </Navbar>
            }
          />
          <Route
            path="/create-activity-admin"
            element={
              <Navbar>
                <CreateActivityAdmin />
              </Navbar>
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
          <Route
            path="/test_create"
            element={
              <Navbar>
                <TestCreate />
              </Navbar>
            }
          />
          <Route
            path="/test-card"
            element={
              <Navbar>
                <TestCardPage />
              </Navbar>
            }
          />

          {/* ✅ Student */}
          <Route
            path="/main-student"
            element={
              <Navbar>
                <MainStudent />
              </Navbar>
            }
          />
          <Route
            path="/activity-info-student"
            element={
              <Navbar>
                <ActivityInfoStudent />
              </Navbar>
            }
          />
          <Route
            path="/list-activity-student"
            element={
              <Navbar>
                <ListActivityStudent />
              </Navbar>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
