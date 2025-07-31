import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useCallback, useEffect, useState } from 'react';

type ChoiceData = {
  type: "choice";
  topic: string;
  questions: {
    id: number;
    question: string; // เปลี่ยนจาก text เป็น question
    choices: string[];
    // other?: string; // ถ้ามี
  }[];
};

type Props = {
  onDelete: () => void;
  onDuplicate: () => void;
  onChange: (data: ChoiceData) => void;
};

const Checkbox = ({ onDelete, onDuplicate, onChange }: Props) => {
  const [questionSets, setQuestionSets] = useState([{ id: 1, question: '', choices: [''] }]);
  const [nextId, setNextId] = useState(2);
  const [topicTitle, setTopicTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [otherText, setOtherText] = useState('');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleDeleteAll = () => {
    setQuestionSets([{ id: 1, question: '', choices: [''] }]);
    setNextId(2);
    onDelete();
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicate();
    handleClose();
  };

  const addQuestionSet = () => {
    setQuestionSets([...questionSets, { id: nextId, question: '', choices: [''] }]);
    setNextId(nextId + 1);
  };

  const addChoice = (id: number) => {
    setQuestionSets(questionSets.map(q =>
      q.id === id ? { ...q, choices: [...q.choices, ''] } : q
    ));
  };

  const updateQuestionText = (questionId: number, newText: string) => {
    setQuestionSets(prev =>
      prev.map(q => q.id === questionId ? { ...q, question: newText } : q)
    );
  };

  const updateChoiceText = (questionId: number, choiceIndex: number, newText: string) => {
    setQuestionSets(questionSets.map(q => {
      if (q.id === questionId) {
        const updatedChoices = [...q.choices];
        updatedChoices[choiceIndex] = newText;
        return { ...q, choices: updatedChoices };
      }
      return q;
    }));
  };

  const removeQuestionSet = (id: number) => {
    const updated = questionSets.filter(q => q.id !== id);
    setQuestionSets(updated.length > 0 ? updated : [{ id: 1, question: '', choices: [''] }]);
  };

  const removeChoice = (questionId: number, choiceIndex: number) => {
    setQuestionSets(questionSets.map(q => {
      if (q.id === questionId) {
        const updatedChoices = q.choices.filter((_, idx) => idx !== choiceIndex);
        return { ...q, choices: updatedChoices.length ? updatedChoices : [''] };
      }
      return q;
    }));
  };
 const stableOnChange = useCallback(onChange, []);
  useEffect(() => {
    const payload: ChoiceData = {
      type: "choice",
      topic: topicTitle,
      questions: questionSets.map(q => ({
        id: q.id,
        question: q.question, // เปลี่ยนตรงนี้
        choices: q.choices,
        // other: q.other, // ถ้ามี
      })),
    };
     stableOnChange(payload);
  }, [questionSets, topicTitle, ]);

  return (
    <div className="border border-gray-400 w-180 rounded-md p-4 bg-white">
      <div className="flex items-center justify-between mb-3 ml-3 mr-3">
        <TextField
          name="activity_name"
          placeholder="หัวเรื่องแบบประเมิน"
          className="w-140"
          value={topicTitle}
          onChange={(e) => setTopicTitle(e.target.value)}
        />
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleDuplicate}>ทำซ้ำคำถาม</MenuItem>
          <MenuItem onClick={handleDeleteAll}>ลบทั้งหมด</MenuItem>
        </Menu>
      </div>

      {questionSets.map((q, idx) => (
        <div key={q.id} className="mb-4 p-3">
          <div className="flex items-center mb-2">
            <TextField
              placeholder="คำถาม"
              fullWidth
              value={q.question}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
              className="mb-4"
            />
            <IconButton color="error" className="ml-2" onClick={() => removeQuestionSet(q.id)}>
              <DeleteIcon />
            </IconButton>
          </div>

          {q.choices.map((choice, cidx) => (
            <div key={cidx} className="flex items-center mt-2 mb-2">
              <input type="checkbox" disabled className="mr-2" />
              <TextField
                placeholder={`ตัวเลือก ${cidx + 1}`}
                className="w-140"
                value={choice}
                onChange={(e) => updateChoiceText(q.id, cidx, e.target.value)}
              />
              <IconButton color="error" className="ml-2" onClick={() => removeChoice(q.id, cidx)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}

          <div className="flex items-center mb-2">
            <input type="checkbox" disabled className="mr-2" />
            <TextField
              placeholder="อื่นๆ.."
              className="w-140"
              disabled
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          </div>

          <div className="flex gap-2 ml-92">
            <button
              type="button"
              onClick={() => addChoice(q.id)}
              className="mt-5 mb-5 w-25 bg-[#1E3A8A] text-white p-1 rounded-4xl border-none"
            >
              เพิ่มตัวเลือก
            </button>
            {idx === questionSets.length - 1 && (
              <button
                type="button"
                onClick={addQuestionSet}
                className="mt-5 mb-5 w-25 bg-[#1E3A8A] text-white p-1 rounded-4xl border-none"
              >
                เพิ่มคำถาม
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checkbox;
