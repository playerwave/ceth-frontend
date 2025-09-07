import React, { useEffect } from "react";
import { Question } from "../type/type.create";
import { useChoiceStore } from "../../../../../stores/Teacher/choiceStore";
import { useAssessmentStoreUi } from "../store/assessmentStore";
import { Choice } from "../../../../../types/model";

interface OptionListProps {
  sectionId: number;
  question: Question;
  mode: "create" | "edit";
}

const OptionList: React.FC<OptionListProps> = ({ sectionId, question, mode }) => {
  const { choices, fetchChoicesByQuestion, createChoice, updateChoice, deleteChoice } = useChoiceStore();
  const { updateQuestionInSection } = useAssessmentStoreUi();

  useEffect(() => {
    if (mode === "edit" && question.id) {
      fetchChoicesByQuestion(question.id);
    }
  }, [mode, question.id, fetchChoicesByQuestion]);

  const options: Choice[] =
    mode === "edit" ? choices[question.id] || [] : (question.options as Choice[]) || [];

  const handleUpdateChoice = (choiceId: number | undefined, newText: string, index: number) => {
    if (mode === "edit") {
      if (choiceId) updateChoice(choiceId, newText);
    } else {
      const newOptions = options.map((opt, i) =>
        i === index ? { ...opt, choice_text: newText } : opt
      );
      updateQuestionInSection(sectionId, question.id, { options: newOptions });
    }
  };

  const handleAddChoice = () => {
    if (mode === "edit") {
      createChoice(question.id, `ตัวเลือก ${options.length + 1}`);
    } else {
      const newOptions = [
        ...options,
        { choice_id: Date.now(), choice_text: `ตัวเลือก ${options.length + 1}`, question_id: question.id },
      ];
      updateQuestionInSection(sectionId, question.id, { options: newOptions });
    }
  };

  const handleDeleteChoice = (choiceId: number | undefined, index: number) => {
    if (mode === "edit") {
      if (choiceId) deleteChoice(choiceId, question.id);
    } else {
      const newOptions = options.filter((_, i) => i !== index);
      updateQuestionInSection(sectionId, question.id, { options: newOptions });
    }
  };

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={opt.choice_id ?? i} className="flex items-center gap-2">
          {question.type === "choice" ? (
            <input type="radio" disabled className="w-4 h-4 text-blue-500" />
          ) : (
            <input type="checkbox" disabled className="w-4 h-4 text-blue-500" />
          )}

          <input
            type="text"
            value={opt.choice_text ?? ""}   // 👈 fallback
            onChange={(e) => handleUpdateChoice(opt.choice_id, e.target.value, i)}
            className="flex-1 p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
          />


          {options.length > 1 && (
            <button
              onClick={() => handleDeleteChoice(opt.choice_id, i)}
              className="text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className="mt-6">
        <button onClick={handleAddChoice} className="text-blue-600 hover:text-blue-700 text-sm">
          + เพิ่มตัวเลือก
        </button>
      </div>
    </div>
  );
};

export default OptionList;
