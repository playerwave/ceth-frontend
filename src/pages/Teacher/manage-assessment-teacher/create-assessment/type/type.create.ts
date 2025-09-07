export interface Question {
  id: number;
  type: 'choice' | 'checkbox' | 'text' | 'rating';
  question: string;
  options: LocalChoice[];
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



export interface LocalChoice {
  choice_id?: number;      // ยังไม่สร้างใน backend
  choice_text: string;
  question_id?: number;    // ยังไม่ผูกกับ question จริง
  choice_number?: number;
}
