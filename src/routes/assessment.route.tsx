import ListAssessmentTeacher from "../pages/Teacher/manage-assessment-teacher/list-assessment/list.assessment.teacher";
import CreateAssessmentTeacher from "../pages/Teacher/manage-assessment-teacher/create-assessment/create.assessment.teacher";
import EditAssessmentTeacher from "../pages/Teacher/manage-assessment-teacher/edit-assessment/edit.assessment.teacher";

import { ProtectionLevel } from "./secure/urlEnCryption";

import type { Roles } from "../types/model";
type RoleName = Roles["role_name"];

export const assessmentRoutes = [
  {
    path: "/list-assessment-teacher",
    element: <ListAssessmentTeacher />,
    label: "จัดการแบบประเมิน",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: true,
    protectionLevel: ProtectionLevel.ENCODED
  },
   {
    path: "/create-assessment-teacher",
    element: <CreateAssessmentTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
     {
    path: "/update-assessment-teacher",
    element: <EditAssessmentTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"] as RoleName[],
    visibleInSidebar: false,
    protectionLevel: ProtectionLevel.ENCODED
  },
];