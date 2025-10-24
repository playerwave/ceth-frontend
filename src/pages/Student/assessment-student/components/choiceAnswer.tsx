import { Radio, FormControl, FormControlLabel, RadioGroup } from "@mui/material";

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
  return (
    <div className={className ?? ""}>
      {title && <h2 className="font-bold text-2xl pr-12 leading-snug mb-4">{title}</h2>}
      
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.question_id} className="space-y-3">
            {/* คำถาม */}
            <div className="text-gray-700 text-lg font-medium">
              {question.question_text}
            </div>
            
            {/* ตัวเลือก - อยู่ใต้คำถามและชิดซ้าย */}
            <div className="ml-0">
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[question.question_id] || ""}
                  onChange={(e) => onChange(question.question_id, e.target.value)}
                >
                  {(question.options || []).map((option, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: '#374151', // text-gray-700
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
