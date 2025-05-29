export type SkillType = "Hard Skill" | "Soft Skill";

export interface StudentActivity {
  id: number;
  name: string;
  hours: number;
  type: SkillType;
  status: "Public" | "Private";
  recommend?: "yes" | "no"; // ✅ ใช้สำหรับแสดง checkbox
}

export interface StudentSkillProgress {
  hard: number; // จำนวนชั่วโมง Hard Skill ปัจจุบัน
  soft: number; // จำนวนชั่วโมง Soft Skill ปัจจุบัน
}

export interface Student {
  id: number;
  fullName: string;
  studentId: string;
  currentSkill: StudentSkillProgress;
  selectedActivities: StudentActivity[]; // รายการกิจกรรมที่กำลังจะลงทะเบียน
}
