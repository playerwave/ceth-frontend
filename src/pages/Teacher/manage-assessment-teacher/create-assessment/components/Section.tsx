import React from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import Question from './Question'; // 👈 React component
import { Section as SectionType, Question as QuestionType } from '../type/type.create'; // 👈 types

interface SectionProps {
    section: SectionType;
    sections: SectionType[];
    setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
}

const Section: React.FC<SectionProps> = ({ section, sections, setSections }) => {
    const updateSectionTitle = (title: string) => {
        setSections(sections.map(s => s.id === section.id ? { ...s, title } : s));
    };

    const deleteSection = () => {
        if (sections.length > 1) {
            setSections(sections.filter(s => s.id !== section.id));
        }
    };

    const duplicateSection = () => {
        // หา maxId ของคำถามใน section ปลายทาง
        const maxQuestionId = Math.max(...section.questions.map(q => q.id), 0);

        // duplicate section ใหม่
        const duplicated: SectionType = {
            ...section,
            id: Math.max(...sections.map(s => s.id)) + 1, // id ของหัวข้อใหม่
            title: section.title + " (Copy)",
            // duplicate คำถามโดย set id ใหม่เรียงต่อจาก max
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
        const idx = sections.findIndex(s => s.id === section.id);
        if (idx > 0) {
            const newSections = [...sections];
            [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
            setSections(newSections);
        }
    };

    const moveSectionDown = () => {
        const idx = sections.findIndex(s => s.id === section.id);
        if (idx < sections.length - 1) {
            const newSections = [...sections];
            [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
            setSections(newSections);
        }
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
            <div className="flex justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <button onClick={moveSectionUp} disabled={sections[0].id === section.id}>↑</button>
                    <button onClick={moveSectionDown} disabled={sections[sections.length - 1].id === section.id}>↓</button>
                </div>
                <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(e.target.value)}
                    className="flex-1 text-xl font-medium border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1 transition-all"
                />
                <div className="flex gap-2">
                    <button onClick={duplicateSection} className="text-gray-400 hover:text-blue-500"><Copy size={16} /></button>
                    <button onClick={deleteSection} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
            </div>

            {/* Questions */}
            {section.questions.map(q => (
                <Question
                    key={q.id}
                    sectionId={section.id}
                    question={q}
                    sections={sections}
                    setSections={setSections}
                />
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
