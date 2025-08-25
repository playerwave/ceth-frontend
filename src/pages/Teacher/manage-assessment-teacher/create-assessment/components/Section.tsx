import React from "react";
import { Plus, Trash2, Copy, GripVertical } from "lucide-react";
import Question from "./Question";
import { Section as SectionType, Question as QuestionType } from "../type/type.create";
import { useAssessmentStore } from "../store/assessmentStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface SectionProps {
    section: SectionType;
    index: number;
    dragHandleProps?: any;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const Section: React.FC<SectionProps> = ({
    section,
    dragHandleProps,
    onMoveUp,
    onMoveDown,
}) => {
    const { sections, setSections, updateSectionTitle, deleteSection } =
        useAssessmentStore();

    const duplicateSection = () => {
        const maxQuestionId = Math.max(...section.questions.map((q) => q.id), 0);
        const duplicated: SectionType = {
            ...section,
            id: Math.max(...sections.map((s) => s.id)) + 1,
            title: section.title + " (Copy)",
            questions: section.questions.map((q, idx) => ({
                ...q,
                id: maxQuestionId + idx + 1,
            })),
        };
        const idx = sections.findIndex((s) => s.id === section.id);
        const newSections = [...sections];
        newSections.splice(idx + 1, 0, duplicated);
        setSections(newSections);
    };

    const addQuestion = () => {
        const newId =
            section.questions.length > 0
                ? Math.max(...section.questions.map((q) => q.id)) + 1
                : 1;

        const newQuestion: QuestionType = {
            id: newId,
            type: "choice",
            question: "คำถามใหม่",
            options: ["ตัวเลือก 1"],
            required: false,
        };

        setSections(
            sections.map((s) =>
                s.id === section.id
                    ? { ...s, questions: [...s.questions, newQuestion] }
                    : s
            )
        );
    };

    // Drag สำหรับ Question ภายใน Section (desktop)
    const onQuestionDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const newSections = [...sections];
        const secIndex = newSections.findIndex((s) => s.id === section.id);
        if (secIndex === -1) return;

        const sec = newSections[secIndex];
        const questions = Array.from(sec.questions);

        const [moved] = questions.splice(source.index, 1);
        questions.splice(destination.index, 0, moved);

        newSections[secIndex] = { ...sec, questions };
        setSections(newSections);
    };

    // ปุ่ม ↑ ↓ สำหรับ Question (mobile/tablet)
    const moveQuestion = (fromIndex: number, toIndex: number) => {
        const secIndex = sections.findIndex((s) => s.id === section.id);
        if (secIndex === -1) return;

        const sec = sections[secIndex];
        const questions = Array.from(sec.questions);

        if (toIndex < 0 || toIndex >= questions.length) return;

        const [moved] = questions.splice(fromIndex, 1);
        questions.splice(toIndex, 0, moved);

        const newSections = [...sections];
        newSections[secIndex] = { ...sec, questions };
        setSections(newSections);
    };

    return (
        <div className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-6">
                {/* Drag handle / ↑ ↓ */}
                <div className="flex-shrink-0 flex items-center">
                    {/* Desktop: drag handle */}
                    <div
                        {...dragHandleProps}
                        className="hidden lg:block cursor-grab p-2 text-gray-400 hover:text-gray-600"
                    >
                        <GripVertical size={20} />
                    </div>

                    {/* Mobile: ↑ ↓ */}
                    <div className="lg:hidden flex flex-col">
                        <button
                            onClick={onMoveUp}
                            className="text-gray-400 hover:text-blue-500 leading-none"
                        >
                            ↑
                        </button>
                        <button
                            onClick={onMoveDown}
                            className="text-gray-400 hover:text-blue-500 leading-none"
                        >
                            ↓
                        </button>
                    </div>
                </div>

                {/* Title input (ขยายเต็มที่ แต่ไม่ชนปุ่ม) */}
                <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="flex-1 min-w-0 text-base sm:text-lg font-medium border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1 transition-all"
                />

                {/* Copy / Delete */}
                <div className="flex gap-2 flex-shrink-0">
                    <button onClick={duplicateSection} className="text-gray-400 hover:text-blue-500">
                        <Copy size={16} />
                    </button>
                    <button
                        onClick={() => deleteSection(section.id)}
                        disabled={sections.length === 1}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-30"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* DragDropContext สำหรับ Questions */}
            <DragDropContext onDragEnd={onQuestionDragEnd}>
                <Droppable droppableId={`questions-${section.id}`} type="QUESTION">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {section.questions.map((q, index) => (
                                <Draggable
                                    key={`question-${q.id}`}
                                    draggableId={`question-${section.id}-${q.id}`}
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
                                                question={q}
                                                index={index}
                                                onMoveUp={() => moveQuestion(index, index - 1)}
                                                onMoveDown={() => moveQuestion(index, index + 1)}
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

            {/* Add Question */}
            <div className="mt-6">
                <button
                    onClick={addQuestion}
                    className="mt-2 flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} /> เพิ่มคำถาม
                </button>
            </div>
        </div>
    );
};

export default Section;
