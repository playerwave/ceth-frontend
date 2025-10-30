import { create } from "zustand";
import questionService from "@/service/Teacher/question.service";
import { mapApiToQuestion, mapApiToQuestions } from "../mapper/question.mapper";
import {Question} from "@/types/assessment/question.type";

// ✅ Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: number;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;

  fetchQuestions: () => Promise<void>;
  fetchQuestionsBySetNumber: (setNumberId: number) => Promise<void>;
  createQuestion: (data: { question_text: string; question_number: number; set_number_id: number; question_type: string }) => Promise<Question | null>;
  updateQuestion: (data: Question) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
  updateQuestionsOrder: (setNumberId: number, newOrder: Question[]) => void;
  updateQuestionsOrderInDatabase: (setNumberId: number, newOrder: Question[]) => Promise<void>;
  revertQuestionsOrder: (setNumberId: number, originalOrder: Question[]) => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  loading: false,
  error: null,

  // ✅ ดึงคำถามทั้งหมด
  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const apiData = await questionService.getAllQuestions();

      // ❌ ต้องส่ง setNumberId -> แต่ใน allQuestions backend ไม่ได้ให้ set_number_id
      // 👉 ถ้า backend มี set_number_id ใน response ให้ส่งลง mapApiToQuestions(apiData, q.set_number_id)
      // ตอนนี้สมมติว่า response มีค่า set_number_id มาด้วย
      set({ questions: mapApiToQuestions(apiData, 0) });
    } catch (err) {
      console.error("❌ fetchQuestions error:", err);
      set({ error: "โหลดคำถามไม่สำเร็จ" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ ดึงคำถามตาม set_number_id
  fetchQuestionsBySetNumber: async (setNumberId) => {
    set({ loading: true, error: null });
    try {
      const apiData = await questionService.getQuestionsBySetNumber(setNumberId);

      // 🔄 รวมกับ questions ที่มีอยู่ เพื่อไม่ให้หายของ set อื่น
      const other = get().questions.filter((q) => (q as any).set_number_id !== setNumberId);

      const mapped = mapApiToQuestions(apiData, setNumberId);

      set({ questions: [...other, ...mapped] });
      console.log("✅ Mapped questions:", mapped);
    } catch (err) {
      console.error("❌ fetchQuestionsBySetNumber error:", err);
      set({ error: "โหลดคำถามของหัวข้อไม่สำเร็จ" });
    } finally {
      set({ loading: false });
    }
  },

  createQuestionWithChoices: async (data: {
    question_text: string;
    question_number: number;   // ✅ เพิ่มตรงนี้
    set_number_id: number;
    question_type: string;
    options: { choice_text: string }[];
  }) => {
    try {
      console.log("📝 Creating question+choices:", data);
      const apiData = await questionService.createQuestionWithChoices(data);

      if (!apiData || !apiData.question_id) {
        console.error("❌ API ไม่คืน question_id:", apiData);
        await get().fetchQuestionsBySetNumber(data.set_number_id);
        return null;
      }

      // ✅ map กลับเข้าร้าน
      const newQ = mapApiToQuestion(apiData, data.set_number_id);
      set({ questions: [...get().questions, newQ] });
      return newQ;
    } catch (err) {
      console.error("❌ createQuestionWithChoices error:", err);
      await get().fetchQuestionsBySetNumber(data.set_number_id);
      return null;
    }
  },




  createQuestion: async (data) => {
    try {
      console.log("📝 Creating question with data:", data);
      const apiData = await questionService.createQuestion({
        question_text: data.question_text || "",
        question_number: data.question_number || 1,
        set_number_id: data.set_number_id || 0,
        question_type: data.question_type || ""
      });

      console.log("📨 API Response:", apiData);

      // ✅ รองรับทั้ง { question_id: ... } และ { data: { question_id: ... } }
      const raw = (apiData as any)?.data ?? apiData;

      if (!raw || !raw.question_id) {
        console.error("❌ API response missing question_id:", apiData);

        // ✅ ถ้า API ไม่ส่ง question_id กลับมา ให้ refresh แทน
        await get().fetchQuestionsBySetNumber(data.set_number_id);
        return null;
      }

      const newQ = mapApiToQuestion(raw, data.set_number_id);
      console.log("✅ Mapped new question:", newQ);

      // ✅ เพิ่มคำถามใหม่เข้าไปใน state
      set({ questions: [...get().questions, newQ] });

      return newQ;
    } catch (err) {
      console.error("❌ createQuestion error:", err);

      // ✅ ถ้าเกิด error ให้ refresh เพื่อให้แน่ใจว่าข้อมูลถูกต้อง
      try {
        await get().fetchQuestionsBySetNumber(data.set_number_id);
      } catch (fetchErr) {
        console.error("❌ Failed to refresh questions:", fetchErr);
      }

      return null;
    }
  },


  // ✅ อัปเดตคำถาม
  updateQuestion: async (data) => {
    try {
      await questionService.updateQuestion({
        question_id: data.question_id,
        question_text: data.question_text,
        question_number: data.question_number,
        set_number_id: data.set_number_id,
        question_type: data.question_type || ""
      });
      set({
        questions: get().questions.map((q) =>
          q.question_id === data.question_id ? data : q
        ),
      });
    } catch (err) {
      console.error("❌ updateQuestion error:", err);
    }
  },

  // ✅ ลบคำถาม
  deleteQuestion: async (id) => {
    try {
      await questionService.deleteQuestion(id);
      set({ questions: get().questions.filter((q) => q.question_id !== id) });
    } catch (err) {
      console.error("❌ deleteQuestion error:", err);
    }
  },

  // ✅ อัปเดตลำดับคำถามแบบ Optimistic Update
  updateQuestionsOrder: (setNumberId, newOrder) => {
    const { questions } = get();
    
    // ✅ รวมคำถามจาก section อื่น + คำถามใหม่ที่เรียงลำดับแล้ว
    const otherQuestions = questions.filter((q) => q.set_number_id !== setNumberId);
    
    // ✅ อัปเดต question_number ตามลำดับใหม่
    const updatedOrder = newOrder.map((q, index) => ({
      ...q,
      question_number: index + 1,
    }));
    
    set({ questions: [...otherQuestions, ...updatedOrder] });
    console.log("✅ Optimistic update applied for section:", setNumberId);
  },

  // ✅ อัปเดตลำดับคำถามใน database (สำหรับใช้ในพื้นหลัง)
  updateQuestionsOrderInDatabase: async (setNumberId, newOrder) => {
    try {
      console.log("🔄 Updating questions order in database for section:", setNumberId);
      
      // อัปเดต question_number ใหม่ทั้งหมด
      for (let i = 0; i < newOrder.length; i++) {
        const q = newOrder[i];
        await questionService.updateQuestion({
          question_id: q.question_id,
          question_text: q.question_text,
          question_number: i + 1,
          set_number_id: setNumberId,
          question_type: q.question_type,
        } as any);
      }
      
      console.log("✅ Database update completed for section:", setNumberId);
    } catch (error) {
      console.error("❌ Error updating questions order in database:", error);
      throw error;
    }
  },

  // ✅ Debounced version สำหรับกรณีที่ต้องการ debounce
  debouncedUpdateQuestionsOrderInDatabase: debounce(async (setNumberId: number, newOrder: Question[]) => {
    try {
      console.log("🔄 [Debounced] Updating questions order in database for section:", setNumberId);
      
      for (let i = 0; i < newOrder.length; i++) {
        const q = newOrder[i];
        await questionService.updateQuestion({
          question_id: q.question_id,
          question_text: q.question_text,
          question_number: i + 1,
          set_number_id: setNumberId,
          question_type: q.question_type,
        } as any);
      }
      
      console.log("✅ [Debounced] Database update completed for section:", setNumberId);
    } catch (error) {
      console.error("❌ [Debounced] Error updating questions order in database:", error);
      throw error;
    }
  }, 500),

  // ✅ Revert questions order ถ้าเกิด error
  revertQuestionsOrder: (setNumberId, originalOrder) => {
    const { questions } = get();
    const otherQuestions = questions.filter((q) => q.set_number_id !== setNumberId);
    
    set({ questions: [...otherQuestions, ...originalOrder] });
    console.log("🔄 Reverted questions order for section:", setNumberId);
  },
}));
