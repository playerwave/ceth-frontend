import UserDepartmentTeacher from "../pages/Teacher/manage-student-teacher/student-department/student.department";
import ListUserTeacher from "../pages/Teacher/manage-student-teacher/list-student-teacher/list.student.teacher";
import CreateUserTeacher from "../pages/Teacher/manage-student-teacher/create-student-teacher/create.student.teacher";
import UserInfoTeacher from "../pages/Teacher/manage-student-teacher/student-info-teacher/student.info.teacher";
import ManageStudentTeacher from "../pages/Teacher/manage-student-teacher/manage.student.teacher";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/roles.type";
type RoleName = Roles["roles_name"];

export const userRoutes = [
  {
    path: "/user-department-teacher",
    element: <UserDepartmentTeacher />,
    label: "จัดการนิสิต",
    icon: "Users",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/list-user-teacher",
    element: <ManageStudentTeacher />,
    label: "",
    icon: "Users",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/list-user-teacher-direct",
    element: <ListUserTeacher />,
    label: "",
    icon: "Users",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
   {
    path: "/create-user-teacher",
    element: <CreateUserTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
     {
    path: "/update-user-teacher",
    element: <UserInfoTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
];