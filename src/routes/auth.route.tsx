import Login from "@/pages/visitor/login/login";
import ForgotPassword from "@/pages/visitor/forgot-passsword/forgot.password";
import CreatePasswordStudent from "@/pages/visitor/new-password/create.password";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "@/types/roles.type";
type RoleName = Roles["roles_name"];

export const authRoutes = [
  {
    path: "/login",
    element: <Login />,
    label: "เข้าสู่ระบบ",
    icon: "LogIn",
    roles: ["Visitor", "Student", "Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    label: "ลืมรหัสผ่าน",
    icon: "HelpCircle",
    roles: ["Visitor", "Student", "Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  },
  {
    path: "/new-password-student",
    element: <CreatePasswordStudent />,
    label: "สร้างรหัสผ่านใหม่",
    icon: "Key",
    roles:["Visitor", "Student", "Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  },
  {
    path: "/new-password",
    element: <CreatePasswordStudent />,
    label: "สร้างรหัสผ่านใหม่",
    icon: "Key",
    roles: ["Visitor", "Student", "Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  },
];

