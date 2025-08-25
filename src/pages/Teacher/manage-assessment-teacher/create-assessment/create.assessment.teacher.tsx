import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import Section from "../create-assessment/components/Section";
import { useAssessmentStore } from "../create-assessment/store/assessmentStore";
import Button from "../../../../components/Button";

const CreateAssessmentTeacher = () => {
  const {
    formTitle,
    formDescription,
    sections,
    setFormTitle,
    setFormDescription,
    setSections,
    addSection,
  } = useAssessmentStore();

  // Drag สำหรับ Section (desktop)
  const onSectionDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (type !== "SECTION") return;

    const newSections = Array.from(sections);
    const [moved] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, moved);
    setSections(newSections);
  };

  // ปุ่ม ↑ ↓ สำหรับ Section (mobile/tablet)
  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const newSections = Array.from(sections);
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    setSections(newSections);
  };

  const saveForm = () => {
    console.log("=== FORM DATA ===", {
      title: formTitle,
      description: formDescription,
      sections,
      createdAt: new Date().toISOString(),
      totalSections: sections.length,
      totalQuestions: sections.reduce((t, s) => t + s.questions.length, 0),
    });
    alert(
      `บันทึกสำเร็จ! หัวข้อ ${sections.length} คำถาม ${sections.reduce(
        (t, s) => t + s.questions.length,
        0
      )}`
    );
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

      {/* DragDropContext สำหรับ Section */}
      <DragDropContext onDragEnd={onSectionDragEnd}>
        <Droppable droppableId="sections" type="SECTION">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section, index) => (
                <Draggable
                  key={`section-${section.id}`}
                  draggableId={`section-${section.id}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-4"
                    >
                      <Section
                        section={section}
                        index={index}
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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto transition-colors"
        >
          <Plus size={20} /> เพิ่มหัวข้อใหม่
        </button>
      </div>

      {/* Action */}
      <div className="flex justify-center gap-4 mt-6">
        <Button type="button" bgColor="#dc2626">
          ยกเลิก
        </Button>
        <Button type="submit" bgColor="#1E3A8A" onClick={saveForm}>
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default CreateAssessmentTeacher;
