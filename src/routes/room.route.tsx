import ListRoomAdmin from "../pages/Teacher/manage-room-teacher/list-room/list.room.teacher";
import CreateRoomAdmin from "../pages/Teacher/manage-room-teacher/create-room/create.room.teacher";
import EditRoomAdmin from "../pages/Teacher/manage-room-teacher/edit-room/edit.room.teacher";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/roles.type";
type RoleName = Roles["roles_name"];

export const roomRoutes = [
  {
    path: "/list-room-teacher",
    element: <ListRoomAdmin />,
    label: "จัดการห้อง",
    icon: "School",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/create-room-teacher",
    element: <CreateRoomAdmin />,
    label: "สร้างอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/update-room-teacher",
    element: <EditRoomAdmin />,
    label: "แก้ไขอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  }
];