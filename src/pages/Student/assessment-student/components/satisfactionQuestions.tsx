
interface AssessmentQuestion {
  question_id: number;
  question_text: string;
  question_type: "satisfaction" | "multiple_choice" | "single_choice" | "open_ended";
  options?: string[];
  required: boolean;
  section_id?: number;
  section_name?: string;
  question_number?: number;
}

export interface SatisfactionQuestionsProps {
  title?: string;
  questions: AssessmentQuestion[];
  options?: string[];
  answers: { [questionId: number]: string };
  onChange: (questionId: number, value: string) => void;
  className?: string;
}

export default function SatisfactionQuestions({
  title = "หัวข้อ: ประเมินผลเนื้อหาการอบรม",
  questions = [],
  options = ["มากที่สุด", "มาก", "ปานกลาง", "น้อย", "น้อยที่สุด"],
  answers,
  onChange,
  className,
}: SatisfactionQuestionsProps) {

  // Debug logs
  console.log("🔍 [SatisfactionQuestions] Props:", { title, questions, options, answers });
  console.log("🔍 [SatisfactionQuestions] Questions length:", questions.length);

  return (
    <div className={className ?? ""}>
      <h2 className="font-bold text-2xl pr-12 leading-snug">{title}</h2>
      <br />
      <div className="w-full overflow-x-auto">
        <table className="w-full text-[16px] table-fixed min-w-[800px] border-collapse">
          <thead>
            <tr className="text-left text-[#A0AEC0]">
              <th className="p-2 w-[60%]">คำถาม</th>
              {options.map((opt, idx) => (
                <th key={idx} className="p-2 text-center w-[8%]">
                  {opt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.question_id}>
                <td className="p-2 w-[60%] align-top">
                  {/* แสดงหมายเลขคำถามตาม question_number หรือ index */}
                  {question.question_number ? (
                    `${question.question_number}. ${question.question_text}`
                  ) : (
                    `${index + 1}. ${question.question_text}`
                  )}
                </td>
                {options.map((opt, optIndex) => (
                  <td key={optIndex} className="p-2 text-center w-[8%]">
                    <input
                      type="radio"
                      name={`satis-${question.question_id}`}
                      value={opt}
                      checked={answers[question.question_id] === opt}
                      onChange={() => onChange(question.question_id, opt)}
                      className="w-4 h-4 accent-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
