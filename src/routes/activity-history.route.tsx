import ListActivityHistoryTeacher from "../pages/Teacher/manage-activity-history-teacher/list-activity-history/list.activity.history.teacher";
import ActivityHistoryInfoTeacher from "../pages/Teacher/manage-activity-history-teacher/activity-history-info/activity.history.info.teacher"

export const activityHistoryRoutes = [
  {
    path: "/list-activity-history-teacher",
    element: <ListActivityHistoryTeacher />,
    label: "ประวัติกิจกรรม",
    icon: "History",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: true
  },
   {
    path: "/activity-history-info-teacher",
    element: <ActivityHistoryInfoTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
];