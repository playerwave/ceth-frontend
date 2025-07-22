import ListActivityTeacher from "../pages/Teacher/manage-activity-teacher/list_activity_admin/list_activity_admin";
import CreateActivityAdmin from "../pages/Teacher/manage-activity-teacher/create-activity/create_activity_admin";
import UpdateActivityAdmin from "../pages/Teacher/manage-activity-teacher/create-activity/update_activity_admin";
import ActivityInfoAdmin from "../pages/Teacher/manage-activity-teacher/activity-info/activity_info_admin";

import ListActivityStudent from "../pages/Student/activity-student/list_activity_studen/list_activity_student";
import ActivityInfoStudent from "../pages/Student/activity-student/activity-info/activity_info_student";

import ActivityListVisitor from "../pages/visitor/activity-list/visiter";
import ActivityInfoVisitor from "../pages/visitor/activity-info/activity_info_visitor";

export const activityRoutes = [
  {
    path: "/list-activity-admin",
    element: <ListActivityTeacher />,
    label: "รายการกิจกรรม",
    icon: "BookA",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: true
  },
  {
    path: "/create-activity-admin",
    element: <CreateActivityAdmin />,
    label: "สร้างกิจกรรม",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
  {
    path: "/update-activity-admin",
    element: <UpdateActivityAdmin />,
    label: "แก้ไขกิจกรรม",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
  {
    path: "/activity-info-admin/:id",
    element: <ActivityInfoAdmin />,
    label: "ดูข้อมูลกิจกรรม",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
  {
    path: "/list-activity-student",
    element: <ListActivityStudent />,
    label: "กิจกรรมสหกิจ",
    icon: "BookA",
    roles: ["Student"],
    visibleInSidebar: true
  },
  {
    path: "/activity-info-student",
    element: <ActivityInfoStudent />,
    label: "ดูข้อมูลกิจกรรมนิสิต",
    icon: "ClipboardList",
    roles: ["Student"],
    visibleInSidebar: false
  },
  {
    path: "/activity-list-visitor",
    element: <ActivityListVisitor />,
    label: "กิจกรรมสำหรับเยี่ยมชม",
    icon: "BookA",
    roles: ["Visitor"],
    visibleInSidebar: false
  },
  {
    path: "/activity-info-visitor",
    element: <ActivityInfoVisitor />,
    label: "รายละเอียดกิจกรรม",
    icon: "ClipboardList",
    roles: ["Visitor"],
    visibleInSidebar: false
  }
];
