import React from 'react';
import { Trash2, Copy } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';
import { Section as SectionType, Question as QuestionType } from '../type/type.create';

interface QuestionProps {
    sectionId: number;
    question: QuestionType;
    sections: SectionType[];
    setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
}

const Question: React.FC<QuestionProps> = ({ sectionId, question, sections, setSections }) => {
    const updateQuestion = (field: keyof QuestionType, value: any) => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? { ...s, questions: s.questions.map(q => q.id === question.id ? { ...q, [field]: value } : q) }
                : s
        ));
    };

    const deleteQuestion = () => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? { ...s, questions: s.questions.filter(q => q.id !== question.id) }
                : s
        ));
    };

    const duplicateQuestion = () => {
        // หา max id ของคำถามใน section นี้
        const maxId = Math.max(...sections.find(s => s.id === sectionId)?.questions.map(q => q.id) || [0]);

        const duplicated: QuestionType = {
            ...question,
            id: maxId + 1, // 👈 ใช้ maxId + 1 แทน Date.now()
            question: question.question + " (Copy)",
        };

        setSections(sections.map(s =>
            s.id === sectionId
                ? { ...s, questions: [...s.questions, duplicated] }
                : s
        ));
    };


    const moveQuestionUp = () => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? {
                    ...s,
                    questions: s.questions.map(q => q).reduce((acc, q, idx, arr) => {
                        if (q.id === question.id && idx > 0) {
                            const newArr = [...arr];
                            [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
                            return newArr;
                        }
                        return acc.length ? acc : arr;
                    }, [] as QuestionType[])
                }
                : s
        ));
    };

    const moveQuestionDown = () => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? {
                    ...s,
                    questions: s.questions.map(q => q).reduce((acc, q, idx, arr) => {
                        if (q.id === question.id && idx < arr.length - 1) {
                            const newArr = [...arr];
                            [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
                            return newArr;
                        }
                        return acc.length ? acc : arr;
                    }, [] as QuestionType[])
                }
                : s
        ));
    };

    return (
        <div className="border-l-4 border-blue-500 pl-4 mb-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
            {/* Header */}
            <div className="flex gap-2 items-start mb-2">
                <div className="flex flex-col ">
                    <button onClick={moveQuestionUp}>↑</button>
                    <button onClick={moveQuestionDown}>↓</button>
                </div>
                <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion('question', e.target.value)}
                    className="flex-1 text-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1"
                />
                <select
                    value={question.type}
                    onChange={(e) => updateQuestion('type', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md"
                >
                    <option value="choice">ตัวเลือกเดียว</option>
                    <option value="checkbox">หลายตัวเลือก</option>
                    <option value="text">ถามตอบ</option>
                    <option value="rating">ความพึงพอใจ</option>
                </select>
               
            </div>

            {/* Body */}
            <QuestionRenderer sectionId={sectionId} question={question} sections={sections} setSections={setSections} />
            {/* Footer: ปุ่ม Duplicate/Delete อยู่ตำแหน่งเดียวกันทุกประเภท */}
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={duplicateQuestion} className="text-gray-400 hover:text-blue-500">
                    <Copy size={18} />
                </button>
                <button onClick={deleteQuestion} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>

        </div>
    );
};

export default Question;
