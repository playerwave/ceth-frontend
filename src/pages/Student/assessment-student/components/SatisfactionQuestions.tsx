import React from "react";
import CustomCard from "../../../../components/Card";

export interface SatisfactionQuestionsProps {
  title?: string;
  questions: string[];
  options: string[];
  answers: { [qIndex: number]: string };
  onChange: (qIndex: number, value: string) => void;
  className?: string;
}

export default function SatisfactionQuestions({
  title = "หัวข้อ: ประเมินผลเนื้อหาการอบรม (ตรงนี้เป็นชื่อหัวเรื่องคำถาม) ตัวอย่างคำถามแบบพึงพอใจ",
  questions,
  options,
  answers,
  onChange,
  className,
}: SatisfactionQuestionsProps) {
  const base =
    "w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start";

  return (
    <CustomCard className={`${base} ${className ?? ""}`}>
      <h2 className="font-bold text-2xl pr-12 leading-snug">{title}</h2>
      <br />
      <div className="w-full overflow-x-auto">
        <table className="w-full text-[16px] table-auto min-w-[600px] border-collapse">
          <thead>
            <tr className="text-left text-[#A0AEC0]">
              <th className="p-2">คำถาม</th>
              {options.map((opt, idx) => (
                <th key={idx} className="p-2 text-center">
                  {opt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, qIndex) => (
              <tr key={qIndex}>
                <td className="p-2">{q}</td>
                {options.map((opt, optIndex) => (
                  <td key={optIndex} className="p-2 text-center">
                    <input
                      type="radio"
                      name={`satis-${qIndex}`}
                      value={opt}
                      checked={answers[qIndex] === opt}
                      onChange={() => onChange(qIndex, opt)}
                      className="w-4 h-4 accent-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomCard>
  );
}
