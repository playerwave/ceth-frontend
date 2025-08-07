import ListCertificateTeacher from "../pages/Teacher/manage-certificate-teacher/list-certificate/list.certificate.teacher";
import PreviewCertificateTeacher from "../pages/Teacher/manage-certificate-teacher/preview-certificate/preview.certificate.teacher";
import ListCertificateStudent from "../pages/Student/certificate-student/list-certificate-student/list.certificate.student";
import SendCertificateStudent from "../pages/Student/certificate-student/send-certificate-student/send.certificate.student";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/model";
type RoleName = Roles["role_name"];

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
    path: "/send-certificate-student",
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