import { create } from "zustand";
import choiceService from "@/service/Teacher/choice.service";

interface Choice {
  choice_id: number;
  choice_text: string;
  choice_number: number;
  question_id?: number; // ถ้า backend ยังไม่ส่งมา อาจต้อง map เองตอน fetch
}

interface ChoiceState {
  choices: Record<number, Choice[]>; // key = question_id
  fetchChoicesByQuestion: (qid: number) => Promise<void>;
  createChoice: (qid: number, text: string) => Promise<void>;
  updateChoice: (choice_id: number, text: string) => Promise<void>;
  deleteChoice: (choice_id: number, qid: number) => Promise<void>;
}

export const useChoiceStore = create<ChoiceState>((set, get) => ({
  choices: {},

  // ✅ ดึง choices ตาม question_id
  fetchChoicesByQuestion: async (qid) => {
    try {
      const res = await choiceService.getChoiceByQuestionID(qid);
      set((state) => ({
        choices: { ...state.choices, [qid]: res },
      }));
    } catch (err: any) {
      if (err.response?.status === 404) {
        // ✅ ถ้าไม่เจอ ให้เก็บเป็น array ว่าง
        set((state) => ({
          choices: { ...state.choices, [qid]: [] },
        }));
      } else {
        console.error("❌ fetchChoicesByQuestion error:", err);
      }
    }
  },


  // ✅ สร้าง choice ใหม่
  createChoice: async (qid, text) => {
    try {
      await choiceService.createChoice({
        question_id: qid,
        choice_text: text,
        choice_number: (get().choices[qid]?.length || 0) + 1,
      });
      await get().fetchChoicesByQuestion(qid);
    } catch (err) {
      console.error("❌ createChoice error:", err);
    }
  },

  // ✅ อัปเดต choice
  updateChoice: async (choice_id, text) => {
    try {
      await choiceService.updateChoice({
        choice_id,
        choice_text: text,
      });

      // หา qid ของ choice นี้แล้ว refresh
      const qid = Object.keys(get().choices).find((id) =>
        get().choices[+id]?.some((c) => c.choice_id === choice_id)
      );
      if (qid) await get().fetchChoicesByQuestion(Number(qid));
    } catch (err) {
      console.error("❌ updateChoice error:", err);
    }
  },

  // ✅ ลบ choice
  deleteChoice: async (choice_id, qid) => {
    try {
      await choiceService.deleteChoice(choice_id);
      await get().fetchChoicesByQuestion(qid);
    } catch (err) {
      console.error("❌ deleteChoice error:", err);
    }
  },
}));
