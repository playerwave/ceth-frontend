import { Choice } from "../../../../../types/assessment/choice.type";

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
