import React, { useEffect } from "react";
import { Question, LocalChoice } from "../type/type.create"; // 👈 import LocalChoice ด้วย
import { useChoiceStore } from "../../../../../stores/Teacher/choiceStore";
import { Choice } from "../../../../../types/model"; // 👈 backend type

interface OptionListProps {
  sectionId: number;
  question: Question;
  mode: "create" | "edit";
}

const OptionList: React.FC<OptionListProps> = ({  question, mode }) => {
  const { choices, fetchChoicesByQuestion, createChoice, updateChoice, deleteChoice } = useChoiceStore();

  // โหลด choices จาก backend เฉพาะ edit เท่านั้น
  useEffect(() => {
    if (question.id && mode === "edit") {
      fetchChoicesByQuestion(question.id);
    }
  }, [question.id, fetchChoicesByQuestion, mode]);

  // ✅ ใช้ Union Type (Choice | LocalChoice)
  const options: (Choice | LocalChoice)[] =
    mode === "edit" ? choices[question.id] || [] : (question.options as LocalChoice[]) || [];

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={opt.choice_id ?? i} className="flex items-center gap-2">
          {question.type === "choice"
            ? <input type="radio" disabled className="w-4 h-4 text-blue-500" />
            : <input type="checkbox" disabled className="w-4 h-4 text-blue-500" />
          }

          <input
            type="text"
            value={opt.choice_text}
            onChange={(e) =>
              mode === "edit"
                ? updateChoice((opt as Choice).choice_id, e.target.value) // 👈 แปลงเป็น Choice เวลา edit
                : console.log("update local choice", e.target.value)
            }
            className="flex-1 p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
          />

          {options.length > 1 && (
            <button
              onClick={() =>
                mode === "edit"
                  ? deleteChoice((opt as Choice).choice_id, question.id)
                  : console.log("delete local choice")
              }
              className="text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className="mt-6">
        <button
          onClick={() =>
            mode === "edit"
              ? createChoice(question.id, `ตัวเลือก ${options.length + 1}`)
              : console.log("add local choice")
          }
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          + เพิ่มตัวเลือก
        </button>
      </div>
    </div>
  );
};

export default OptionList;
