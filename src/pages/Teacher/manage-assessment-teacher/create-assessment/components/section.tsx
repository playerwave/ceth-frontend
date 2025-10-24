import React, { useEffect } from "react";
import { Plus, Trash2, Copy, GripVertical } from "lucide-react";
import { Section as SectionType } from "../type/type.create";
import { useAssessmentStoreUi } from "../store/assessmentStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import setNumberService from "@/service/Teacher/setNumber.service";
import { useParams } from "react-router-dom";
import { useQuestionStore } from "@/stores/Teacher/questionStore";
import Question from "./question";
import { useSetNumberStore } from "@/stores/Teacher/setNumberStore";

interface SectionProps { 
  section: SectionType;
  index: number;
  mode: "create" | "edit";
  dragHandleProps?: any;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const mapBackendToFrontend = (
  type: string
): "choice" | "checkbox" | "text" | "rating" => {
  const t = type.toLowerCase();
  if (t.includes("single") && !t.includes("fix")) return "choice";
  if (t.includes("multiple")) return "checkbox";
  if (t.includes("fix")) return "rating";
  if (t.includes("text")) return "text";
  return "text";
};

const Section: React.FC<SectionProps> = ({
  section,
  mode,
  dragHandleProps,
  onMoveUp,
  onMoveDown,
}) => {
  const { id } = useParams<{ id: string }>();
  const assessmentId = Number(id);

  const { updateSectionTitle, deleteSection, addQuestionToSection, sections, setSections } = useAssessmentStoreUi();
  const { 
    questions, 
    fetchQuestionsBySetNumber, 
    createQuestion,
    updateQuestionsOrder,
    updateQuestionsOrderInDatabase,
    revertQuestionsOrder,
  } = useQuestionStore();
  const { duplicateSetNumber } = useSetNumberStore();
  useEffect(() => {
    if (mode === "edit" && section.id) {
      fetchQuestionsBySetNumber(section.id);
    }
  }, [mode, section.id, fetchQuestionsBySetNumber]);



  const handleDuplicate = async () => {
    if (mode === "edit") {
      try {
        const duplicated = await duplicateSetNumber(section.id);
        if (duplicated) {
          console.log("✅ duplicated section:", duplicated);
        }
      } catch (err) {
        console.error("❌ Error duplicating section:", err);
      }
    }
  };
  // const handleChangeTitle = async (newTitle: string) => {
  //   updateSectionTitle(section.id, newTitle);
  //   if (mode === "edit") {
  //     try {
  //       await setNumberService.updateSetNumber({
  //         set_number_id: section.id,
  //         name: newTitle,
  //         status: "Active",
  //         assessment_id: assessmentId,
  //       });
  //     } catch (err) {
  //       console.error("❌ Error updating section:", err);
  //     }
  //   }
  // };

  const handleDelete = async () => {
    if (mode === "edit") {
      try {
        await setNumberService.deleteSetNumber(section.id);
      } catch (err) {
        console.error("❌ Error deleting section:", err);
      }
    }
    deleteSection(section.id);
  };

  const handleAddQuestion = async () => {
    if (mode === "create") {
      addQuestionToSection(section.id, {
        id: Date.now(),
        question: "คำถามใหม่",
        type: "choice",
        options: [
          { choice_id: Date.now() + 1, choice_text: "ตัวเลือก 1", question_id: 0 },
          { choice_id: Date.now() + 2, choice_text: "ตัวเลือก 2", question_id: 0 },
        ],
        required: false,
      });
    } else {
      try {
        const newQ = await createQuestion({
          question_text: "คำถามใหม่",
          question_number: questions.filter((q) => q.set_number_id === section.id).length + 1,
          set_number_id: section.id,
          question_type: "Single answer",
        });
        if (!newQ) {
          await fetchQuestionsBySetNumber(section.id);
        }
      } catch (err) {
        console.error("❌ Error creating question:", err);
        await fetchQuestionsBySetNumber(section.id);
      }
    }
  };

  //   const onQuestionDragEnd = async (result: DropResult) => {
  //   if (!result.destination) return;

  //   const { source, destination } = result;
  //   if (source.index === destination.index) return;

  //   if (mode === "create") {
  //     // 🟢 frontend state only
  //     const newQuestions = Array.from(section.questions);
  //     const [moved] = newQuestions.splice(source.index, 1);
  //     newQuestions.splice(destination.index, 0, moved);

  //     // update state ใน store
  //     newQuestions.forEach((q, i) => {
  //       updateQuestionInSection(section.id, q.id, { ...q, question_number: i + 1 });
  //     });
  //   } else {
  //     // 🟢 mode edit → update DB
  //     const qInSection = questions.filter((q) => q.set_number_id === section.id);
  //     const newOrder = Array.from(qInSection);
  //     const [moved] = newOrder.splice(source.index, 1);
  //     newOrder.splice(destination.index, 0, moved);

  //     // update question_number ใหม่ใน DB
  //     for (let i = 0; i < newOrder.length; i++) {
  //       const q = newOrder[i];
  //       await updateQuestion({
  //         question_id: q.question_id,
  //         question_text: q.question_text,
  //         question_number: i + 1,   // อัปเดตลำดับใหม่
  //         set_number_id: section.id,
  //         question_type: q.question_type,
  //       } as any);
  //     }

  //     // refresh ให้ state ตรงกับ DB
  //     fetchQuestionsBySetNumber(section.id);
  //   }
  // };

  const onQuestionDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.index === destination.index) return;

