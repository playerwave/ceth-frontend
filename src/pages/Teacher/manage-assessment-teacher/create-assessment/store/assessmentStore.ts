import { create } from "zustand";
import { Section } from "../type/type.create";
import { LocalChoice } from "../type/type.create"; // 👈 type ของ choice local

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
  addQuestionToSection: (sectionId: number, question: any) => void;
  updateQuestionInSection: (
    sectionId: number,
    questionId: number,
    data: Partial<any>
  ) => void;
  deleteQuestionFromSection: (sectionId: number, questionId: number) => void;

  // 👇 ใหม่: จัดการ choices ตอน create
  addChoiceToQuestion: (
    sectionId: number,
    questionId: number,
    choiceText: string
  ) => void;
  updateChoiceInQuestion: (
    sectionId: number,
    questionId: number,
    choiceId: number,
    text: string
  ) => void;
  deleteChoiceFromQuestion: (
    sectionId: number,
    questionId: number,
    choiceId: number
  ) => void;
}

export const useAssessmentStoreUi = create<AssessmentState>((set, get) => ({
  formTitle: "แบบประเมินใหม่",
  formDescription: "คำอธิบายแบบประเมิน",
  sections: [],

  setFormTitle: (title) => set({ formTitle: title }),
  setFormDescription: (desc) => set({ formDescription: desc }),
  setSections: (sections) => set({ sections }),

  addSection: () => {
    const sections = get().sections;
    const newId = sections.length
      ? Math.max(...sections.map((s) => s.id)) + 1
      : 1;
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

  addQuestionToSection: (sectionId, question) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, question] }
          : s
      ),
    }),

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

  // =============== 👇 Choice handlers =================
  addChoiceToQuestion: (sectionId, questionId, choiceText) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: [
                        ...(q.options || []),
                        {
                          choice_id: Date.now(), // random id local
                          choice_text: choiceText,
                        } as LocalChoice,
                      ],
                    }
                  : q
              ),
            }
          : s
      ),
    }),

  updateChoiceInQuestion: (sectionId, questionId, choiceId, text) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt: LocalChoice) =>
                        opt.choice_id === choiceId
                          ? { ...opt, choice_text: text }
                          : opt
                      ),
                    }
                  : q
              ),
            }
          : s
      ),
    }),

  deleteChoiceFromQuestion: (sectionId, questionId, choiceId) =>
    set({
      sections: get().sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.filter(
                        (opt: LocalChoice) => opt.choice_id !== choiceId
                      ),
                    }
                  : q
              ),
            }
          : s
      ),
    }),
}));
