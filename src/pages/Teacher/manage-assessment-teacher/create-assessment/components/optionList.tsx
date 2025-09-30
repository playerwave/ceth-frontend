import React, { useEffect, useState } from "react";
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

  // ✅ ต้องประกาศ options ก่อน
  const options: Choice[] =
    mode === "edit" ? choices[question.id] || [] : (question.options as Choice[]) || [];

  // ✅ เก็บค่า local ของแต่ละ choice
  const [localTexts, setLocalTexts] = useState<Record<number, string>>({});

  // ✅ sync เมื่อ options เปลี่ยน
  useEffect(() => {
    const initTexts: Record<number, string> = {};
    options.forEach((opt, i) => {
      initTexts[opt.choice_id ?? i] = opt.choice_text ?? "";
    });

    // ✅ setState เฉพาะถ้าค่าเปลี่ยนจริงๆ
    setLocalTexts((prev) => {
      const same =
        Object.keys(initTexts).length === Object.keys(prev).length &&
        Object.keys(initTexts).every((key) => initTexts[Number(key)] === prev[Number(key)]);

      return same ? prev : initTexts;
    });
  }, [options]);


  
  useEffect(() => {
    if (mode === "edit" && question.id) {
      fetchChoicesByQuestion(question.id);
    }
  }, [mode, question.id, fetchChoicesByQuestion]);

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

  const handleLocalChange = (choiceId: number, value: string) => {
    setLocalTexts((prev) => ({ ...prev, [choiceId]: value }));
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
            value={localTexts[opt.choice_id ?? i] ?? ""}
            onChange={(e) => handleLocalChange(opt.choice_id ?? i, e.target.value)}
            onBlur={() => handleUpdateChoice(opt.choice_id, localTexts[opt.choice_id ?? i], i)}
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
