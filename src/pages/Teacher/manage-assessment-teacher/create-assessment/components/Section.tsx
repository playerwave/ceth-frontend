import React, { useState } from 'react';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';
import Question from './Question';
import { Section as SectionType, Question as QuestionType } from '../type/type.create';

interface SectionProps {
    section: SectionType;
    sections: SectionType[];
    setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
    index: number;
    onReorder: (fromIndex: number, toIndex: number) => void;
}

const Section: React.FC<SectionProps> = ({ section, sections, setSections, index, onReorder }) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const updateSectionTitle = (title: string) => {
        setSections(sections.map(s => s.id === section.id ? { ...s, title } : s));
    };

    const deleteSection = () => {
        if (sections.length > 1) {
            setSections(sections.filter(s => s.id !== section.id));
        }
    };

    const duplicateSection = () => {
        const maxQuestionId = Math.max(...section.questions.map(q => q.id), 0);
        const duplicated: SectionType = {
            ...section,
            id: Math.max(...sections.map(s => s.id)) + 1,
            title: section.title + " (Copy)",
            questions: section.questions.map((q, idx) => ({
                ...q,
                id: maxQuestionId + idx + 1
            }))
        };

        const idx = sections.findIndex(s => s.id === section.id);
        const newSections = [...sections];
        newSections.splice(idx + 1, 0, duplicated);
        setSections(newSections);
    };

    const moveSectionUp = () => {
        if (index > 0) {
            onReorder(index, index - 1);
        }
    };

    const moveSectionDown = () => {
        if (index < sections.length - 1) {
            onReorder(index, index + 1);
        }
    };

    // Question Drag & Drop handlers
    const handleQuestionDragStart = (e: React.DragEvent, qIndex: number) => {
        setDraggedIndex(qIndex);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    };

    const handleQuestionDragOver = (e: React.DragEvent, qIndex: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(qIndex);
    };

    const handleQuestionDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            moveQuestion(draggedIndex, dragOverIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleQuestionDrop = (e: React.DragEvent, qIndex: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== qIndex) {
            moveQuestion(draggedIndex, qIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const moveQuestion = (fromIndex: number, toIndex: number) => {
        setSections(sections.map(s => {
            if (s.id === section.id) {
                const newQuestions = [...s.questions];
                const [movedItem] = newQuestions.splice(fromIndex, 1);
                newQuestions.splice(toIndex, 0, movedItem);
                return { ...s, questions: newQuestions };
            }
            return s;
        }));
    };

    const addQuestion = () => {
        const newId = section.questions.length > 0
            ? Math.max(...section.questions.map(q => q.id)) + 1
            : 1;

        const newQuestion: QuestionType = {
            id: newId,
            type: 'choice',
            question: 'คำถามใหม่',
            options: ['ตัวเลือก 1'],
            required: false,
        };

        setSections(sections.map(s =>
            s.id === section.id
                ? { ...s, questions: [...s.questions, newQuestion] }
                : s
        ));
    };

    return (
        <div className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                {/* Desktop: Drag Handle, Mobile: Arrow Buttons */}
                <div className="flex flex-col items-center">
                    {/* Desktop: Drag Handle */}
                    <div className="hidden lg:block cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <GripVertical size={24} />
                    </div>
                    
                    {/* Mobile: Arrow Buttons */}
                    <div className="lg:hidden flex flex-col gap-1">
                        <button 
                            onClick={moveSectionUp} 
                            disabled={index === 0}
                            className="text-gray-400 hover:text-blue-500 disabled:opacity-30 p-1"
                        >
                            ↑
                        </button>
                        <button 
                            onClick={moveSectionDown} 
                            disabled={index === sections.length - 1}
                            className="text-gray-400 hover:text-blue-500 disabled:opacity-30 p-1"
                        >
                            ↓
                        </button>
                    </div>
                </div>

                <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(e.target.value)}
                    className="flex-1 mx-4 text-xl font-medium border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1 transition-all"
                />
                
                <div className="flex gap-2">
                    <button onClick={duplicateSection} className="text-gray-400 hover:text-blue-500">
                        <Copy size={16} />
                    </button>
                    <button 
                        onClick={deleteSection} 
                        disabled={sections.length === 1}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-30"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Questions */}
            {section.questions.map((question, qIndex) => (
                <div
                    key={question.id}
                    draggable
                    onDragStart={(e) => handleQuestionDragStart(e, qIndex)}
                    onDragOver={(e) => handleQuestionDragOver(e, qIndex)}
                    onDragEnd={handleQuestionDragEnd}
                    onDrop={(e) => handleQuestionDrop(e, qIndex)}
                    className={`${dragOverIndex === qIndex ? 'border-t-4 border-blue-400' : ''} ${
                        draggedIndex === qIndex ? 'opacity-50 scale-105' : ''
                    }`}
                >
                    <Question
                        sectionId={section.id}
                        question={question}
                        sections={sections}
                        setSections={setSections}
                        index={qIndex}
                        onMoveUp={() => qIndex > 0 && moveQuestion(qIndex, qIndex - 1)}
                        onMoveDown={() => qIndex < section.questions.length - 1 && moveQuestion(qIndex, qIndex + 1)}
                        isDragging={draggedIndex === qIndex}
                    />
                </div>
            ))}

            <div className='mt-6'>
                <button onClick={addQuestion} className="mt-2 flex items-center gap-2 text-blue-600">
                    <Plus size={16} /> เพิ่มคำถาม
                </button>
            </div>
        </div>
    );
};

export default Section;