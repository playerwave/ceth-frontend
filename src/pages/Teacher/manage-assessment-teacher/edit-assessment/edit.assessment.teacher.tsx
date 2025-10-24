import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { TextField } from "@mui/material";
import Section from "../create-assessment/components/section";
import { useAssessmentStoreUi } from "../create-assessment/store/assessmentStore";
import assessmentService from "@/service/Teacher/assessment.service";
import { useSetNumberStore } from "@/stores/Teacher/setNumberStore";
import Loading from "@/components/Loading";

const EditAssessmentTeacher = () => {
  const { id } = useParams<{ id: string }>();
  const { createSetNumber } = useSetNumberStore();
  const {
    formTitle,
    formDescription,
    sections,          // ✅ ใช้ sections จาก store
    setFormTitle,
    setFormDescription,
    setSections,

  } = useAssessmentStoreUi();

  const [loading] = useState<boolean>(false);
  const { setNumbers, fetchSetNumbersByAssessment } = useSetNumberStore();
  const handleAddSection = async () => {
    if (!id) return;

    const newSec = await createSetNumber({
      name: "หัวข้อใหม่",
      status: "Active",
      assessment_id: Number(id),
    });

    if (newSec) {
      setSections([
        ...sections,
        {
          id: newSec.set_number_id,
          title: newSec.name || "",
          questions: [],
        },
      ]);
    }
  };

  // โหลดข้อมูล assessment + setNumbers ตาม id
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await assessmentService.getAssessmentById(Number(id));

        setFormTitle(data?.assessment_name ?? "");
        setFormDescription(data?.description ?? "");

        await fetchSetNumbersByAssessment(Number(id));
      } catch (err) {
        console.error("❌ Error loading assessment:", err);
      }
    };

    fetchData();
  }, [id, setFormTitle, setFormDescription, fetchSetNumbersByAssessment]);




  const handleBlurUpdate = async () => {
    if (!id) return;
    try {
      const payload = {
        assessment_id: Number(id),
        assessment_name: formTitle,       // ✅ ใช้ state ปัจจุบันเลย
        description: formDescription,
        status: "Active" as const,
        assessment_status: "Not finished" as const,
        last_update: new Date(),
      };

      await assessmentService.updateAssessment(payload);
      console.log("✅ Auto update success!", payload);
    } catch (err) {
      console.error("❌ Error auto updating assessment:", err);
    }
  };


  // ✅ sync setNumbers → sections ของ store
  useEffect(() => {
    console.log("🚀 useEffect triggered, setNumbers length:", setNumbers.length);
    if (setNumbers.length > 0) {
      const newSections = setNumbers.map((sn) => ({
        id: sn.set_number_id,
        title: sn.name || "",
        questions: [],
      }));
      console.log("📋 New sections to set:", newSections.map(s => ({ id: s.id, title: s.title })));
      
      setSections(newSections);
      
      console.log("✅ setSections called");
    }
  }, [setNumbers]); // ✅ เอา sections ออกจาก dependency เพื่อป้องกัน infinite loop

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

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto bg-gray-200 rounded-xl px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="block font-semibold mb-2 text-gray-700">ชื่อแบบฟอร์ม *</label>
            <TextField
              name="formTitle"
              placeholder="ชื่อแบบฟอร์ม"
              value={formTitle ?? ""}
              onChange={(e) => setFormTitle(e.target.value)}   // 🔹 UI เปลี่ยนทันที
              onBlur={handleBlurUpdate}                        // 🔹 ยิง API แค่ตอนหลุดโฟกัส
              className="w-full"
              sx={{ 
                height: "56px",
                "& .MuiOutlinedInput-root": {
                  fontSize: "1.125rem", // text-lg equivalent
                  fontWeight: "normal"
                }
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="block font-semibold mb-2 text-gray-700">คำอธิบายแบบฟอร์ม</label>
            <TextField
              name="formDescription"
              placeholder="คำอธิบายแบบฟอร์ม"
              value={formDescription ?? ""}
              onChange={(e) => setFormDescription(e.target.value)}   // 🔹 UI เปลี่ยนทันที
              onBlur={handleBlurUpdate}                              // 🔹 ยิง API แค่ตอนหลุดโฟกัส
              className="w-full"
              sx={{ 
                height: "56px",
                "& .MuiOutlinedInput-root": {
                  fontSize: "1rem", // text-base equivalent
                  color: "#6B7280" // text-gray-500 equivalent
                }
              }}
            />
          </div>
        </div>
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
                        mode="edit"   // ✅ บอกว่าโหมดแก้ไข
                        dragHandleProps={provided.dragHandleProps}
                        onMoveUp={() => { }}
                        onMoveDown={() => { }}
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
        <div className="text-center mt-4">
          <button
            onClick={handleAddSection}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto transition-colors"
          >
            <Plus size={20} /> เพิ่มหัวข้อใหม่
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditAssessmentTeacher;
