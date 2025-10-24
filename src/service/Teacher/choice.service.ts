import axiosInstance from "@/libs/axios";

const choiceService = {
  // ดึงทั้งหมด
  getChoices: async () => {
    const res = await axiosInstance.get("/teacher/choice/get-choices");
    return res.data;
  },

  // ดึงตาม question_id
  getChoiceByQuestionID: async (questionId: number) => {
    const res = await axiosInstance.get(`/teacher/choice/get-choices-by-question/${questionId}`);
    return res.data;
  },

  // ✅ สร้าง choice ใหม่ → /add
  createChoice: async (data: {
    question_id: number;
    choice_text: string;
    choice_number: number;
  }) => {
    const res = await axiosInstance.post("/teacher/choice/add", data);
    return res.data;
  },

  // ✅ อัปเดต choice → /edit/:id
  updateChoice: async (data: {
    choice_id: number;
    choice_text: string;
  }) => {
    const res = await axiosInstance.put(`/teacher/choice/edit/${data.choice_id}`, data);
    return res.data;
  },

  // ✅ ลบ choice → /delete/:id
  deleteChoice: async (choiceId: number) => {
    const res = await axiosInstance.delete(`/teacher/choice/delete/${choiceId}`);
    return res.data;
  },
};

export default choiceService;
