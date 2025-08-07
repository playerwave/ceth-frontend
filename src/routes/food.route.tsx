import ListFoodAdmin from "../pages/Teacher/mangefood-teacher/list-food/list.food.teacher";
import CreateFoodAdmin from "../pages/Teacher/mangefood-teacher/create-food/create.food.teacher";
import EditFoodAdmin from "../pages/Teacher/mangefood-teacher/edit-food/edit.food";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/model";
type RoleName = Roles["role_name"];

export const foodRoutes = [
  {
    path: "/list-food-teacher",
    element: <ListFoodAdmin />,
    label: "จัดการอาหาร",
    icon: "Utensils",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/create-food-teacher",
    element: <CreateFoodAdmin />,
    label: "สร้างอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/update-food-teacher",
    element: <EditFoodAdmin />,
    label: "แก้ไขอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
     protectionLevel: ProtectionLevel.ENCODED
  }
];
