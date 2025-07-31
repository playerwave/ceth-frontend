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
  const [formData, setFormData] = useState<any[]>([]);
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

  const handleDuplicateQuestion = (type: string, index: number) => {
    setQuestions(prev => {
      const before = prev.slice(0, index + 1);
      const after = prev.slice(index + 1);
      return [...before, type, ...after];
    });
    setIsAdding(true);
  };

  const updateQuestionData = (index: number, data: any) => {
    setFormData(prev => {
      const updated = [...prev];
      updated[index] = data;
      return updated;
    });
  };




  const renderComponent = (type: string, index: number) => {
    switch (type) {
      case "complacent":
        return <Complacent
          key={index}
          onDelete={() => handleDeleteQuestion(index)}
          onDuplicate={() => handleDuplicateQuestion("complacent", index)}
          onChange={(data) => updateQuestionData(index, data)}
        />

      case "choice":
        return <Choice
          key={index}
          onDelete={() => handleDeleteQuestion(index)}
          onDuplicate={() => handleDuplicateQuestion("choice", index)}
          onChange={(data) => updateQuestionData(index, data)}
        />;

      case "checkbox":
        return <Checkbox
          key={index}
          onDelete={() => handleDeleteQuestion(index)}
          onDuplicate={() => handleDuplicateQuestion("checkbox", index)}
          onChange={(data) => updateQuestionData(index, data)}
        />;

      case "openques":
        return <Openques
          key={index}
          onDelete={() => handleDeleteQuestion(index)}
          onDuplicate={() => handleDuplicateQuestion("openques", index)}
          onChange={(data) => updateQuestionData(index, data)} // 🟢 เพิ่มตรงนี้
        />;

      default:
        return null;
    }
  };



  const handleSave = () => {
    console.log("📋 สรุปข้อมูลแบบประเมิน:");
    console.log("ชื่อกิจกรรม: [ค่าชื่อกิจกรรมที่คุณอาจเก็บจาก state]");
    console.log("ประเภทคำถาม:", questions);
    console.log("ข้อมูลคำถามทั้งหมด:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="flex justify-center items-start min-h-screen p-6">
        <div className="w-full max-w-7xl bg-white backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <div className="flex justify-between   mb-12">
            <h1 className="text-4xl font-bold">
              สร้างแบบประเมินกิจกรรมสหกิจ
            </h1>
            <QuestionTypeSelector onSelect={handleAddQuestion} />
          </div>

          <form className="space-y-8 w-full">
            <div className="w-full flex ">
              <div className="w-140">
                <label className="block font-semibold mb-4  text-slate-700 text-lg">
                  ชื่อหัวข้อ
                </label>
                <div className="">
                  <TextField
                    name="activity_name"
                    placeholder="ชื่อกิจกรรม"
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {questions.map((type, index) => (
              <div className="w-full flex justify-center mt-20" key={index}>
                {renderComponent(type, index)}
              </div>
            ))}
            <div className="flex justify-center gap-8 mt-16">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md"
                onClick={handleSave}
              >
                บันทึก
              </button>
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-full shadow-md"
              
              >
                ยกเลิก
              </button>
            </div>
            <div ref={bottomRef} />


          </form>
        </div>
      </div>
    </div>
  );

};

export default CreateAssessmentTeacher;
