import CustomCard from "../../../../components/Card";

interface AssessmentQuestion {
  question_id: number;
  question_text: string;
  question_type: "satisfaction" | "multiple_choice" | "single_choice" | "open_ended";
  options?: string[];
  required: boolean;
}

export interface ChoiceAnswerProps {
  title?: string;
  questions: AssessmentQuestion[];
  answers: { [questionId: number]: string };
  onChange: (questionId: number, value: string) => void;
  className?: string;
}

export default function ChoiceAnswer({
  title = "คำถามแบบตัวเลือกเดียว",
  questions = [],
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
          {questions.map((question) => (
            <div key={question.question_id}>
              <p className="text-[16px] mb-2">{question.question_text}</p>
              <div className="flex flex-col gap-2">
                {(question.options || []).map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`choice-${question.question_id}`}
                      value={option}
                      checked={answers[question.question_id] === option}
                      onChange={() => onChange(question.question_id, option)}
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
