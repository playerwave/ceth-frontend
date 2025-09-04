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
  reset: () => void; // ✅ เพิ่ม reset
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
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
    const newId = sections.length ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
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

  // ✅ reset state เวลาย้ายหน้าออก
  reset: () =>
    set({
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
    }),
}));
