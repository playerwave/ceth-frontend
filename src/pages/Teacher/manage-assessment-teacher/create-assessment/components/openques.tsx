import { IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const Openques = ({ onDelete }: { onDelete: () => void }) => {
  const [questions, setQuestions] = useState([{ id: 1, question: '', answer: '' }]);
  const [nextId, setNextId] = useState(2);

  const addQuestion = () => {
    setQuestions([...questions, { id: nextId, question: '', answer: '' }]);
    setNextId(nextId + 1);
  };

  const deleteQuestion = (id: number) => {
    const filtered = questions.filter(q => q.id !== id);
    const reIndexed = filtered.map((q, idx) => ({ ...q, id: idx + 1 }));
    setQuestions(reIndexed);
    setNextId(reIndexed.length + 1);
  };

  const handleChange = (id: number, field: 'question' | 'answer', value: string) => {
    setQuestions(
      questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const deleteAllOpenques = () => {
    setQuestions([]);
    setNextId(1);
    onDelete(); // 💥 แจ้งหน้าแม่ให้ลบตัวเอง
  };

  return (
    <div className='border w-180 rounded-md p-4 bg-white'>
      <div className='flex items-center  mb-3 ml-3 mr-3'>
        <TextField
          name="activity_name"
          placeholder="หัวเรื่องแบบประเมิน"
          className="w-140"
        />
        <IconButton color="error" onClick={deleteAllOpenques}>
          <DeleteIcon />
        </IconButton>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="mb-4 p-3">
          <div className='flex items-center mb-2'>
            <TextField
              name="question"
              placeholder="คำถาม"
              className="w-140"
              value={q.question}
              onChange={e => handleChange(q.id, 'question', e.target.value)}
            />
            <IconButton color="error" className="ml-2" onClick={() => deleteQuestion(q.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
          <div className='flex items-center mt-2 mb-2'>
            <TextField
              name="answer"
              placeholder="คำตอบ/อธิบาย"
              className="w-140"
              multiline
              minRows={2}
              value={q.answer}
              onChange={e => handleChange(q.id, 'answer', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="flex ml-120">
        <button
          type="button"
          onClick={addQuestion}
          className="mt-5 mb-5 w-25 bg-[#1E3A8A] text-white p-1 rounded-4xl border-none"
        >
          เพิ่มคำถาม
        </button>
      </div>
    </div>
  );
};

export default Openques;
