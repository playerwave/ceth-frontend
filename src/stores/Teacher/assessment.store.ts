import { create } from "zustand";
import { AssessmentState } from "../state/assessment.state";
import { Assessment } from "../../types/model";
import assessmentService from "../../service/Teacher/assessment.service";
import {
  mapApiToAssessments,
  mapApiToAssessment,
} from "../mapper/assessment.mapper";

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  assessments: [],
  selectedAssessment: null,
  assessmentLoading: false,
  assessmentError: null,
  searchResults: null,

  fetchAssessments: async () => {
    set({ assessmentLoading: true, assessmentError: null });
    try {
      const apiAssessments = await assessmentService.getAllAssessments();
      const mapped = mapApiToAssessments(apiAssessments);
      set({ assessments: mapped });
    } catch (err) {
      console.error("❌ fetchAssessments error:", err);
      set({ assessmentError: "ไม่สามารถโหลดข้อมูลแบบประเมินได้" });
    } finally {
      set({ assessmentLoading: false });
    }
  },

  fetchAssessmentById: async (id: number) => {
    try {
      const apiAssessment = await assessmentService.getAssessmentById(id);
      return mapApiToAssessment(apiAssessment);
    } catch {
      return null;
    }
  },

  createAssessment: async (data: Partial<Assessment>) => {
    const {
      assessment_name,
      description,
      assessment_status,
      set_number,
      status,
      create_date,
      last_update,
    } = data;

    if (
      !assessment_name ||
      !description ||
      !assessment_status ||
      !set_number ||
      !status
    ) {
      set({ assessmentError: "ข้อมูลไม่ครบ ไม่สามารถสร้างแบบประเมินได้" });
      return;
    }

    await assessmentService.createAssessment({
      assessment_name,
      description,
      assessment_status,
      set_number,
      status,
      create_date: create_date ?? new Date().toISOString(),
      last_update: last_update ?? new Date().toISOString(),
    });

    await get().fetchAssessments();
  },

  updateAssessment: async (data) => {
    try {
      await assessmentService.updateAssessment(data);
      await get().fetchAssessments();
    } catch {
      console.error("❌ Error updating assessment");
    }
  },

  deleteAssessment: async (id) => {
    try {
      await assessmentService.deleteAssessment(id);
      await get().fetchAssessments();
    } catch {
      console.error("❌ Error deleting assessment");
    }
  },

  clearSelectedAssessment: () => set({ selectedAssessment: null }),

  searchAssessments: async (name: string) => {
    if (!name.trim()) {
      await get().fetchAssessments();
      set({ searchResults: null });
      return;
    }

    set({ assessmentLoading: true, assessmentError: null });
    try {
      const apiAssessments = await assessmentService.searchAssessments(name);
      const mapped = mapApiToAssessments(apiAssessments);
      set({ searchResults: mapped });
    } catch {
      set({ assessmentError: "ไม่สามารถค้นหาแบบประเมินได้" });
    } finally {
      set({ assessmentLoading: false });
    }
  },
}));
