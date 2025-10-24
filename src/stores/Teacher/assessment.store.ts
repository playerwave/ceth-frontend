import { create } from "zustand";
import { AssessmentState } from "../state/assessment.state";
import { Assessment } from "@/types/assessment/assessment.type";
import assessmentService from "@/service/Teacher/assessment.service";
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
  // versioning state
  versions: [],
  selectedVersion: null,
  versionLoading: false,
  versionError: null,

  fetchAssessments: async (type: "latest" | "published" | "all" = "latest") => {
    set({ assessmentLoading: true, assessmentError: null });
    try {
      const apiAssessments = await assessmentService.getAllAssessments(type, 1, 100);
      const mapped = mapApiToAssessments(apiAssessments);
      set({ assessments: mapped });
    } catch (err) {
      console.error("❌ [AssessmentStore] fetchAssessments error:", err);
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

      status,
      create_date,
      last_update,
    } = data;

    if (
      !assessment_name ||
      !description ||
      !assessment_status ||

      !status
    ) {
      set({ assessmentError: "ข้อมูลไม่ครบ ไม่สามารถสร้างแบบประเมินได้" });
      return;
    }

    await assessmentService.createAssessment({
      assessment_name,
      description,
      assessment_status,
      status,
      create_date: create_date instanceof Date ? create_date.toISOString() : create_date ?? new Date().toISOString(),
      last_update: last_update instanceof Date ? last_update.toISOString() : last_update ?? new Date().toISOString(),
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



  duplicateAssessment: async (id: number) => {
    try {
      // 1. ดึงข้อมูลเต็มของ assessment
      const original = await assessmentService.getAssessmentFullById(id);

      if (!original) {
        throw new Error("ไม่พบข้อมูล Assessment ที่จะทำซ้ำ");
      }

      // 2. clone assessment (ตัด id ทิ้ง + แก้ชื่อ + อัปเดตวันที่)
      const newAssessment = {
        ...original,
        assessment_id: undefined,
        assessment_name: `${original.assessment_name} (สำเนา)`,
        create_date: new Date().toISOString(),
        last_update: new Date().toISOString(),
      };

      // 3. สร้างใหม่แบบ full (assessment + sections + questions + choices)
      await assessmentService.createAssessmentFull(newAssessment);

      // 4. refresh list
      await get().fetchAssessments();

    } catch (error) {
      console.error("❌ Error duplicating assessment", error);
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

  // =============== Versioning actions ===============
  fetchVersionHistory: async (assessmentId: number) => {
    set({ versionLoading: true, versionError: null });
    try {
      const versions = await assessmentService.getVersionHistory(assessmentId);
      set({ versions });
    } catch (e) {
      console.error("❌ [AssessmentStore] fetchVersionHistory error:", e);
      set({ versionError: "โหลดประวัติเวอร์ชันไม่สำเร็จ" });
    } finally {
      set({ versionLoading: false });
    }
  },

  fetchAllVersionAssessment: async (assessmentId: number) => {
    set({ versionLoading: true, versionError: null });
    try {
      const versions = await assessmentService.getAllVersionAssessment(assessmentId);
      set({ versions });
    } catch (e) {
      console.error("❌ [AssessmentStore] fetchAllVersionAssessment error:", e);
      set({ versionError: "โหลดเวอร์ชันทั้งหมดไม่สำเร็จ" });
    } finally {
      set({ versionLoading: false });
    }
  },

  fetchLatestPublishedVersion: async (assessmentId: number) => {
    set({ versionLoading: true, versionError: null });
    try {
      const version = await assessmentService.getLatestPublishedVersion(assessmentId);
      set({ selectedVersion: version });
      return version;
    } catch (e) {
      console.error("❌ [AssessmentStore] fetchLatestPublishedVersion error:", e);
      set({ versionError: "โหลดเวอร์ชันล่าสุดไม่สำเร็จ" });
      return null;
    } finally {
      set({ versionLoading: false });
    }
  },

  fetchVersionWithFullData: async (versionId: number) => {
    set({ versionLoading: true, versionError: null });
    try {
      const version = await assessmentService.getVersionWithFullData(versionId);
      set({ selectedVersion: version });
      return version;
    } catch (e) {
      console.error("❌ [AssessmentStore] fetchVersionWithFullData error:", e);
      set({ versionError: "โหลดข้อมูลเวอร์ชันไม่สำเร็จ" });
      return null;
    } finally {
      set({ versionLoading: false });
    }
  },

  createVersion: async (assessmentId: number) => {
    try {
      await assessmentService.createVersion(assessmentId);
      const state = get();
      if (state.fetchVersionHistory) {
        await state.fetchVersionHistory(assessmentId);
      }
    } catch (e) {
      console.error("❌ [AssessmentStore] createVersion error:", e);
      set({ versionError: "สร้างเวอร์ชันไม่สำเร็จ" });
    }
  },

  publishAssessment: async (assessmentId: number) => {
    try {
      const latest = await assessmentService.getLatestPublishedVersion(assessmentId);
      const latestVersionId = latest?.assessment_version_id ?? null;
      if (!latestVersionId) {
        // ถ้ายังไม่มีเวอร์ชันที่ publish เลย ให้สร้างเวอร์ชันใหม่แล้ว publish
        const created = await assessmentService.createVersion(assessmentId);
        const newVersionId = created?.version?.assessment_version_id || created?.assessment_version_id;
        if (newVersionId) {
          await assessmentService.publishVersion(assessmentId, newVersionId);
        }
      } else {
        // ถ้ามีเวอร์ชันล่าสุดแล้ว ให้ publish เวอร์ชันใหม่ถ้าจำเป็น (ที่นี่ตัวอย่าง: publish เวอร์ชันใหม่โดยสร้างก่อน)
        const created = await assessmentService.createVersion(assessmentId);
        const newVersionId = created?.version?.assessment_version_id || created?.assessment_version_id;
        await assessmentService.publishVersion(assessmentId, newVersionId ?? latestVersionId);
      }
      const state = get();
      if (state.fetchVersionHistory) {
        await state.fetchVersionHistory(assessmentId);
      }
      if (state.fetchAssessments) {
        await state.fetchAssessments();
      }
    } catch (e) {
      console.error("❌ [AssessmentStore] publishAssessment error:", e);
      set({ versionError: "เผยแพร่เวอร์ชันไม่สำเร็จ" });
    }
  },

  setSelectedVersion: (version: any) => set({ selectedVersion: version }),
}));
