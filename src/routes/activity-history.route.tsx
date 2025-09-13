import ListActivityHistoryTeacher from "../pages/Teacher/manage-activity-history-teacher/list-activity-history/list.activity.history.teacher";
import ActivityHistoryInfoTeacher from "../pages/Teacher/manage-activity-history-teacher/activity-history-info/activity.history.info.teacher"

//import ActivityHistoryInfoStudent from "../pages/Student/activity-history-student/list-activity-history-student/list.activity.history.student";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/model";
import ListActivityHistoryStudent from "../pages/Student/activity-history-student/list-activity-history-student/list.activity.history.student";
// import ActivityHistoryInfoStudent from "../pages/Student/activity-history-student/activity-history-info-student/activity.history.info.student";
import ActivityInfoStudent from "../pages/Student/activity-student/activity-info/activity_info_student";
type RoleName = Roles["role_name"];

export const activityHistoryRoutes = [
  {
    path: "/list-activity-history-teacher",
    element: <ListActivityHistoryTeacher />,
    label: "ประวัติกิจกรรม",
    icon: "History",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.NONE
  },
   {
    path: "/activity-history-info-teacher",
    element: <ActivityHistoryInfoTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  },
  {
    path: "/list-activity-history-student",
    element: <ListActivityHistoryStudent />,
    label: "ประวัติกิจกรรม",
    icon: "History",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: true
  },
  {
  path: "/activity-history-info-student/:id",
  element: <ActivityInfoStudent />,
  label: "",
  icon: "ClipboardList",
  roles: ["Student"] as RoleName[],
  visibleInSidebar: false
},
];