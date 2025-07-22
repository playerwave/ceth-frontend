import ListAssessmentTeacher from "../pages/Teacher/manage-assessment-teacher/list-assessment/list.assessment.teacher";
import CreateAssessmentTeacher from "../pages/Teacher/manage-assessment-teacher/create-assessment/create.assessment.teacher";
import EditAssessmentTeacher from "../pages/Teacher/manage-assessment-teacher/edit-assessment/edit.assessment.teacher";

export const assessmentRoutes = [
  {
    path: "/list-assessment-teacher",
    element: <ListAssessmentTeacher />,
    label: "จัดการแบบประเมิน",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: true
  },
   {
    path: "/create-assessment-teacher",
    element: <CreateAssessmentTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
     {
    path: "/update-assessment-teacher",
    element: <EditAssessmentTeacher />,
    label: "",
    icon: "ClipboardList",
    roles: ["Teacher", "Admin"],
    visibleInSidebar: false
  },
];