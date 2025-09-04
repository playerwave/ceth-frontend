// src/stores/setNumber.store.ts
import { create } from "zustand";
import { SetNumber } from "../type/assessment.type";
import * as api from "../service/setNumber.service";

interface SetNumberState {
    setNumbers: SetNumber[];
    loading: boolean;
    error: string | null;

    fetchSetNumbers: () => Promise<void>;
    createSetNumber: (data: { name: string; status: string }) => Promise<void>; // 👈 แก้ให้ตรงกับ service
    updateSetNumber: (id: number, data: Partial<SetNumber>) => Promise<void>;
    deleteSetNumber: (id: number) => Promise<void>;
}

export const useSetNumberStore = create<SetNumberState>((set) => ({
    setNumbers: [],
    loading: false,
    error: null,

    fetchSetNumbers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.getSetNumbers(); // ✅ ตอนนี้ res เป็น array แล้ว
            set({ setNumbers: res, loading: false });
        } catch (err) {
            set({ error: "โหลดชุดข้อสอบไม่สำเร็จ", loading: false });
        }
    },


    createSetNumber: async (data) => {
        try {
            await api.createSetNumber(data);
            const res = await api.getSetNumbers();
            set({ setNumbers: res });
        } catch (err) {
            set({ error: "สร้างชุดข้อสอบไม่สำเร็จ" });
        }
    },

    updateSetNumber: async (id, data) => {
        try {
            await api.updateSetNumber(id, data);
            const res = await api.getSetNumbers();
            set({ setNumbers: res });
        } catch (err) {
            set({ error: "แก้ไขชุดข้อสอบไม่สำเร็จ" });
        }
    },

    deleteSetNumber: async (id) => {
        try {
            await api.deleteSetNumber(id);
            const res = await api.getSetNumbers();
            set({ setNumbers: res });
        } catch (err) {
            set({ error: "ลบชุดข้อสอบไม่สำเร็จ" });
        }
    },
}));
