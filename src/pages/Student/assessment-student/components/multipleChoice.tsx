import CustomCard from "../../../../components/Card";

interface AssessmentQuestion {
  question_id: number;
  question_text: string;
  question_type: "satisfaction" | "multiple_choice" | "single_choice" | "open_ended";
  options?: string[];
  required: boolean;
}

export interface MultipleChoiceProps {
  title?: string;
  questions: AssessmentQuestion[];
  answers: { [questionId: number]: string[] };
  onToggle: (questionId: number, option: string) => void;
  className?: string;
}

export default function MultipleChoice({
  title = "คำถามแบบหลายตัวเลือก (Checkbox)",
  questions = [],
  answers,
  onToggle,
  className,
}: MultipleChoiceProps) {
  const base =
    "w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start";

  return (
    <CustomCard className={`${base} ${className ?? ""}`}>
      <h2 className="font-bold text-2xl pr-12 leading-snug">{title}</h2>
      <br />
      <div className="w-full overflow-x-auto">
        <table className="w-full text-[16px] table-fixed min-w-[600px] border-collapse">
          <thead>
            <tr className="text-left text-[#A0AEC0]">
              <th className="p-2 w-[50%]">คำถาม</th>
              <th className="p-2 text-center w-[50%]">ตัวเลือก</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.question_id}>
                <td className="p-2 w-[50%] align-top">
                  {question.question_text}
                </td>
                <td className="p-2 w-[50%]">
                  <div className="flex flex-col gap-2">
                    {(question.options || []).map((opt, optIndex) => {
                      const checked = answers[question.question_id]?.includes(opt) || false;
                      return (
                        <label key={optIndex} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={opt}
                            checked={checked}
                            onChange={() => onToggle(question.question_id, opt)}
                            className="accent-green-600 w-4 h-4"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomCard>
  );
}
