import CustomCard from "../../../../components/Card";

interface AssessmentQuestion {
  question_id: number;
  question_text: string;
  question_type: "satisfaction" | "multiple_choice" | "single_choice" | "open_ended";
  options?: string[];
  required: boolean;
}

export interface OpenEndedQuestionProps {
  title?: string;
  questions: AssessmentQuestion[];
  answers: { [questionId: number]: string };
  onChange: (questionId: number, value: string) => void;
  className?: string;
}

export default function OpenEndedQuestion({
  title = "คำถามปลายเปิด",
  questions = [],
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
        <table className="w-full text-[16px] table-fixed min-w-[600px] border-collapse">
          <thead>
            <tr className="text-left text-[#A0AEC0]">
              <th className="p-2 w-[50%]">คำถาม</th>
              <th className="p-2 text-center w-[50%]">คำตอบ</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.question_id}>
                <td className="p-2 w-[50%] align-top">
                  {question.question_text}
                </td>
                <td className="p-2 w-[50%]">
                  <textarea
                    className={`w-full border-b border-gray-300 focus:outline-none focus:border-[#1E3A8A] ${
                      answers[question.question_id] ? "text-black" : "text-gray-400"
                    } placeholder-gray-400 resize-none pb-1`}
                    rows={3}
                    placeholder="พิมพ์คำตอบของคุณที่นี่..."
                    value={answers[question.question_id] || ""}
                    onChange={(e) => onChange(question.question_id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomCard>
  );
}
