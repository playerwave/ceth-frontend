import ListActivityTeacher from "../pages/Teacher/manage-activity-teacher/list-activity/list.activity.teacher";
import CreateActivityAdmin from "../pages/Teacher/manage-activity-teacher/create-update-activity/create.activity.teacher";
import UpdateActivityAdmin from "../pages/Teacher/manage-activity-teacher/create-update-activity/update.activity.teacher";
import ActivityInfoAdmin from "../pages/Teacher/manage-activity-teacher/activity-info/activity.info.teacher";
import QrActivityTeacher from "../pages/Teacher/manage-activity-teacher/activity-qr-code/qr_activity_teacher";

import ListActivityStudent from "../pages/Student/activity-student/list-activity-student/list.activity.student";
import ActivityInfoStudent from "../pages/Student/activity-student/activity-info/activity.info.student";
import ActivityCheckInOutStudent from "../pages/Student/activity-student/activity-checkin-checkout/activity.checkinout.student";

import ActivityListVisitor from "../pages/visitor/activity-list/visiter";
import ActivityInfoVisitor from "../pages/visitor/activity-info/activity.info.visitor";

import type { Roles } from "../types/roles.type";
import { ProtectionLevel } from "./secure/urlEnCryption";
import StatisticActivityTeacher from "../pages/Teacher/manage-activity-teacher/activity-statistic/statistic_activity_teacher";

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
    protectionLevel: ProtectionLevel.NONE // ไม่เข้ารหัสสำหรับ URL แบบเก่า
  },
  {
    path: "/activity-checkin-checkout/:id",
    element: <ActivityCheckInOutStudent />,
    label: "ลงทะเบียนเข้าร่วมกิจกรรม",
    icon: "UserCheck",
    roles: ["Visitor","Student", "Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCRYPTED // เข้ารหัสแบบเต็มเพราะมีข้อมูลสำคัญ
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
  },
  {
    path: "/qr-activity-teacher/:id",
    element: <QrActivityTeacher />,
    label: "QR Code กิจกรรม",
    icon: "QrCode",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCRYPTED // เข้ารหัสแบบเต็มเพราะเป็น QR Code
  },
  {
    path: "/qr-activity-checkinout-student/:id",
    element: <ActivityCheckInOutStudent />,
    label: "ลงทะเบียนเข้าร่วมกิจกรรม",
    icon: "UserCheck",
    roles: ["Teacher","Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  },
  {
    path: "/statistic-activity-teacher/:id",
    element: <StatisticActivityTeacher />,
    label: "สถิติกิจกรรม",
    icon: "BarChart",
    roles: ["Teacher","Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.NONE
  }
];
