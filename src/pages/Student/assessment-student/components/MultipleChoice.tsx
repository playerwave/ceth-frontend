import React from "react";
import CustomCard from "../../../../components/Card";

export interface MultipleChoiceProps {
  title?: string;
  questions: string[];
  options: string[];
  answers: { [qIndex: number]: string[] };
  onToggle: (qIndex: number, option: string) => void;
  className?: string;
}

export default function MultipleChoice({
  title = "ตัวอย่างคำถามแบบหลายตัวเลือก (Checkbox)",
  questions,
  options,
  answers,
  onToggle,
  className,
}: MultipleChoiceProps) {
  const base =
    "w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start";

  return (
    <CustomCard className={`${base} ${className ?? ""}`}>
      <h2 className="font-bold text-2xl pr-12 leading-snug">{title}</h2>
      <div className="space-y-6 mt-4">
        {questions.map((q, qIndex) => (
          <div key={qIndex}>
            <p className="mb-2 text-[16px] text-gray-800">{q}</p>
            <div className="flex flex-col gap-2">
              {options.map((opt, optIndex) => {
                const checked = answers[qIndex]?.includes(opt) || false;
                return (
                  <label key={optIndex} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={checked}
                      onChange={() => onToggle(qIndex, opt)}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </CustomCard>
  );
}
