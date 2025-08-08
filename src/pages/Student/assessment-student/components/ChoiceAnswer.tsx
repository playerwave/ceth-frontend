import React from "react";
import CustomCard from "../../../../components/Card";

export interface ChoiceAnswerProps {
  title?: string;
  questions: string[];
  options: string[];
  answers: { [qIndex: number]: string };
  onChange: (qIndex: number, value: string) => void;
  className?: string;
}

export default function ChoiceAnswer({
  title = "ตัวอย่างคำถามตอบแบบข้อความ",
  questions,
  options,
  answers,
  onChange,
  className,
}: ChoiceAnswerProps) {
  const base =
    "w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start";

  return (
    <CustomCard className={`${base} ${className ?? ""}`}>
      <h2 className="font-bold text-2xl pr-12 leading-snug">{title}</h2>
      <br />
      <div className="w-full overflow-x-auto">
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="text-[16px] mb-2">{q}</p>
              <div className="flex flex-col gap-2">
                {options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`choice-${qIndex}`}
                      value={option}
                      checked={answers[qIndex] === option}
                      onChange={() => onChange(qIndex, option)}
                      className="accent-purple-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomCard>
  );
}
