import React, { useRef, useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Complacent from "./components/complacent";
import Choice from "./components/choice";
import Checkbox from "./components/checkbox";
import Openques from "./components/openques";
import QuestionTypeSelector from "./components/questionTypeSelector";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


type QuestionItem = { id: string; type: string };

const CreateAssessmentTeacher = () => {
  const defaultQuestionTypes: QuestionItem[] = [
    { id: "1", type: "complacent" },
    { id: "2", type: "choice" },
    { id: "3", type: "checkbox" },
    { id: "4", type: "openques" },
  ];
 const [questionIdCounter, setQuestionIdCounter] = useState(defaultQuestionTypes.length + 1);


  const [questions, setQuestions] = useState<QuestionItem[]>(defaultQuestionTypes);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isAdding, setIsAdding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleAddQuestion = (type: string) => {
  const newId = String(questionIdCounter); // id จะเป็น "1", "2", "3"...
  const newQuestion = { id: newId, type };

  setQuestions(prev => [...prev, newQuestion]);
  setQuestionIdCounter(prev => prev + 1); // เพิ่มลำดับ
  setIsAdding(true);
};

 const handleDuplicateQuestion = (type: string, idToDuplicate: string) => {
  const newId = String(questionIdCounter);
  const duplicatedQuestion = { id: newId, type };

  setQuestions(prev => {
    const index = prev.findIndex(q => q.id === idToDuplicate);
    return [
      ...prev.slice(0, index + 1),
      duplicatedQuestion,
      ...prev.slice(index + 1)
    ];
  });

  setFormData(prev => ({
    ...prev,
    [newId]: prev[idToDuplicate] ? { ...prev[idToDuplicate] } : null
  }));

  setQuestionIdCounter(prev => prev + 1);
  setIsAdding(true);
};



  const updateQuestionData = (id: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: data
    }));
  };

  const handleDeleteQuestionById = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };


  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(questions);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setQuestions(reordered); // ✅ formData ไม่ต้องขยับ เพราะมันอิงตาม id
  };
  useEffect(() => {
    if (isAdding && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAdding(false);
    }
  }, [questions]);

  const renderComponent = (type: string, id: string) => {
    const commonProps = {
      onDelete: () => handleDeleteQuestionById(id),
      onDuplicate: () => handleDuplicateQuestion(type, id),
      onChange: (data: any) => updateQuestionData(id, data)
    };

    switch (type) {
      case "complacent": return <Complacent key={id} {...commonProps} />;
      case "choice": return <Choice key={id} {...commonProps} />;
      case "checkbox": return <Checkbox key={id} {...commonProps} />;
      case "openques": return <Openques key={id} {...commonProps} />;
      default: return null;
    }
  };

  const handleSave = () => {
    console.log("📋 สรุปข้อมูลแบบประเมิน:");
    console.log("ประเภทคำถาม:", questions);
    console.log("ข้อมูลคำถามทั้งหมด:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="flex justify-center items-start min-h-screen p-6">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl border p-8">
          <div className="flex justify-between mb-12">
            <h1 className="text-4xl font-bold">สร้างแบบประเมินกิจกรรมสหกิจ</h1>
            <QuestionTypeSelector onSelect={handleAddQuestion} />
          </div>

          <form className="space-y-8 w-full">
            <div className="w-full flex">
              <div className="w-140">
                <label className="block font-semibold mb-4 text-slate-700 text-lg">
                  ชื่อหัวข้อ
                </label>
                <TextField name="activity_name" placeholder="ชื่อกิจกรรม" fullWidth />
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {questions.map((q) => (
                      <Draggable key={q.id} draggableId={q.id} index={questions.findIndex(i => i.id === q.id)}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-full flex justify-center mt-20"
                          >
                            {renderComponent(q.type, q.id)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

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
