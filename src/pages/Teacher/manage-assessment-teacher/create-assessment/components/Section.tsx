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

  const { updateSectionTitle, deleteSection, addQuestionToSection } = useAssessmentStoreUi();
  const { questions, fetchQuestionsBySetNumber, createQuestion } = useQuestionStore();

  useEffect(() => {
    if (mode === "edit" && section.id) {
      fetchQuestionsBySetNumber(section.id);
    }
  }, [mode, section.id, fetchQuestionsBySetNumber]);

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
          question_type: QuestionType.SINGLE,
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

  const onQuestionDragEnd = (result: DropResult) => {
    if (!result.destination) return;
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
          onChange={(e) => handleChangeTitle(e.target.value)}
          className="flex-1 min-w-0 text-base sm:text-lg font-medium border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1 transition-all"
        />

        <div className="flex gap-2 flex-shrink-0">
          <button className="text-gray-400 hover:text-blue-500"><Copy size={16} /></button>
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* Questions */}
      <DragDropContext onDragEnd={onQuestionDragEnd}>
        <Droppable droppableId={`questions-${section.id}`} type="QUESTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {mode === "edit"
                ? questions
                    .filter((q) => q.set_number_id === section.id)
                    .map((q, index) => (
                      <Draggable key={q.question_id} draggableId={`q-${q.question_id}`} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} className="mb-4">
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
                      mode="create"
                      onMoveUp={() => {}}
                      onMoveDown={() => {}}
                    />
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
