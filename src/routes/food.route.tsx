import ListFoodAdmin from "../pages/Teacher/mangefood-teacher/list-food/list.food.teacher";
import CreateFoodAdmin from "../pages/Teacher/mangefood-teacher/create-food/create.food.teacher";
import EditFoodAdmin from "../pages/Teacher/mangefood-teacher/edit-food/edit.food";

export const foodRoutes = [
  {
    path: "/list-food-teacher",
    element: <ListFoodAdmin />,
    label: "จัดการอาหาร",
    icon: "Utensils",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: true
  },
  {
    path: "/create-food-teacher",
    element: <CreateFoodAdmin />,
    label: "สร้างอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
  {
    path: "/update-food-teacher",
    element: <EditFoodAdmin />,
    label: "แก้ไขอาหาร",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  }
];
