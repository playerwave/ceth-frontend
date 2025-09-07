import { create } from "zustand";
import { Section } from "../type/type.create";

interface AssessmentState {
  formTitle: string;
  formDescription: string;
  sections: Section[];
  setFormTitle: (title: string) => void;
  setFormDescription: (desc: string) => void;
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSectionTitle: (id: number, title: string) => void;
  deleteSection: (id: number) => void;

  // ✅ ฟังก์ชันใหม่สำหรับ question
  addQuestionToSection: (sectionId: number, question: any) => void;
  updateQuestionInSection: (
    sectionId: number,
    questionId: number,
    data: Partial<any>
  ) => void;
  deleteQuestionFromSection: (sectionId: number, questionId: number) => void;
}

export const useAssessmentStoreUi = create<AssessmentState>((set, get) => ({
  formTitle: "แบบประเมินใหม่",
  formDescription: "คำอธิบายแบบประเมิน",
  sections: [
    {
      id: 1,
      title: "หัวข้อที่ 1",
      questions: [
        {
          id: 1,
          type: "choice",
          question: "คำถามตัวอย่าง",
          options: ["ตัวเลือก 1", "ตัวเลือก 2"],
          required: false,
        },
      ],
    },
  ],

  setFormTitle: (title) => set({ formTitle: title }),
  setFormDescription: (desc) => set({ formDescription: desc }),
  setSections: (sections) => set({ sections }),

  addSection: () => {
    const sections = get().sections;
    const newId =
      sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
    set({
      sections: [
        ...sections,
        { id: newId, title: `หัวข้อที่ ${newId}`, questions: [] },
      ],
    });
  },

  updateSectionTitle: (id, title) =>
    set({
      sections: get().sections.map((s) =>
        s.id === id ? { ...s, title } : s
      ),
    }),

  deleteSection: (id) =>
    set({
      sections: get().sections.filter((s) => s.id !== id),
    }),

  // ✅ เพิ่ม question เข้า section
  addQuestionToSection: (sectionId, question) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, question] }
          : s
      ),
    }),

  // ✅ อัปเดต question ตาม id
  updateQuestionInSection: (sectionId, questionId, data) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...data } : q
              ),
            }
          : s
      ),
    }),

  // ✅ ลบ question ออกจาก section
  deleteQuestionFromSection: (sectionId, questionId) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.filter((q) => q.id !== questionId),
            }
          : s
      ),
    }),
}));
