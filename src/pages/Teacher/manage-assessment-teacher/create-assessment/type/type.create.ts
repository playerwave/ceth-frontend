import { Choice } from "../../../../../types/model"; // 👈 import Choice มาด้วย

export interface Question {
  id: number;
  type: "choice" | "checkbox" | "text" | "rating";
  question: string;
  options: string[] | Choice[];   // ✅ รองรับทั้ง string[] และ Choice[]
  required: boolean;
}

export interface Section {
  id: number;
  title: string;
  questions: Question[];
}

export interface FormData {
  title: string;
  description: string;
  sections: Section[];
  createdAt: string;
  totalSections: number;
  totalQuestions: number;
}
