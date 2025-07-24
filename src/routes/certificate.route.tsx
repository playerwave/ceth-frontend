import ListCertificateTeacher from "../pages/Teacher/manage-certificate-teacher/list-certificate/list.certificate.teacher";
import PreviewCertificateTeacher from "../pages/Teacher/manage-certificate-teacher/preview-certificate/preview.certificate.teacher";

import type { Roles } from "../types/model";
type RoleName = Roles["role_name"];

export const certificateRoutes = [
  {
    path: "/list-certificate-teacher",
    element: <ListCertificateTeacher />,
    label: "จัดเกียรติบัตร",
    icon: "BadgeCheck",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true
  },
   {
    path: "/preview-certificate-teacher",
    element: <PreviewCertificateTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false
  },
];