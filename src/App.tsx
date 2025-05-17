import "./App.css";
import { Routes, Route } from "react-router-dom";

//import components
import Navbar from "./components/Navbar";

//import pages
import Main from "./pages/Admin/main_admin";
import ListActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin";
// import Crud_Test from "./pages/Test/crud_test";
import ManageActivityStudent from "./pages/Student/activity-student/activity_info_student";
import MainStudent from "./pages/Student/main_studen";

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
            path="/List-activity-admin"
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
                <ManageActivityStudent />
              </Navbar>
            }
          ></Route>
          {/* <Route
            path="/crud-test"
            element={
              <Navbar>
                <Crud_Test />
              </Navbar>
            }
          ></Route> */}
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
