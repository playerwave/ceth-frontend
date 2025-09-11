import { create } from "zustand";
import { SetNumberState } from "../state/setNumber.state";
import setNumberService from "../../service/Teacher/setNumber.service";
import { mapApiToSetNumbers, mapApiToSetNumber } from "../mapper/setNumber.mapper";

export const useSetNumberStore = create<SetNumberState>((set) => ({
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

  duplicateSetNumber: async (id: number) => {
    try {
      const apiData = await setNumberService.duplicateSetNumber(id);
      const duplicated = mapApiToSetNumber(apiData);
      set((state) => {
        // ✅ หาตำแหน่งของ section ต้นฉบับ
        const originalIndex = state.setNumbers.findIndex(s => s.set_number_id === id);
        console.log("🔍 Original section index:", originalIndex, "for id:", id);
        
        // ✅ ถ้าไม่พบ section ต้นฉบับ ให้เพิ่มที่ท้าย
        if (originalIndex === -1) {
          console.log("⚠️ Original section not found, adding to end");
          return { setNumbers: [...state.setNumbers, duplicated] };
        }
        
        // ✅ แทรก section ที่ copy มาใหม่ถัดจาก section ต้นฉบับ
        const newSetNumbers = [...state.setNumbers];
        newSetNumbers.splice(originalIndex + 1, 0, duplicated);
        
        console.log("✅ Inserted duplicated section at index:", originalIndex + 1);
        console.log("📋 New order:", newSetNumbers.map(s => ({ id: s.set_number_id, title: s.name })));
        
        return { setNumbers: newSetNumbers };
      });
      return duplicated;
    } catch (err) {
      console.error("❌ duplicateSetNumber error:", err);
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
