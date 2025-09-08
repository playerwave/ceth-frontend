import { create } from "zustand";
import questionService from "../../service/Teacher/question.service";
import { Question } from "../../types/model";
import { mapApiToQuestion, mapApiToQuestions } from "../mapper/question.mapper";

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;

  fetchQuestions: () => Promise<void>;
  fetchQuestionsBySetNumber: (setNumberId: number) => Promise<void>;
  createQuestion: (data: Omit<Question, "question_id">) => Promise<Question | null>;
  updateQuestion: (data: Question) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
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
      const other = get().questions.filter((q) => q.set_number_id !== setNumberId);

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

  // ✅ สร้างคำถามใหม่
  // createQuestion: async (data) => {
  //   try {
  //     const apiData = await questionService.createQuestion(data);

  //     const newQ = mapApiToQuestion(apiData, data.set_number_id);
  //     set({ questions: [...get().questions, newQ] });

  //     return newQ;
  //   } catch (err) {
  //     console.error("❌ createQuestion error:", err);
  //     return null;
  //   }
  // },
  // ✅ แก้ไขการสร้างคำถามใหม่
  // createQuestion: async (data) => {
  //   try {
  //     console.log("📝 Creating question with data:", data);
  //     const apiData = await questionService.createQuestion(data);

  //     console.log("📨 API Response:", apiData);

  //     // ✅ ตรวจสอบ response ก่อน
  //     if (!apiData || !apiData.question_id) {
  //       console.error("❌ API response missing question_id:", apiData);

  //       // ✅ ถ้า API ไม่ส่ง question_id กลับมา ให้ refresh แทน
  //       await get().fetchQuestionsBySetNumber(data.set_number_id);
  //       return null;
  //     }

  //     const newQ = mapApiToQuestion(apiData, data.set_number_id);
  //     console.log("✅ Mapped new question:", newQ);

  //     // ✅ เพิ่มคำถามใหม่เข้าไปใน state
  //     set({ questions: [...get().questions, newQ] });

  //     return newQ;
  //   } catch (err) {
  //     console.error("❌ createQuestion error:", err);

  //     // ✅ ถ้าเกิด error ให้ refresh เพื่อให้แน่ใจว่าข้อมูลถูกต้อง
  //     try {
  //       await get().fetchQuestionsBySetNumber(data.set_number_id);
  //     } catch (fetchErr) {
  //       console.error("❌ Failed to refresh questions:", fetchErr);
  //     }

  //     return null;
  //   }
  // },

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
      const apiData = await questionService.createQuestion(data);

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
      await questionService.updateQuestion(data);
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
}));
