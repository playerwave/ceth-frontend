import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



const Choice = ({ onDelete, onDuplicate }: { onDelete: () => void; onDuplicate: () => void }) => {


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [questionSets, setQuestionSets] = useState([{ id: 1, choices: [''] }]);
  const [nextId, setNextId] = useState(2);

  const addQuestionSet = () => {
    setQuestionSets([...questionSets, { id: nextId, choices: [''] }]);
    setNextId(nextId + 1);
  };

  const addChoice = (id: number) => {
    setQuestionSets(
      questionSets.map((q) =>
        q.id === id ? { ...q, choices: [...q.choices, ''] } : q
      )
    );
  };

  const updateChoiceText = (questionId: number, choiceIndex: number, newText: string) => {
    setQuestionSets(
      questionSets.map((q) => {
        if (q.id === questionId) {
          const updatedChoices = [...q.choices];
          updatedChoices[choiceIndex] = newText;
          return { ...q, choices: updatedChoices };
        }
        return q;
      })
    );
  };

  const removeQuestionSet = (id: number) => {
    setQuestionSets(questionSets.filter(q => q.id !== id));
  };

  const removeChoice = (questionId: number, choiceIndex: number) => {
    setQuestionSets(
      questionSets.map((q) => {
        if (q.id === questionId) {
          const updatedChoices = q.choices.filter((_, idx) => idx !== choiceIndex);
          return { ...q, choices: updatedChoices };
        }
        return q;
      })
    );
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleDeleteAll = () => {
    setQuestionSets([]);
    setNextId(1);
    onDelete();
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicate();
    handleClose();
  };


  return (
    <div className='border  border-gray-400 w-180 rounded-md p-4 bg-white'>
      <div className='flex items-center justify-between mb-3 ml-3 mr-3'>
        <TextField
          name="activity_name"
          placeholder="หัวเรื่องแบบประเมิน"
          className="w-140"
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
          <div className='flex items-center mb-2'>
            <TextField name="question" placeholder="คำถาม"   className="w-140" />
            <IconButton color="error" className="ml-2" onClick={() => removeQuestionSet(q.id)}>
              <DeleteIcon />
            </IconButton>
          </div>

          {q.choices.map((choice, idx) => (
            <div key={idx} className='flex items-center mt-2 mb-2'>
              <input type="radio" disabled name={`satisfaction-${q.id}`} className="mr-2" />
              <TextField
                name={`choice-${q.id}-${idx}`}
                placeholder={`ตัวเลือก ${idx + 1}`}
                className="w-140"
                value={choice}
                onChange={e => updateChoiceText(q.id, idx, e.target.value)}
              />
              <IconButton color="error" className="ml-2" onClick={() => removeChoice(q.id, idx)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}



          <div className='flex gap-2 ml-92'>
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

export default Choice;
