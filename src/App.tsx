import "./App.css";
import { Routes, Route } from "react-router-dom";

//import components
import Navbar from "./components/Navbar";

//import pages
import Main from "./pages/Admin/main_admin";
import ManageActivityAdmin from "./pages/Admin/activity-admin/manage_activity_admin";
import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity_info_admin"
import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled_list_admin"
import Crud_Test from "./pages/Test/crud_test";

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
          path="/activity-info-admin/:id"
          element={
            <Navbar>
              <ActivityInfoAdmin />
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
            path="/crud-test"
            element={
              <Navbar>
                <Crud_Test />
              </Navbar>
            }
          ></Route>
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
