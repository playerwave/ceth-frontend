import React, { useEffect } from "react";
import { Plus, Trash2, Copy, GripVertical } from "lucide-react";
import Question from "./Question";
import { Section as SectionType } from "../type/type.create";
import { useAssessmentStoreUi } from "../store/assessmentStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import setNumberService from "../../../../../service/Teacher/setNumber.service";
import { useParams } from "react-router-dom";
import { useQuestionStore } from "../../../../../stores/Teacher/questionStore";
import { QuestionType } from "../../../../../types/model";

interface SectionProps {
  section: SectionType;
  index: number;
  mode: "create" | "edit";
  dragHandleProps?: any;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  dragHandleProps,
  onMoveUp,
  onMoveDown,
  mode,
}) => {
  const { id } = useParams<{ id: string }>();
  const assessmentId = Number(id);

  const { updateSectionTitle, deleteSection, addQuestionToSection } = useAssessmentStoreUi();
  const { questions, fetchQuestionsBySetNumber, createQuestion } = useQuestionStore();

  // โหลดคำถามจาก backend เฉพาะ edit
  useEffect(() => {
    if (mode === "edit" && section.id) {
      fetchQuestionsBySetNumber(section.id);
    }
  }, [section.id, fetchQuestionsBySetNumber, mode]);

  // อัปเดตชื่อหัวข้อ
  const handleChangeTitle = async (newTitle: string) => {
    updateSectionTitle(section.id, newTitle);

    if (mode === "edit") {
      try {
        await setNumberService.updateSetNumber({
          set_number_id: section.id,
          name: newTitle,
          status: "Active",
          assessment_id: assessmentId,
        });
      } catch (err) {
        console.error("❌ Error updating section:", err);
      }
    }
  };

  // ลบ Section
  const handleDelete = async () => {
    deleteSection(section.id);
    if (mode === "edit") {
      try {
        await setNumberService.deleteSetNumber(section.id);
      } catch (err) {
        console.error("❌ Error deleting section:", err);
      }
    }
  };

  // เพิ่มคำถาม
  const handleAddQuestion = async () => {
    if (mode === "create") {
      addQuestionToSection(section.id, {
        id: Date.now(),
        question: "คำถามใหม่",
        type: "choice",
        options: [],
        required: false,
      });
    } else {
      try {
        const newQ = await createQuestion({
          question_text: "คำถามใหม่",
          question_number: questions.filter(q => q.set_number_id === section.id).length + 1,
          set_number_id: section.id,
          question_type: QuestionType.SINGLE,
        });
        if (!newQ) await fetchQuestionsBySetNumber(section.id);
      } catch (err) {
        console.error("❌ Error creating question:", err);
        await fetchQuestionsBySetNumber(section.id);
      }
    }
  };

  const onQuestionDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // TODO: reorder
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-shrink-0 flex items-center">
          <div {...dragHandleProps} className="hidden lg:block cursor-grab p-2 text-gray-400 hover:text-gray-600">
            <GripVertical size={20} />
          </div>
          <div className="lg:hidden flex flex-col">
            <button onClick={onMoveUp}>↑</button>
            <button onClick={onMoveDown}>↓</button>
          </div>
        </div>

        <input
          type="text"
          value={section.title}
          onChange={(e) => handleChangeTitle(e.target.value)}
          className="flex-1 text-base sm:text-lg border border-gray-300 rounded-lg px-2 py-1"
        />

        {mode === "edit" && (
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-blue-500"><Copy size={16} /></button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        )}
      </div>

      {/* Questions */}
      <DragDropContext onDragEnd={onQuestionDragEnd}>
        <Droppable droppableId={`questions-${section.id}`} type="QUESTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {mode === "edit"
                ? questions.filter((q) => q.set_number_id === section.id).map((q, index) => (
                    <Draggable key={q.question_id} draggableId={`q-${q.question_id}`} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="mb-4">
                          <Question
                            sectionId={section.id}
                            question={{
                              id: q.question_id,
                              question: q.question_text,
                              type: "choice",
                              options: [],
                              required: false,
                            }}
                            index={index}
                            mode={mode}
                            onMoveUp={() => {}}
                            onMoveDown={() => {}}
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
                      mode={mode}
                      onMoveUp={() => {}}
                      onMoveDown={() => {}}
                    />
                  ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={handleAddQuestion} className="mt-4 text-blue-600">
        <Plus size={16} /> เพิ่มคำถาม
      </button>
    </div>
  );
};

export default Section;
