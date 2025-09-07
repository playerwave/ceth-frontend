import { create } from "zustand";
import { SetNumberState } from "../state/setNumber.state";
import setNumberService from "../../service/Teacher/setNumber.service";
import { mapApiToSetNumbers, mapApiToSetNumber } from "../mapper/setNumber.mapper";

export const useSetNumberStore = create<SetNumberState>((set, get) => ({
  setNumbers: [],
  selectedSetNumber: null,
  setNumberLoading: false,
  setNumberError: null,

  fetchSetNumbers: async () => {
    set({ setNumberLoading: true, setNumberError: null });
    try {
      const apiData = await setNumberService.getAllSetNumbers();
      set({ setNumbers: mapApiToSetNumbers(apiData) });
    } catch (err) {
      console.error("❌ fetchSetNumbers error:", err);
      set({ setNumberError: "ไม่สามารถโหลด SetNumber ได้" });
    } finally {
      set({ setNumberLoading: false });
    }
  },

  fetchSetNumbersByAssessment: async (assessmentId) => {
    set({ setNumberLoading: true, setNumberError: null });
    try {
      const apiData = await setNumberService.getSetNumbersByAssessment(assessmentId);
      set({ setNumbers: mapApiToSetNumbers(apiData) });
    } catch (err) {
      console.error("❌ fetchSetNumbersByAssessment error:", err);
      set({ setNumberError: "ไม่สามารถโหลดหัวข้อของ Assessment ได้" });
    } finally {
      set({ setNumberLoading: false });
    }
  },

  fetchSetNumberById: async (id) => {
    try {
      const apiData = await setNumberService.getSetNumberById(id);
      return mapApiToSetNumber(apiData);
    } catch {
      return null;
    }
  },

  // ✅ สร้างหัวข้อใหม่
  createSetNumber: async (data) => {
    try {
      const apiData = await setNumberService.createSetNumber(data);
      const newSection = mapApiToSetNumber(apiData);
      set((state) => ({
        setNumbers: [...state.setNumbers, newSection],
      }));
      return newSection;
    } catch (err) {
      console.error("❌ createSetNumber error:", err);
      return null;
    }
  },

  // ✅ อัปเดตหัวข้อ
  updateSetNumber: async (data) => {
    try {
      const apiData = await setNumberService.updateSetNumber(data);
      const updated = mapApiToSetNumber(apiData);
      set((state) => ({
        setNumbers: state.setNumbers.map((s) =>
          s.set_number_id === updated.set_number_id ? updated : s
        ),
      }));
      return updated;
    } catch (err) {
      console.error("❌ updateSetNumber error:", err);
      return null;
    }
  },

  // ✅ ลบหัวข้อ
  deleteSetNumber: async (id) => {
    try {
      const apiData = await setNumberService.deleteSetNumber(id);
      const deleted = mapApiToSetNumber(apiData);
      set((state) => ({
        setNumbers: state.setNumbers.filter(
          (s) => s.set_number_id !== deleted.set_number_id
        ),
      }));
      return deleted;
    } catch (err) {
      console.error("❌ deleteSetNumber error:", err);
      return null;
    }
  },

  clearSelectedSetNumber: () => set({ selectedSetNumber: null }),
}));
