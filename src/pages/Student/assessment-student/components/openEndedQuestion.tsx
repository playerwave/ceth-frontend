import { TextField } from "@mui/material";

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
    <div className={className ?? ""}>
      {title && <h2 className="font-bold text-2xl pr-12 leading-snug mb-4">{title}</h2>}
      
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.question_id} className="space-y-3">
            {/* คำถาม */}
            <div className="text-gray-700 text-lg font-medium">
              {question.question_text}
            </div>
            
            {/* TextField - อยู่ใต้คำถามและชิดซ้าย */}
            <div className="ml-0">
              <TextField
                id={`open-ended-${question.question_id}`}
                label="คำตอบ"
                variant="standard"
                multiline
                rows={2}
                placeholder="พิมพ์คำตอบของคุณที่นี่..."
                value={answers[question.question_id] || ""}
                onChange={(e) => onChange(question.question_id, e.target.value)}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#6B7280', // text-gray-500
                    '&.Mui-focused': {
                      color: '#1E3A8A', // text-blue-800
                    },
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#D1D5DB', // border-gray-300
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#1E3A8A', // border-blue-800
                  },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: '#9CA3AF', // border-gray-400
                  },
                  '& .MuiInputBase-input': {
                    lineHeight: '1', // ลด line height
                  },
                  '& .MuiInputBase-root': {
                    paddingBottom: '2px', // ลด padding ของ container
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
