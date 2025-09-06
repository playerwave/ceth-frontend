import React from "react";
import { Trash2, Copy, GripVertical } from "lucide-react";
import QuestionRenderer from "./QuestionRenderer";
import { Question as QuestionType } from "../type/type.create";
import { useAssessmentStoreUi } from "../store/assessmentStore";

interface QuestionProps {
  sectionId: number;
  question: QuestionType;
  index: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isDragging?: boolean;
  dragHandleProps?: any; // ✅ เพิ่ม dragHandleProps
}

const Question: React.FC<QuestionProps> = ({
  sectionId,
  question,
  onMoveUp,
  onMoveDown,
  isDragging = false,
  dragHandleProps,
}) => {
  const { sections, setSections } = useAssessmentStoreUi();

  const updateQuestion = (field: keyof QuestionType, value: any) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === question.id ? { ...q, [field]: value } : q
              ),
            }
          : s
      )
    );
  };

  const deleteQuestion = () => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== question.id) }
          : s
      )
    );
  };

  const duplicateQuestion = () => {
    const maxId =
      Math.max(
        ...(sections.find((s) => s.id === sectionId)?.questions.map((q) => q.id) || [0])
      ) || 0;

    const duplicated: QuestionType = {
      ...question,
      id: maxId + 1,
      question: question.question + " (Copy)",
    };

    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, duplicated] }
          : s
      )
    );
  };

  return (
    <div
      className={`border-l-4 border-blue-500 pl-4 mb-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 ${
        isDragging ? "opacity-50 rotate-1 scale-105" : ""
      }`}
    >
      <div className="flex gap-2 items-start mb-2">
        <div className="flex flex-col items-center">
          {/* ✅ Desktop: ใช้ dragHandleProps */}
          <div
            className="hidden lg:block cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 transition-colors"
            {...dragHandleProps}
          >
            <GripVertical size={20} />
          </div>
          {/* ✅ Mobile: ปุ่ม ↑ ↓ */}
          <div className="lg:hidden flex flex-col">
            <button
              onClick={onMoveUp}
              className="text-gray-400 hover:text-blue-500 p-1"
            >
              ↑
            </button>
            <button
              onClick={onMoveDown}
              className="text-gray-400 hover:text-blue-500 p-1"
            >
              ↓
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={question.question}
            onChange={(e) => updateQuestion("question", e.target.value)}
            className="flex-1 text-base sm:text-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1"
            placeholder="พิมพ์คำถาม..."
          />
          <select
            value={question.type}
            onChange={(e) => updateQuestion("type", e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg"
          >
            <option value="choice">ตัวเลือกเดียว</option>
            <option value="checkbox">หลายตัวเลือก</option>
            <option value="text">ถามตอบ</option>
            <option value="rating">ความพึงพอใจ</option>
          </select>
        </div>
      </div>

      <QuestionRenderer sectionId={sectionId} question={question} />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={duplicateQuestion}
          className="text-gray-400 hover:text-blue-500"
        >
          <Copy size={18} />
        </button>
        <button
          onClick={deleteQuestion}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Question;
