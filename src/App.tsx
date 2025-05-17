import "./App.css";
import { Routes, Route } from "react-router-dom";

//import components
import Navbar from "./components/Navbar";

//import pages
import Main from "./pages/Admin/main_admin";
import ListActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin";
import TestCreate from "./pages/Test/test_create";
import CreateActivityAdmin from "./pages/Admin/activity-admin/create_activity_admin";
import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity_info_admin";
import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled_list_admin";
import UpdateActivityAdmin from "./pages/Admin/activity-admin/update_activity_admin";
// import Crud_Test from "./pages/Test/crud_test";

//import pages Student
import MainStudent from "./pages/Student/main_student";
import ActivityInfoStudent from "./pages/Student/activity-student/activity_info_student";
import ListActivityStudent from "./pages/Student/activity-student/list_activity_student";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (!isAuthenticated && isCheckingAuth) {
    return (
      <div className="loading-overlay">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export const RedirectAuthenticatedUser = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerify) {
    return <Navigate to="/main-admin" replace />; // ปรับ path ถ้าจำเป็น
  }

  return children;
};

function App() {
  return (
    <>
      <div>
        {/* Admin Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <Navbar>
                <Main />
              </Navbar>
            }
          />
            <Route
            path="/main-stu"
            element={
              <Navbar>
             <MainStudent />
              </Navbar>
            }
          />
          <Route
            path="/list-activity-admin"
            element={
              <ProtectedRoute>
                <Navbar>
                  <ListActivityAdmin />
                </Navbar>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/activity-info-admin/:id"
            element={
              <ProtectedRoute>
                <Navbar>
                  <ActivityInfoAdmin />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrolled_list_admin/:id"
            element={
              <ProtectedRoute>
                <Navbar>
                  <EnrolledListAdmin />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-info-admin"
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
                  <CreateActivityAdmin />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-activity-admin"
            element={
              <ProtectedRoute>
                <Navbar>
                  <UpdateActivityAdmin />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrolled_list_admin/:id"
            element={
              <ProtectedRoute>
                <Navbar>
                  <EnrolledListAdmin />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/test_create"
            element={
              <ProtectedRoute>
                <Navbar>
                  <TestCreate />
                </Navbar>
              </ProtectedRoute>
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
