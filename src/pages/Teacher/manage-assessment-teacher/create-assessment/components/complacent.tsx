import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const Complacent = ({ onDelete, onDuplicate }: { onDelete: () => void; onDuplicate: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [questions, setQuestions] = useState([{ id: 1, text: '' }]);
  const [nextId, setNextId] = useState(2);

  const addQuestion = () => {
    setQuestions([...questions, { id: nextId, text: '' }]);
    setNextId(nextId + 1);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const deleteQuestion = (id: number) => {
    const filtered = questions.filter((q) => q.id !== id);
    const reIndexed = filtered.map((q, idx) => ({ ...q, id: idx + 1 }));
    setQuestions(reIndexed);
    setNextId(reIndexed.length + 1);
  };

  const handleTextChange = (id: number, newText: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: newText } : q))
    );
  };

  const handleDeleteAll = () => {
    setQuestions([]);
    setNextId(1);
    onDelete();
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicate();
    handleClose();
  };




  return (
<div className="border border-gray-400 w-180 rounded-md p-4 bg-white">
      <div className="flex items-center justify-between mt-5 ml-3 mr-3">
        <TextField name="activity_name" placeholder="หัวเรื่องแบบประเมิน" className="w-140" />
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleDuplicate}>ทำซ้ำคำถาม</MenuItem>
          <MenuItem onClick={handleDeleteAll}>ลบทั้งหมด</MenuItem>
        </Menu>
      </div>

      <div>
        {questions.map((q) => (
          <div key={q.id}>
            <div className="ml-4 mt-4">
              <div className="flex ml-35 gap-5 space-x-2 mt-4 mb-2">
                {['น้อยที่สุด', 'น้อย', 'ปานกลาง', 'มาก', 'มากที่สุด'].map((level, i) => (
                  <label key={i} className="flex flex-col items-center text-xs">
                    <span className="mb-0.5">{level}</span>
                    <input
                      type="radio"
                      disabled
                      name={`complacent-satisfaction-${q.id}-${q.id}`}
                      value={level}
                      className="scale-125"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex">
              <div className="flex ml-3 mt-5">
                <TextField
                  name="question"
                  placeholder={`คำถามที่ ${q.id}`}
                  className="w-140"
                  value={q.text}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                />
              </div>

              <div className="mt-8">
                <IconButton color="error" className="ml-10" onClick={() => deleteQuestion(q.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
                      </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 ml-118 mb-5 w-25 bg-[#1E3A8A] text-white p-1 rounded-4xl border-none"
        onClick={addQuestion}
      >
        เพิ่มคำถาม
      </button>
    </div>
  );
};

export default Complacent;
