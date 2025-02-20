import "./App.css";
import { Routes, Route } from "react-router-dom";

//import components
import Navbar from "./components/Navbar";

//import pages
import Main from "./pages/Admin/main_admin";
import ManageActivityAdmin from "./pages/Admin/activity-admin/manage_activity_admin";
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
            path="/manage-activity-admin"
            element={
              <Navbar>
                <ManageActivityAdmin />
              </Navbar>
            }
          ></Route>
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
