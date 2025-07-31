import ListActivityTeacher from "../pages/Teacher/manage-activity-teacher/list_activity_admin/list_activity_admin";
import CreateActivityAdmin from "../pages/Teacher/manage-activity-teacher/create-activity/create_activity_admin";
import UpdateActivityAdmin from "../pages/Teacher/manage-activity-teacher/create-activity/update_activity_admin";
import ActivityInfoAdmin from "../pages/Teacher/manage-activity-teacher/activity-info/activity_info_admin";

import ListActivityStudent from "../pages/Student/activity-student/list_activity_studen/list_activity_student";
import ActivityInfoStudent from "../pages/Student/activity-student/activity-info/activity_info_student";

import ActivityListVisitor from "../pages/visitor/activity-list/visiter";
import ActivityInfoVisitor from "../pages/visitor/activity-info/activity_info_visitor";

import type { Roles } from "../types/model";
import { ProtectionLevel } from "./secure/urlEnCryption";

type RoleName = Roles["role_name"];

export const activityRoutes = [
  {
    path: "/list-activity-admin",
    element: <ListActivityTeacher />,
    label: "รายการกิจกรรม",
    icon: "BookA",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.NONE // ไม่เข้ารหัสเพราะเป็นหน้าหลัก
  },
  {
    path: "/create-activity-admin",
    element: <CreateActivityAdmin />,
    label: "สร้างกิจกรรม",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED // เข้ารหัสแบบง่าย
  },
  {
    path: "/update-activity-admin/:id",
    element: <UpdateActivityAdmin />,
    label: "แก้ไขกิจกรรม",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCRYPTED // เข้ารหัสแบบเต็มเพราะมีข้อมูลสำคัญ
  },
  {
    path: "/activity-info-admin/:id",
    element: <ActivityInfoAdmin />,
    label: "ดูข้อมูลกิจกรรม",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE // ไม่เข้ารหัสสำหรับ URL แบบเก่า
  },
  {
    path: "/activity-info-admin",
    element: <ActivityInfoAdmin />,
    label: "ดูข้อมูลกิจกรรม (เข้ารหัส)",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCRYPTED // เข้ารหัสแบบเต็มเพราะมีข้อมูลสำคัญ
  },
  {
    path: "/list-activity-student",
    element: <ListActivityStudent />,
    label: "กิจกรรมสหกิจ",
    icon: "BookA",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.NONE // ไม่เข้ารหัสเพราะเป็นหน้าหลัก
  },
  {
    path: "/activity-info-student/:id",
    element: <ActivityInfoStudent />,
    label: "ดูข้อมูลกิจกรรมนิสิต",
    icon: "ClipboardList",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCRYPTED // เข้ารหัสแบบเต็มเพราะมีข้อมูลสำคัญ
  },
  {
    path: "/activity-info-student/:id",
    element: <ActivityInfoStudent />,
    label: "ดูข้อมูลกิจกรรมนิสิต",
    icon: "ClipboardList",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: false
  },
  {
    path: "/activity-list-visitor",
    element: <ActivityListVisitor />,
    label: "กิจกรรมสำหรับเยี่ยมชม",
    icon: "BookA",
    roles: ["Visitor", "Admin", "Teacher", "Student"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE // ไม่เข้ารหัสเพราะเป็นหน้าสาธารณะ
  },
  {
    path: "/activity-info-visitor",
    element: <ActivityInfoVisitor />,
    label: "รายละเอียดกิจกรรม",
    icon: "ClipboardList",
    roles: ["Visitor", "Admin", "Teacher", "Student"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED // เข้ารหัสแบบง่ายสำหรับข้อมูลสาธารณะ
  }
];
