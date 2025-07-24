import ListActivityHistoryTeacher from "../pages/Teacher/manage-activity-history-teacher/list-activity-history/list.activity.history.teacher";
import ActivityHistoryInfoTeacher from "../pages/Teacher/manage-activity-history-teacher/activity-history-info/activity.history.info.teacher"

import type { Roles } from "../types/model";
type RoleName = Roles["role_name"];

export const activityHistoryRoutes = [
  {
    path: "/list-activity-history-teacher",
    element: <ListActivityHistoryTeacher />,
    label: "ประวัติกิจกรรม",
    icon: "History",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true
  },
   {
    path: "/activity-history-info-teacher",
    element: <ActivityHistoryInfoTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false
  },
  {
    path: "/list-activity-history-student",
    element: <ActivityHistoryInfoTeacher />,
    label: "ประวัติกิจกรรม",
    icon: "History",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: true
  },
  {
    path: "/activity-history-info-student",
    element: <ActivityHistoryInfoTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: false
  },
];