import ListUserTeacher from "../pages/Teacher/manage-user-teacher/list-user-teacher/list.user.teacher";
import CreateUserTeacher from "../pages/Teacher/manage-user-teacher/create-user-teacher/create.user.teacher";
import UserInfoTeacher from "../pages/Teacher/manage-user-teacher/user-info-teacher/user.info.teacher"

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/model";
type RoleName = Roles["role_name"];

export const userRoutes = [
  {
    path: "/list-user-teacher",
    element: <ListUserTeacher />,
    label: "จัดผู้ใช้งาน",
    icon: "Users",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
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