import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import Section from "./components/section";
import { useAssessmentStoreUi } from "../create-assessment/store/assessmentStore";
import Button from "@/components/Button";
import assessmentService from "@/service/Teacher/assessment.service";
import { Question } from "@/types/assessment/question.type";
import { useEffect } from "react";

// แปลง type จาก frontend → backend
const mapFrontendToBackend = (frontendType: string): Question["question_type"] => {
  switch (frontendType) {
    case "choice": return "Single answer";
    case "checkbox": return "Multiple answer";
    case "text": return "Text answer";
    case "rating": return "Fix Single answer";
    default: return "Single answer";
  }
};

const CreateAssessmentTeacher = () => {
  const {
    formTitle,
    formDescription,
    sections,
    setFormTitle,
    setFormDescription,
    setSections,
    addSection,
  } = useAssessmentStoreUi();

  // drag section (desktop)
  const onSectionDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (type !== "SECTION") return;

    const newSections = Array.from(sections);
    const [moved] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, moved);
    setSections(newSections);
  };
  useEffect(() => {
    setFormTitle("แบบประเมินใหม่");
    setFormDescription("คำอธิบายแบบประเมิน");
    setSections([
      {
        id: 0, // dummy id
        title: "หัวข้อที่ 1",
        questions: [
          {
            id: 0, // dummy id
            type: "choice",
            question: "คำถามตัวอย่าง",
            options: [
              { choice_id: 0, choice_text: "ตัวเลือก 1" },
              { choice_id: 1, choice_text: "ตัวเลือก 2" },
            ],
            required: false,
          },
        ],
      },
    ]);
  }, [setFormTitle, setFormDescription, setSections]);


  // move section (mobile)
  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const newSections = Array.from(sections);
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    setSections(newSections);
  };

  // ✅ บันทึกทั้งก้อน
  const saveForm = async () => {
    try {
      const payload = {
        assessment_name: formTitle,
        description: formDescription,
        assessment_status: "Not finished" as const,
        status: "Active" as const,
        create_date: new Date().toISOString(),
        last_update: new Date().toISOString(),
        sections: sections.map((section) => ({
          name: section.title,
          status: "Active",
          questions: section.questions.map((q, i) => ({
            question_text: q.question,
            question_number: i + 1,
            question_type: mapFrontendToBackend(q.type),
            choices: q.options.map((opt, j) => ({
              choice_text: typeof opt === "string" ? opt : opt.choice_text,  // ✅ fix
              choice_number: j + 1,
            })),
          })),

        })),
      };

      await assessmentService.createAssessmentFull(payload);

      alert("✅ สร้างแบบประเมินสำเร็จ!");
    } catch (err) {
      console.error("❌ Error creating assessment:", err);
      alert("❌ สร้างแบบประเมินไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-200 rounded-xl px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="text-3xl font-normal w-full mb-2 border border-transparent focus:border-blue-500 rounded-lg px-2 py-1"
          placeholder="ชื่อแบบฟอร์ม"
        />
        <input
          type="text"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          className="text-gray-600 w-full border border-transparent focus:border-blue-400 rounded-lg px-2 py-1"
          placeholder="คำอธิบายแบบฟอร์ม"
        />
      </div>

      {/* Sections */}
      <DragDropContext onDragEnd={onSectionDragEnd}>
        <Droppable droppableId="sections" type="SECTION">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section, index) => (
                <Draggable key={`section-${section.id}`} draggableId={`section-${section.id}`} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="mb-4">
                      <Section
                        section={section}
                        index={index}
                        mode="create"   // ✅ โหมด create
                        dragHandleProps={provided.dragHandleProps}
                        onMoveUp={() => moveSection(index, index - 1)}
                        onMoveDown={() => moveSection(index, index + 1)}
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

      {/* Add Section */}
      <div className="text-center mt-4">
        <button
          onClick={addSection}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <Plus size={20} /> เพิ่มหัวข้อใหม่
        </button>
      </div>

      {/* Action */}
      <div className="flex justify-center gap-4 mt-6">
        <Button type="button" bgColor="#dc2626">ยกเลิก</Button>
        <Button type="submit" bgColor="#1E3A8A" onClick={saveForm}>บันทึก</Button>
      </div>
    </div>
  );
};

export default CreateAssessmentTeacher;
