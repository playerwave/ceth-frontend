import React from "react";
import CustomCard from "../../../../components/Card";

export interface OpenEndedQuestionProps {
  title?: string;
  questions: string[];
  answers: { [qIndex: number]: string };
  onChange: (qIndex: number, value: string) => void;
  className?: string;
}

export default function OpenEndedQuestion({
  title = "ตัวอย่างคำถามปลายเปิด",
  questions,
  answers,
  onChange,
  className,
}: OpenEndedQuestionProps) {
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
              <br />
              <textarea
                className={`w-full border-b border-gray-300 focus:outline-none focus:border-[#1E3A8A] ${
                  answers[qIndex] ? "text-black" : "text-gray-400"
                } placeholder-gray-400 resize-none pb-1`}
                rows={1}
                placeholder="พิมพ์คำตอบของคุณที่นี่..."
                value={answers[qIndex] || ""}
                onChange={(e) => onChange(qIndex, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </CustomCard>
  );
}
