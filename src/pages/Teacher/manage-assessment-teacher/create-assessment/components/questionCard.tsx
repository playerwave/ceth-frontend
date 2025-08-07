import React from "react";
import { TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  QuestionItem,

} from "../type/type.create";

type Props = {
  question: QuestionItem;
  updateQuestionText: (id: number, text: string) => void;
  updateChoiceText: (id: number, idx: number, text: string) => void;
  addChoice: (id: number) => void;
  removeChoice: (id: number, idx: number) => void;
  removeQuestionSet: (id: number) => void;
};

const QuestionCard: React.FC<Props> = ({
  question: q,
  updateQuestionText,
  updateChoiceText,
  addChoice,
  removeChoice,
  removeQuestionSet,
}) => {
  switch (q.type) {
    case "choice":
    case "checkbox": {
      const inputType = q.type === "choice" ? "radio" : "checkbox";
      return (
        <>
          <div className="flex items-center mb-2">
            <TextField
              placeholder="คำถาม"
              fullWidth
              value={q.question}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
              className="mb-2"
            />
            <IconButton
              type="button"
              color="error"
              onClick={() => removeQuestionSet(q.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
          {q.choices?.map((c, i) => (
            <div key={i} className="flex items-center mt-2 mb-2">
              <input type={inputType} disabled className="mr-2" />
              <TextField
                placeholder={`ตัวเลือก ${i + 1}`}
                className="w-140"
                value={c}
                onChange={(e) => updateChoiceText(q.id, i, e.target.value)}
              />
              <IconButton
                type="button"
                color="error"
                onClick={() => removeChoice(q.id, i)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addChoice(q.id)}
            className="mt-2 mb-2 bg-blue-600 text-white p-1 rounded"
          >
            เพิ่มตัวเลือก
          </button>
        </>
      );
    }

    case "openques":
      return (
        <div className="flex items-center mb-2">
          <TextField
            placeholder="คำถามแบบเขียนตอบ"
            fullWidth
            value={q.question}
            onChange={(e) => updateQuestionText(q.id, e.target.value)}
          />
          <IconButton
            type="button"
            color="error"
            onClick={() => removeQuestionSet(q.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      );

    case "complacent":
      return (
        <div className="flex flex-col mb-2">
          <div className="flex justify-between items-start mb-2">
            <TextField
              placeholder="คำถามความพึงพอใจ"
              fullWidth
              value={q.question}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
            />
            <IconButton
              type="button"
              color="error"
              onClick={() => removeQuestionSet(q.id)}
              className="mt-2"
            >
              <DeleteIcon />
            </IconButton>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {["น้อยที่สุด", "น้อย", "ปานกลาง", "มาก", "มากที่สุด"].map((level, i) => (
              <label key={i} className="flex flex-col items-center text-xs">
                <span className="mb-1">{level}</span>
                <input
                  type="radio"
                  disabled
                  name={`complacent-satisfaction-${q.id}`}
                  value={level}
                  className="scale-125"
                />
              </label>
            ))}
          </div>
        </div>
      );
  }
};

export default QuestionCard;
