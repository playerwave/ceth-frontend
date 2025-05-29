import { Student } from "../../types/Student/studen";
export const student: Student = {
  id: 1,
  fullName: "ณัฐวุฒิ แสงชัย",
  studentId: "650510123",
  currentSkill: {
    hard: 6,
    soft: 12,
  },
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
      name: "Participating in cooperative...",
      hours: 3,
      type: "Soft Skill",
      status: "Public",
      recommend: "no",
    },
  ],
};
