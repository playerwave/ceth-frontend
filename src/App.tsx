// import "./App.css";
// import { Routes, Route } from "react-router-dom";
// import { Toaster } from "sonner";

// //import components
// import Navbar from "./components/Navbar";

// //import login
// import Login from "./pages/login";

// //import pages Admin
// import Main from "./pages/Admin/main_admin";
// import ListActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin/list_activity_admin";
// import TestCreate from "./pages/Test/test_create";
// import CreateActivityAdmin from "./pages/Admin/activity-admin/create-activity/create_activity_admin";
// import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity-info/activity_info_admin";
// import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled-list/enrolled_list_admin";

// import UpdateActivityAdmin from "./pages/Admin/activity-admin/update_activity_admin";
// // import Crud_Test from "./pages/Test/crud_test";


// //import pages Student
// import MainStudent from "./pages/Student/main-student/main_student";
// import ActivityInfoStudent from "./pages/Student/activity-student/activity-info/activity_info_student";
// import ListActivityStudent from "./pages/Student/activity-student/list_activity_admin/list_activity_student";
// import TestCardPage from "./pages/Test/test_card";

// function App() {
//   return (
//     <>
//       <Toaster position="bottom-right" richColors />
//       <div>
//         {/* Un Authenticate Routes */}
//         <Routes>
//           <Route path="/login" element={<Login />} />
//         </Routes>
//         {/* Admin Routes */}
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Navbar>
//                 <Main />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/list-activity-admin"
//             element={
//               <Navbar>
//                 <ListActivityAdmin />
//               </Navbar>
//             }
//           ></Route>
//           <Route
//             path="/activity-info-admin/:id"
//             element={
//               <Navbar>
//                 <ActivityInfoAdmin />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/enrolled_list_admin/:id"
//             element={
//               <Navbar>
//                 <EnrolledListAdmin />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/activity-info-admin"
//             element={
//               <Navbar>
//                 <ActivityInfoAdmin />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/create-activity-admin"
//             element={
//               <Navbar>
//                 <CreateActivityAdmin />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/update-activity-admin"
//             element={
//               <Navbar>
//                 <UpdateActivityAdmin />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/enrolled_list_admin/:id"
//             element={
//               <Navbar>
//                 <EnrolledListAdmin />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/test_create"
//             element={
//               <Navbar>
//                 <TestCreate />
//               </Navbar>
//             }
//           />


//           <Route
//             path="/test-card"
//             element={
//               <Navbar>
//                 <TestCardPage />
//               </Navbar>
//             }
//           />
//         </Routes>

//         {/* Student Routes */}
//         <Routes>
//           <Route
//             path="/main-student"
//             element={
//               <Navbar>
//                 <MainStudent />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/activity-info-student"
//             element={
//               <Navbar>
//                 <ActivityInfoStudent />
//               </Navbar>
//             }
//           />
//           <Route
//             path="/list-activity-student"
//             element={
//               <Navbar>
//                 <ListActivityStudent />
//               </Navbar>
//             }
//           ></Route>
//         </Routes>
//       </div>
//     </>
//   );
// }

// export default App;



import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar";
import Login from "./pages/login";

// Admin Pages
import Main from "./pages/Admin/main_admin";
import ListActivityAdmin from "./pages/Admin/activity-admin/list_activity_admin/list_activity_admin";
import TestCreate from "./pages/Test/test_create";
import CreateActivityAdmin from "./pages/Admin/activity-admin/create-activity/create_activity_admin";
import ActivityInfoAdmin from "./pages/Admin/activity-admin/activity-info/activity_info_admin";
import EnrolledListAdmin from "./pages/Admin/activity-admin/enrolled-list/enrolled_list_admin";
import UpdateActivityAdmin from "./pages/Admin/activity-admin/update_activity_admin";

// Student Pages
import MainStudent from "./pages/Student/main-student/main_student";
import ActivityInfoStudent from "./pages/Student/activity-student/activity-info/activity_info_student";
import ListActivityStudent from "./pages/Student/activity-student/list_activity_admin/list_activity_student";


// Test
import TestCardPage from "./pages/Test/test_card";
import CreateRoomAdmin from "./pages/Admin/manageroom-admin/create-room/create.room.admin"; 
import ListRoomAdmin from "./pages/Admin/manageroom-admin/list-room/list.room.admin";
import EditRoomAdmin from "./pages/Admin/manageroom-admin/edit-room/edit.room.admin";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div>
        {/* Un Authenticate Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
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
            path="/activity-info-admin"
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
            path="/create-room"
            element={
              <Navbar>
                <CreateRoomAdmin />
              </Navbar>
            }
          />

          <Route
            path="/list-room"
            element={
              <Navbar>
                <ListRoomAdmin />
              </Navbar>
            }
          />

 <Route
            path="/edit-room"
            element={
              <Navbar>
                <EditRoomAdmin />
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
        </Routes>

        {/* Student Routes */}
        <Routes>
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
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