    if (mode === "create") {
      const newQuestions = Array.from(section.questions);
      const [moved] = newQuestions.splice(source.index, 1);
      newQuestions.splice(destination.index, 0, moved);

      // ✅ update ทั้ง section.questions กลับเข้า store
      setSections(
        sections.map(s =>
          s.id === section.id
            ? {
              ...s,
              questions: newQuestions.map((q, i) => ({
                ...q,
                question_number: i + 1,
              })),
            }
            : s
        )
      );
    }

    if (mode === "edit") {
      // 🟢 edit mode → ใช้ Optimistic Updates
      const qInSection = questions.filter(
        (q) => q.set_number_id === section.id
      );

      const originalOrder = Array.from(qInSection);
      const newOrder = Array.from(qInSection);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);

      // ✅ 1. อัปเดต UI ทันที (Optimistic Update)
      console.log("🚀 Applying optimistic update for smooth drag & drop");
      updateQuestionsOrder(section.id, newOrder);

      // ✅ 2. อัปเดต Database ในพื้นหลัง
      try {
        await updateQuestionsOrderInDatabase(section.id, newOrder);
        console.log("✅ Database update completed successfully");
      } catch (error) {
        console.error("❌ Database update failed, reverting UI:", error);
        // ✅ 3. ถ้า error ให้ revert กลับ
        revertQuestionsOrder(section.id, originalOrder);
        
        // แสดง error message ให้ user
        alert("❌ เกิดข้อผิดพลาดในการบันทึกลำดับคำถาม กรุณาลองใหม่อีกครั้ง");
      }
    }
  };


  return (
    <div className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-shrink-0 flex items-center">
          <div {...dragHandleProps} className="hidden lg:block cursor-grab p-2 text-gray-400 hover:text-gray-600">
            <GripVertical size={20} />
          </div>
          <div className="lg:hidden flex flex-col">
            <button onClick={onMoveUp} className="text-gray-400 hover:text-blue-500 leading-none">↑</button>
            <button onClick={onMoveDown} className="text-gray-400 hover:text-blue-500 leading-none">↓</button>
          </div>
        </div>

        <input
          type="text"
          value={section.title}
          onChange={(e) => updateSectionTitle(section.id, e.target.value)} // 🟢 update state local เท่านั้น
          onBlur={async (e) => {
            if (mode === "edit") {
              try {
                await setNumberService.updateSetNumber({
                  set_number_id: section.id,
                  name: e.target.value,
                  status: "Active",
                  assessment_id: assessmentId,
                });
                console.log("✅ Updated section title:", e.target.value);
              } catch (err) {
                console.error("❌ Error updating section:", err);
              }
            }
          }}
          className="flex-1 min-w-0 text-base sm:text-lg font-medium border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1 transition-all"
        />


        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDuplicate}
            className="text-gray-400 hover:text-blue-500"
          >
            <Copy size={16} />
          </button>

          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* Questions */}
      {/* <DragDropContext onDragEnd={onQuestionDragEnd}>
        <Droppable droppableId={`questions-${section.id}`} type="QUESTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {mode === "edit"
                ? questions
                  .filter((q) => q.set_number_id === section.id)
                  .map((q, index) => (
                    <Draggable key={q.question_id} draggableId={`q-${q.question_id}`} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          className="mb-4 transition-all duration-200 ease-in-out"
                          style={{
                            ...provided.draggableProps.style,
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          <Question
                            sectionId={section.id}
                            question={{
                              id: q.question_id,
                              question: q.question_text,
                              type: mapBackendToFrontend(q.question_type),
                              options: [],
                              required: false,
                            }}
                            index={index}
                            mode="edit"
                            onMoveUp={() => { }}
                            onMoveDown={() => { }}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                : section.questions.map((q, index) => (
                  <Question
                    key={q.id}
                    sectionId={section.id}
                    question={q}
                    index={index}
                    mode="create"
                    onMoveUp={() => { }}
                    onMoveDown={() => { }}
                    
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext> */}
      <DragDropContext onDragEnd={onQuestionDragEnd}>
        <Droppable droppableId={`questions-${section.id}`} type="QUESTION">
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className="min-h-[100px] transition-all duration-200"
            >
              {mode === "edit"
                ? questions
                  .filter((q) => q.set_number_id === section.id)
                  .map((q, index) => (
                    <Draggable
                      key={q.question_id}
                      draggableId={`q-${q.question_id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-4"
                        >
                          <Question
                            sectionId={section.id}
                            question={{
                              id: q.question_id,
                              question: q.question_text,
                              type: mapBackendToFrontend(q.question_type),
                              options: [],
                              required: false,
                            }}
                            index={index}
                            mode="edit"
                            onMoveUp={() => { }}
                            onMoveDown={() => { }}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                : section.questions.map((q, index) => (
                  <Draggable key={q.id} draggableId={`q-${q.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4"
                      >
                        <Question
                          sectionId={section.id}
                          question={q}
                          index={index}
                          mode="create"
                          onMoveUp={() => { }}
                          onMoveDown={() => { }}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-6">
        <button onClick={handleAddQuestion} className="mt-2 flex items-center gap-2 text-blue-600">
          <Plus size={16} /> เพิ่มคำถาม
        </button>
      </div>
    </div>
  );
};

export default Section;
