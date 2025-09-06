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

  createSetNumber: async (data) => {
    try {
      await setNumberService.createSetNumber(data);
      await get().fetchSetNumbers();
    } catch (err) {
      console.error("❌ createSetNumber error:", err);
    }
  },

  updateSetNumber: async (data) => {
    try {
      await setNumberService.updateSetNumber(data);
      await get().fetchSetNumbers();
    } catch (err) {
      console.error("❌ updateSetNumber error:", err);
    }
  },

  deleteSetNumber: async (id) => {
    try {
      await setNumberService.deleteSetNumber(id);
      await get().fetchSetNumbers();
    } catch (err) {
      console.error("❌ deleteSetNumber error:", err);
    }
  },

  clearSelectedSetNumber: () => set({ selectedSetNumber: null }),
}));
