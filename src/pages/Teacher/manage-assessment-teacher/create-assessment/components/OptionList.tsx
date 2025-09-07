import React, { useEffect } from "react";
import { Question } from "../type/type.create";
import { useChoiceStore } from "../../../../../stores/Teacher/choiceStore";

interface OptionListProps {
  sectionId: number;
  question: Question;
}

const OptionList: React.FC<OptionListProps> = ({ sectionId, question }) => {
  const { choices, fetchChoicesByQuestion, createChoice, updateChoice, deleteChoice } = useChoiceStore();

  // โหลด choices ของคำถามนี้จาก backend
  useEffect(() => {
    if (question.id) {
      fetchChoicesByQuestion(question.id);
    }
  }, [question.id, fetchChoicesByQuestion]);

  const options = choices[question.id] || [];

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <div key={opt.choice_id} className="flex items-center gap-2">
          {question.type === "choice" ? (
            <input type="radio" disabled className="w-4 h-4 text-blue-500" />
          ) : (
            <input type="checkbox" disabled className="w-4 h-4 text-blue-500" />
          )}

          <input
            type="text"
            value={opt.choice_text}
            onChange={(e) => updateChoice(opt.choice_id, e.target.value)}
            className="flex-1 p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
          />

          {options.length > 1 && (
            <button
              onClick={() => deleteChoice(opt.choice_id, question.id)}
              className="text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className="mt-6">
        <button
          onClick={() => createChoice(question.id, `ตัวเลือก ${options.length + 1}`)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          + เพิ่มตัวเลือก
        </button>
      </div>
    </div>
  );
};

export default OptionList;
