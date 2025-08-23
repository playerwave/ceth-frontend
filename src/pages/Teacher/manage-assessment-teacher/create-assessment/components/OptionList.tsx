import React from "react";
import { Section, Question } from "../type/type.create";

interface OptionListProps {
    sectionId: number;
    question: Question;
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

const OptionList: React.FC<OptionListProps> = ({ sectionId, question, sections, setSections }) => {
    const updateOption = (index: number, value: string) => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? {
                    ...s,
                    questions: s.questions.map(q =>
                        q.id === question.id
                            ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
                            : q
                    )
                }
                : s
        ));
    };

    const addOption = () => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? {
                    ...s,
                    questions: s.questions.map(q =>
                        q.id === question.id
                            ? { ...q, options: [...q.options, `ตัวเลือก ${q.options.length + 1}`] }
                            : q
                    )
                }
                : s
        ));
    };

    const deleteOption = (index: number) => {
        setSections(sections.map(s =>
            s.id === sectionId
                ? {
                    ...s,
                    questions: s.questions.map(q =>
                        q.id === question.id
                            ? { ...q, options: q.options.filter((_, i) => i !== index) }
                            : q
                    )
                }
                : s
        ));
    };

    return (
        <div className="space-y-2">
            {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    {/* แสดง input ตามชนิดคำถาม */}
                    {question.type === "choice" ? (
                        <input type="checkbox" disabled className="w-4 h-4 text-blue-500" />
                    ) : (
                        <input type="radio" disabled className="w-4 h-4 text-blue-500" />
                    )}

                    <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        className="flex-1 p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                    />

                    {question.options.length > 1 && (
                        <button
                            onClick={() => deleteOption(idx)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}

            {/* ปุ่มเพิ่มตัวเลือก */}
            <div className="mt-6">
            <button
                onClick={addOption}
                className="text-blue-600 hover:text-blue-700 text-sm"
            >
                + เพิ่มตัวเลือก
            </button>
            </div>
        </div>
    );
};

export default OptionList;
