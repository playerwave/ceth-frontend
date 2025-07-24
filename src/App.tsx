// // export default App;

// import "./App.css";
// import { Routes, Route } from "react-router-dom";
// import { Toaster } from "sonner";

// //import components
// import Navbar from "./components/Navbar";

// //import auth
// import Login from "./pages/login";
// import ProtectedRoute from "./components/Wrapper/ProtectedRoute";

// // Admin Pages
// import Main from "./pages/Teacher/main_teacher";
// import ListActivityAdmin from "./pages/Teacher/manage-activity-teacher/list_activity_admin/list_activity_admin";
// // import TestCreate from "./pages/Test/test_create";
// import CreateActivityAdmin from "./pages/Teacher/manage-activity-teacher/create-activity/create_activity_admin";
// import ActivityInfoAdmin from "./pages/Teacher/manage-activity-teacher/activity-info/activity_info_admin";
// // import EnrolledListAdmin from "./pages/Teacher/manage-activity-teacher/enrolled-list/enrolled_list_admin";
// import UpdateActivityAdmin from "./pages/Teacher/manage-activity-teacher/create-activity/update_activity_admin";
// import ListFoodAdmin from "./pages/Teacher/mangefood-teacher/list-food/list.food.teacher";
// import EditFoodAdmin from "./pages/Teacher/mangefood-teacher/edit-food/edit.food";
// import ListRoomAdmin from "./pages/Teacher/manageroom-teacher/list-room/list.room.teacher";
// import EditRoomAdmin from "./pages/Teacher/manageroom-teacher/edit-room/edit.room.teacher";

// //visiter
// // import Visiter from "./pages/Visiter/visiter";
// // import Crud_Test from "./pages/Test/crud_test";

// // Student pages
// import MainStudent from "./pages/Student/main-student/main_student";
// import ActivityInfoStudent from "./pages/Student/activity-student/activity-info/activity_info_student";
// import ListActivityStudent from "./pages/Student/activity-student/list_activity_studen/list_activity_student";
// import TestCardPage from "./pages/Test/test_card";

// //Visitor pages
// import ActivityListVisitor from "./pages/visitor/activity-list/visiter";
// import ActivityInfoVisitor from "./pages/visitor/activity-info/activity_info_visitor";


// function App() {
//   return (
//     <>
//       <Toaster position="bottom-right" richColors />
//       <Routes>
//         {/* ❌ Unauthenticated */}
//         <Route path="/login" element={<Login />} />

//         {/* ✅ Admin */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <Main />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/list-activity-admin"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <ListActivityAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/activity-info-admin/:id"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <ActivityInfoAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/create-activity-admin"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <CreateActivityAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/update-activity-admin"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <UpdateActivityAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/list-food-teacher"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <ListFoodAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/update-food-teacher"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <EditFoodAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/list-room-teacher"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <ListRoomAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/update-room-teacher"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <EditRoomAdmin />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/test-card"
//           element={
            
//             <Navbar>
//               <TestCardPage />
//             </Navbar>
//           }
//         />

//         {/* ✅ Student */}
//         <Route
//           path="/main-student"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <MainStudent />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/activity-info-student"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <ActivityInfoStudent />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/list-activity-student"
//           element={
//             <ProtectedRoute>
//             <Navbar>
//               <ListActivityStudent />
//             </Navbar>
//             </ProtectedRoute>
//           }
//         />

//         {/* ✅ Visitor */}
//         <Route
//           path="/activity-info-visitor"
//           element={
            
//             <Navbar>
//               <ActivityInfoVisitor />
//             </Navbar>
//           }
//         />
//         <Route
//           path="/activity-list-visitor"
//           element={
//             <Navbar>
//               <ActivityListVisitor />
//             </Navbar>
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;


import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// component
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/Wrapper/ProtectedRoute";

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

function App() {
  // const role = useAuthStore.getState().user?.role?.role_name || "Visitor";
  const { user } = useAuthStore();
  const role: string =
    typeof user?.role === "string"
      ? user.role
      : user?.role?.role_name || "Visitor";
  
  console.log('user in App.tsx:', user);
  console.log('role: ', role);
  


//   const renderRoutesByRole = (
//   routes: {
//     path: string;
//     element: JSX.Element;
//     roles: string[];
//   }[],
//   role: string
// ) => {
//   return routes
//     .filter(route => route.roles.includes(role))
//     .map((route, index) => (
//       <Route
//         key={`route-${index}`}
//         path={route.path}
//         element={
//           <ProtectedRoute>
//             <Navbar>{route.element}</Navbar>
//           </ProtectedRoute>
//         }
//       />
//     ));
// };


const renderRoutesByRole = (
  routes: {
    path: string;
    element: JSX.Element;
    roles?: string[]; // 👈 เปลี่ยนเป็น optional
  }[],
  role: string
) => {
  return routes
    .filter(route => !route.roles || route.roles.includes(role)) // 👈 รองรับทั้งมี/ไม่มี roles
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

  {/* 📌 Dynamic routes */}
  {renderRoutesByRole(activityRoutes, role)}
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
