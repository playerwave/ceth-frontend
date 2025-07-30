import React, { useRef, useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Complacent from "./components/complacent";
import Choice from "./components/choice";
import Checkbox from "./components/checkbox";
import Openques from "./components/openques";
import QuestionTypeSelector from "./components/questionTypeSelector";

const CreateAssessmentTeacher = () => {
  const defaultQuestionTypes = ["complacent", "choice", "checkbox", "openques"];
  const [questions, setQuestions] = useState<string[]>(defaultQuestionTypes);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddQuestion = (type: string) => {
    setQuestions(prev => [...prev, type]);
    setIsAdding(true); // 🟢 ระบุว่ากำลังเพิ่ม
  };

  const handleDeleteQuestion = (indexToDelete: number) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== indexToDelete));
    setIsAdding(false); // 🔴 ลบไม่ต้องเลื่อน
  };

  useEffect(() => {
    if (isAdding && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAdding(false); // 🔁 เคลียร์ flag หลังเลื่อนแล้ว
    }
  }, [questions]);

  const renderComponent = (type: string, index: number) => {
    switch (type) {
      case "complacent":
        return <Complacent key={index} onDelete={() => handleDeleteQuestion(index)} />;
      case "choice":
        return <Choice key={index} onDelete={() => handleDeleteQuestion(index)}  />;
      case "checkbox":
        return <Checkbox key={index}  onDelete={() => handleDeleteQuestion(index)}/>;
      case "openques":
        return <Openques key={index}   onDelete={() => handleDeleteQuestion(index)} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-320 mx-auto mt-5 mb-5 p-6 border bg-white rounded-lg shadow-sm min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-11">สร้างแบบประเมินกิจกรรมสหกิจ</h1>
        <QuestionTypeSelector onSelect={handleAddQuestion} />
      </div>

      <form className="space-y-10 flex-grow">
        <div className="w-180">
          <label className="block font-semibold mb-1">ชื่อหัวข้อ</label>
          <TextField name="activity_name" placeholder="ชื่อกิจกรรม" className="w-180" />
        </div>

        {questions.map((type, index) => renderComponent(type, index))}

        <div ref={bottomRef} />
      </form>
    </div>
  );
};

export default CreateAssessmentTeacher;
