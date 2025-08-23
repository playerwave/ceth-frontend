import React, { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import Section from '../create-assessment/components/Section';
import { Section as SectionType, FormData } from './type/type.create';
import Button from "../../../../components/Button";
const CreateAssessmentTeacher = () => {
  const [formTitle, setFormTitle] = useState('แบบประเมินใหม่');
  const [formDescription, setFormDescription] = useState('คำอธิบายแบบประเมิน');
  const [sections, setSections] = useState<SectionType[]>([
    {
      id: 1,
      title: 'หัวข้อที่ 1',
      questions: [
        {
          id: 1,
          type: 'choice',
          question: 'คำถามตัวอย่าง',
          options: ['ตัวเลือก 1', 'ตัวเลือก 2'],
          required: false,
        },
      ],
    },
  ]);

  // เพิ่มหัวข้อใหม่ (id เรียง 1,2,3,...)
  const addSection = () => {
    const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1;
    const newSection: SectionType = {
      id: newId,
      title: `หัวข้อที่ ${newId}`,
      questions: [],
    };
    setSections([...sections, newSection]);
  };

  // ฟังก์ชันบันทึก
  const saveForm = () => {
    const formData: FormData = {
      title: formTitle,
      description: formDescription,
      sections,
      createdAt: new Date().toISOString(),
      totalSections: sections.length,
      totalQuestions: sections.reduce((t, s) => t + s.questions.length, 0),
    };
    console.log('=== FORM DATA ===', formData);
    alert(`บันทึกสำเร็จ! หัวข้อ ${formData.totalSections} คำถาม ${formData.totalQuestions}`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-200 rounded-xl px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-6 p-6">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="text-3xl font-normal w-full mb-2 text-gray-800 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg px-2 py-1 transition-all"
          placeholder="ชื่อแบบฟอร์ม"
        />
        <input
          type="text"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          className="text-gray-600 w-full border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1 transition-all"
          placeholder="คำอธิบายแบบฟอร์ม"
        />
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          sections={sections}
          setSections={setSections}
        />
      ))}

      {/* Add Section */}
      <div className="text-center mt-4">
        <button
          onClick={addSection}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> เพิ่มหัวข้อใหม่
        </button>
      </div>

      {/* Action */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          type="button"

          bgColor="#dc2626"
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          bgColor="#1E3A8A"
          onClick={saveForm}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default CreateAssessmentTeacher;
