import React from "react";
import { Trash2, Copy, GripVertical } from "lucide-react";
import QuestionRenderer from "./QuestionRenderer";
import { Question as QuestionType } from "../type/type.create";
import { useQuestionStore } from "../../../../../stores/Teacher/questionStore";
import { useAssessmentStoreUi } from "../store/assessmentStore";
import { QuestionType as BackendQuestionType } from "../../../../../types/model";

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
    case "choice": return BackendQuestionType.SINGLE;
    case "checkbox": return BackendQuestionType.MULTIPLE;
    case "text": return BackendQuestionType.TEXT;
    case "rating": return BackendQuestionType.FIX_SINGLE;
    default: return BackendQuestionType.SINGLE;
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
  const { updateQuestion, deleteQuestion, createQuestion } = useQuestionStore();
  const { updateQuestionInSection, deleteQuestionFromSection, addQuestionToSection } = useAssessmentStoreUi();

  const handleUpdate = async (field: keyof QuestionType, value: any) => {
    if (mode === "create") {
      updateQuestionInSection(sectionId, question.id, {
        [field]: value,
      });
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

  const handleDuplicate = async () => {
    if (mode === "create") {
      addQuestionToSection(sectionId, {
        ...question,
        id: Date.now(),
        question: question.question + " (Copy)",
      });
    } else {
      await createQuestion({
        question_text: question.question + " (Copy)",
        question_number: index + 1,
        set_number_id: sectionId,
        question_type: mapFrontendToBackend(question.type),
      } as any);
    }
  };

  return (
    <div className="border-l-4 border-blue-500 pl-4 mb-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-2 items-start mb-2">
        <div className="flex flex-col items-center">
          <div className="hidden lg:block cursor-grab p-1 text-gray-400" {...dragHandleProps}>
            <GripVertical size={20} />
          </div>
          <div className="lg:hidden flex flex-col">
            <button onClick={onMoveUp}>↑</button>
            <button onClick={onMoveDown}>↓</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={question.question}
            onChange={(e) => handleUpdate("question", e.target.value)}
            className="flex-1 text-base sm:text-lg border border-gray-300 rounded-lg px-2 py-1"
            placeholder="พิมพ์คำถาม..."
          />
          <select
            value={question.type}
            onChange={(e) => handleUpdate("type", e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg"
          >
            <option value="choice">ตัวเลือกเดียว</option>
            <option value="checkbox">หลายตัวเลือก</option>
            <option value="text">ถามตอบ</option>
            <option value="rating">ความพึงพอใจ</option>
          </select>
        </div>
      </div>

      <QuestionRenderer mode={mode} sectionId={sectionId} question={question} />

      {mode === "edit" && (
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handleDuplicate} className="text-gray-400 hover:text-blue-500">
            <Copy size={18} />
          </button>
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Question;
