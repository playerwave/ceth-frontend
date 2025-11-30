import ListCertificateTeacher from "@/pages/Teacher/manage-certificate-teacher/list-certificate/list.certificate.teacher";
import PreviewCertificateTeacher from "@/pages/Teacher/manage-certificate-teacher/preview-certificate/preview.certificate.teacher";
import ListCertificateStudent from "@/pages/Student/certificate-student/list-certificate-student/list.certificate.student";
import SendCertificateStudent from "@/pages/Student/certificate-student/send-certificate-student/send.certificate.student";
import ListPassCertificateTeacher from "@/pages/Teacher/manage-activity-teacher/list-pass-certificate/list.pass.certificate.teacher";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "@/types/roles.type";
type RoleName = Roles["roles_name"];

export const certificateRoutes = [
  {
    path: "/list-certificate-teacher",
    element: <ListCertificateTeacher />,
    label: "จัดการเกียรติบัตร",
    icon: "BadgeCheck",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.ENCODED
  },
   {
    path: "/preview-certificate-teacher",
    element: <PreviewCertificateTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/list-pass-certificate-teacher/:activityId",
    element: <ListPassCertificateTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/send-certificate-student/:id?",
    element: <SendCertificateStudent />,
    label: "",
    icon: "ClipboardList",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
  {
    path: "/list-certificate-student",
    element: <ListCertificateStudent />,
    label: "ยื่นเกียรติบัตร",
    icon: "BadgeCheck",
    roles: ["Student"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.ENCODED
  },
];