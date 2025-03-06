import "./App.css";
import { Routes, Route } from "react-router-dom";

//import components
import Navbar from "./components/Navbar";

//import pages
import Main from "./pages/Admin/main_admin";
import ListActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin";
// import Crud_Test from "./pages/Test/crud_test";
import ManageActivityAdmin from "./pages/Admin/activity-admin/manage_activity_admin";
import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity_info_admin";
import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled_list_admin";
// import Crud_Test from "./pages/Test/crud_test";

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
            path="/list-activity-admin"
            element={
              <Navbar>
                <ListActivityAdmin />
              </Navbar>
            }
          ></Route>
          <Route
            path="/activity-info-admin"
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
