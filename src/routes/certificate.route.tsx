import ListCertificateTeacher from "../pages/Teacher/manage-certificate-teacher/list-certificate/list.certificate.teacher";
import PreviewCertificateTeacher from "../pages/Teacher/manage-certificate-teacher/preview-certificate/preview.certificate.teacher";


export const certificateRoutes = [
  {
    path: "/list-certificate-teacher",
    element: <ListCertificateTeacher />,
    label: "จัดเกียรติบัตร",
    icon: "BadgeCheck",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: true
  },
   {
    path: "/preview-certificate-teacher",
    element: <PreviewCertificateTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
];