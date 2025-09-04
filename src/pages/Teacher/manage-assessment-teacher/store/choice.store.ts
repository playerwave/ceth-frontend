// src/stores/choice.store.ts
import { create } from "zustand";
import { Choice } from "../type/assessment.type";
import * as api from "../service/choice.service";

interface ChoiceState {
  choices: Choice[];
  loading: boolean;
  error: string | null;

  fetchChoices: () => Promise<void>;
  createChoice: (data: Partial<Choice>) => Promise<void>;
  updateChoice: (id: number, data: Partial<Choice>) => Promise<void>;
  deleteChoice: (id: number) => Promise<void>;
}

export const useChoiceStore = create<ChoiceState>((set) => ({
  choices: [],
  loading: false,
  error: null,

  fetchChoices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getChoices();
      set({ choices: data, loading: false });
    } catch (err) {
      set({ error: "โหลดตัวเลือกไม่สำเร็จ", loading: false });
    }
  },

  createChoice: async (data) => {
    try {
      await api.createChoice(data);
      const updated = await api.getChoices();
      set({ choices: updated });
    } catch (err) {
      set({ error: "สร้างตัวเลือกไม่สำเร็จ" });
    }
  },

  updateChoice: async (id, data) => {
    try {
      await api.updateChoice(id, data);
      const updated = await api.getChoices();
      set({ choices: updated });
    } catch (err) {
      set({ error: "แก้ไขตัวเลือกไม่สำเร็จ" });
    }
  },

  deleteChoice: async (id) => {
    try {
      await api.deleteChoice(id);
      const updated = await api.getChoices();
      set({ choices: updated });
    } catch (err) {
      set({ error: "ลบตัวเลือกไม่สำเร็จ" });
    }
  },
}));
