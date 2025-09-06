import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import Section from "../create-assessment/components/Section";
import { useAssessmentStore } from "../create-assessment/store/assessmentStore";
import Button from "../../../../components/Button";
import assessmentService from "../../../../service/Teacher/assessment.service";

const EditAssessmentTeacher = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    formTitle,
    formDescription,
    sections,
    setFormTitle,
    setFormDescription,
    setSections,
    addSection,
  } = useAssessmentStore();

  const [loading, setLoading] = useState(false);

  // โหลดข้อมูล assessment ตาม id
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await assessmentService.getAssessmentById(Number(id));

        setFormTitle(data.assessment_name);
        setFormDescription(data.description);

        // TODO: mapping sections/questions ถ้ามีจาก backend
        setSections([
          {
            id: 1,
            title: "หัวข้อ (ยังไม่มีข้อมูลจาก backend)",
            questions: [],
          },
        ]);
      } catch (err) {
        console.error("❌ Error loading assessment:", err);
      }
    };

    fetchData();
  }, [id, setFormTitle, setFormDescription, setSections]);

  // Drag สำหรับ Section
  const onSectionDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (type !== "SECTION") return;

    const newSections = Array.from(sections);
    const [moved] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, moved);
    setSections(newSections);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const newSections = Array.from(sections);
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    setSections(newSections);
  };

  // ✅ บันทึกการแก้ไข Assessment
  const saveForm = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const payload = {
        assessment_id: Number(id),
        assessment_name: formTitle,
        description: formDescription,
        status: "Active" as const, // ✅ กำหนดสถานะ
        assessment_status: "Not finished" as const, // ✅ สมมติค่า
        last_update: new Date().toISOString(),
      };

      await assessmentService.updateAssessment(payload);

      alert("✅ แก้ไขแบบประเมินสำเร็จ!");
      navigate("/list-assessment-teacher"); // กลับหน้ารายการ
    } catch (err) {
      console.error("❌ Error updating assessment:", err);
      alert("❌ แก้ไขไม่สำเร็จ");
    } finally {
      setLoading(false);
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
        <Button
          type="button"
          bgColor="#dc2626"
          onClick={() => navigate("/teacher/assessment")}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          bgColor="#1E3A8A"
          onClick={saveForm}
          disabled={loading}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </Button>
      </div>
    </div>
  );
};

export default EditAssessmentTeacher;
