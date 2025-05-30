import { StudentWithActivities } from "../../types/Student/studen";

export const student: StudentWithActivities = {
  students_id: 1,
  users_id: 10,
  first_name: "ณัฐวุฒิ",
  last_name: "แสงชัย",
  email: "example@buu.ac.th",
  risk_status: "Normal",
  education_status: "Studying",
  soft_hours: 12,
  hard_hours: 6,
  faculty_id: 3,
  department_id: 7,
  grade_id: 2,
  eventcoop_id: 1,
  status: "Active",
  selectedActivities: [
    {
      id: 101,
      name: "เรียนรู้การสร้าง NLP Model",
      hours: 3,
      type: "Hard Skill",
      status: "Public",
      recommend: "yes",
    },
    {
      id: 102,
      name: "เรียนรู้",
      hours: 3,
      type: "Soft Skill",
      status: "Public",
      recommend: "yes",
    },
  ],
};
