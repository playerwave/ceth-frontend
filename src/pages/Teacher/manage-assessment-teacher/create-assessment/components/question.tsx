import React, { useState, useEffect } from "react";
import { Trash2, Copy, GripVertical } from "lucide-react";
import { TextField, Select, MenuItem, FormControl } from "@mui/material";
import QuestionRenderer from "./questionRenderer";
import { Question as QuestionType } from "../type/type.create";
import { useQuestionStore } from "../../../../../stores/Teacher/questionStore";
import { useAssessmentStoreUi } from "../store/assessmentStore";
import { QuestionType as BackendQuestionType } from "../../../../../types/model";
import { createQuestionWithChoices } from "../../../../../service/Teacher/question.service";
import { useChoiceStore } from "../../../../../stores/Teacher/choiceStore";

interface QuestionProps {
  sectionId: number;
  question: QuestionType;
  index: number;
  mode: "create" | "edit";
  onMoveUp: () => void;
  onMoveDown: () => void;
  dragHandleProps?: any;
}

const mapFrontendToBackend = (frontendType: string): BackendQuestionType => {
  switch (frontendType) {
    case "choice":
      return BackendQuestionType.SINGLE;
    case "checkbox":
      return BackendQuestionType.MULTIPLE;
    case "text":
      return BackendQuestionType.TEXT;
    case "rating":
      return BackendQuestionType.FIX_SINGLE;
    default:
      return BackendQuestionType.SINGLE;
  }
};

const Question: React.FC<QuestionProps> = ({
  sectionId,
  question,
  index,
  mode,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}) => {
  const { updateQuestion, deleteQuestion, fetchQuestionsBySetNumber  } = useQuestionStore();
  const { updateQuestionInSection, deleteQuestionFromSection, addQuestionToSection } = useAssessmentStoreUi();
  
  // ✅ เพิ่ม local state สำหรับ input field
  const [localQuestionText, setLocalQuestionText] = useState(question.question);
  
  // ✅ เพิ่ม state สำหรับติดตามสถานะการใช้งาน
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // ✅ sync local state เมื่อ question.question เปลี่ยน
  useEffect(() => {
    setLocalQuestionText(question.question);
  }, [question.question]);

  const handleUpdate = async (field: keyof QuestionType, value: any) => {
    if (mode === "create") {
      updateQuestionInSection(sectionId, question.id, { [field]: value });
    } else {
      await updateQuestion({
        question_id: question.id,
        question_text: field === "question" ? value : question.question,
        question_number: index + 1,
        set_number_id: sectionId,
        question_type: field === "type" ? mapFrontendToBackend(value) : mapFrontendToBackend(question.type),
      } as any);
    }
  };

  const handleDelete = async () => {
    if (mode === "create") {
      deleteQuestionFromSection(sectionId, question.id);
    } else {
      await deleteQuestion(question.id);
    }
  };
  const { choices } = useChoiceStore();

  const handleDuplicate = async () => {
    if (mode === "create") {
      addQuestionToSection(sectionId, {
        ...question,
        id: Date.now(),
        question: question.question + " (Copy)",
      });
    } else {
      // 🟢 ดึง choices ของ question ปัจจุบันจาก store
      const qChoices = choices[question.id] || [];

      await createQuestionWithChoices({
        question_text: question.question + " (Copy)",
        set_number_id: sectionId,
        question_type: mapFrontendToBackend(question.type),
        question_number: index + 1, // ✅ เพิ่มตรงนี้
        options: qChoices.map((c) => ({
          choice_text: c.choice_text,
        })),
      });
      await fetchQuestionsBySetNumber(sectionId);
    
  }
};

return (
  <div 
    className={`border-l-4 pl-4 mb-6 bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-lg ${
      (isActive || isDragging || isHovered) ? 'border-blue-500' : 'border-gray-300'
    } ${isDragging ? 'rotate-2 shadow-2xl scale-105' : ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="flex gap-2 items-start mb-2">
      <div className="flex flex-col items-center">
        <div 
          className="hidden lg:block cursor-grab p-1 text-gray-400" 
          {...dragHandleProps}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <GripVertical size={20} />
        </div>
        <div className="lg:hidden flex flex-col">
          <button onClick={onMoveUp}>↑</button>
          <button onClick={onMoveDown}>↓</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <TextField
          name="questionText"
          value={localQuestionText}
          onChange={(e) => setLocalQuestionText(e.target.value)}   // 🔹 UI เปลี่ยนทันที
          onFocus={() => setIsActive(true)}                        // 🔹 ตั้งค่า active เมื่อ focus
          onBlur={async () => {                                    // 🔹 ยิง API แค่ตอนหลุดโฟกัส
            setIsActive(false);                                    // 🔹 ตั้งค่า inactive เมื่อ blur
            if (localQuestionText !== question.question) {
              await handleUpdate("question", localQuestionText);
            }
          }}
          placeholder="พิมพ์คำถาม..."
          className="flex-1"
          sx={{ 
            height: "56px",
            "& .MuiOutlinedInput-root": {
              fontSize: "1rem", // text-base equivalent
              fontWeight: "normal"
            }
          }}
        />
        <FormControl className="w-full sm:w-48" sx={{ height: "56px" }}>
          <Select
            value={question.type}
            onChange={(e) => handleUpdate("type", e.target.value)}
            onFocus={() => setIsActive(true)}                        // 🔹 ตั้งค่า active เมื่อ focus
            onBlur={() => setIsActive(false)}                        // 🔹 ตั้งค่า inactive เมื่อ blur
            sx={{
              height: "56px",
              "& .MuiOutlinedInput-root": {
                fontSize: "1rem"
              }
            }}
          >
            <MenuItem value="choice">ตัวเลือกเดียว</MenuItem>
            <MenuItem value="checkbox">หลายตัวเลือก</MenuItem>
            <MenuItem value="text">ถามตอบ</MenuItem>
            <MenuItem value="rating">ความพึงพอใจ</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>

    <QuestionRenderer sectionId={sectionId} question={question} mode={mode} />

    <div className="flex justify-end gap-2 mt-4">
      <button onClick={handleDuplicate} className="text-gray-400 hover:text-blue-500">
        <Copy size={18} />
      </button>
      <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);
};

export default Question;