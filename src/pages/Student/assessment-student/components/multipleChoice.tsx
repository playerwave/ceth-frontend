import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

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
              <FormGroup>
                {(question.options || []).map((opt, optIndex) => {
                  const checked = answers[question.question_id]?.includes(opt) || false;
                  return (
                    <FormControlLabel
                      key={optIndex}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={() => onToggle(question.question_id, opt)}
                          value={opt}
                        />
                      }
                      label={opt}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: '#374151', // text-gray-700
                        },
                      }}
                    />
                  );
                })}
              </FormGroup>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
