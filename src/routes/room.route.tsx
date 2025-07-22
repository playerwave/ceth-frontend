import ListRoomAdmin from "../pages/Teacher/manageroom-teacher/list-room/list.room.teacher";
import CreateRoomAdmin from "../pages/Teacher/manageroom-teacher/create-room/create.room.teacher";
import EditRoomAdmin from "../pages/Teacher/manageroom-teacher/edit-room/edit.room.teacher";

export const roomRoutes = [
  {
    path: "/list-room-teacher",
    element: <ListRoomAdmin />,
    label: "จัดการห้อง",
    icon: "School",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: true
  },
  {
    path: "/create-room-teacher",
    element: <CreateRoomAdmin />,
    label: "สร้างอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
  {
    path: "/update-room-teacher",
    element: <EditRoomAdmin />,
    label: "แก้ไขอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  }
];