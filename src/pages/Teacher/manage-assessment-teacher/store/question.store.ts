// src/stores/question.store.ts
import { create } from "zustand";
import { Question } from "../type/assessment.type";
import * as api from "../service/question.service";

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;

  fetchQuestions: () => Promise<void>;
  createQuestion: (data: Partial<Question>) => Promise<void>;
  updateQuestion: (id: number, data: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  loading: false,
  error: null,

  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getQuestions();
      set({ questions: data, loading: false });
    } catch (err) {
      set({ error: "โหลดคำถามไม่สำเร็จ", loading: false });
    }
  },

  createQuestion: async (data) => {
    try {
      await api.createQuestion(data);
      const updated = await api.getQuestions();
      set({ questions: updated });
    } catch (err) {
      set({ error: "สร้างคำถามไม่สำเร็จ" });
    }
  },

  updateQuestion: async (id, data) => {
    try {
      await api.updateQuestion(id, data);
      const updated = await api.getQuestions();
      set({ questions: updated });
    } catch (err) {
      set({ error: "แก้ไขคำถามไม่สำเร็จ" });
    }
  },

  deleteQuestion: async (id) => {
    try {
      await api.deleteQuestion(id);
      const updated = await api.getQuestions();
      set({ questions: updated });
    } catch (err) {
      set({ error: "ลบคำถามไม่สำเร็จ" });
    }
  },
}));
