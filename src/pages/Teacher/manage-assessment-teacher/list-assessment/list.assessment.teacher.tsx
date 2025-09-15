import { useNavigate } from "react-router-dom";
import SearchBar from "../../../../components/Searchbar";
// import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher"; // ❌ ไม่จำเป็นแล้ว
import { useAssessmentStore } from "../../../../stores/Teacher/assessment.store"; // ✅ นำเข้า useAssessmentStore
import { CopyPlus } from "lucide-react";
import AssessmentTablePage from "./list.assessment.tablepage"
import { useState, useEffect } from "react"; // ✅ เพิ่ม useEffect

const ListAssessmentTeacher = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ ดึงฟังก์ชัน fetchAssessments และ searchAssessments จาก useAssessmentStore
  const {
    fetchAssessments,
    searchAssessments,
    searchResults, // ✅ ดึง searchResults มาใช้
    assessments, // ✅ ดึง assessments (ข้อมูลทั้งหมด) มาใช้
    assessmentLoading, // ✅ ดึง loading state
    assessmentError, // ✅ ดึง error state
  } = useAssessmentStore();

  // ✅ ใช้ useEffect เพื่อโหลดข้อมูลทั้งหมดเมื่อ component mount
  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]); // เพิ่ม fetchAssessments ใน dependency array

  const handleSearch = (term: string) => {
    // ตรวจสอบว่า term มีการเปลี่ยนแปลงจริงๆ ก่อนที่จะ search
    if (term.trim() === searchTerm.trim()) return;

    setSearchTerm(term);
    searchAssessments?.(term); // ✅ เรียกใช้ searchAssessments จาก useAssessmentStore
  };

  // ✅ กำหนดข้อมูลที่จะส่งให้ AssessmentTablePage
  // ถ้ามี searchResults ให้ใช้ searchResults ถ้าไม่มีให้ใช้ assessments (ข้อมูลทั้งหมด)
  const dataToDisplay = searchResults !== null ? searchResults : assessments;
  
  // ✅ Debug logs
  console.log("🔍 [ListAssessmentTeacher] assessmentLoading:", assessmentLoading);
  console.log("🔍 [ListAssessmentTeacher] assessmentError:", assessmentError);
  console.log("🔍 [ListAssessmentTeacher] assessments:", assessments);
  console.log("🔍 [ListAssessmentTeacher] searchResults:", searchResults);
  console.log("🔍 [ListAssessmentTeacher] dataToDisplay:", dataToDisplay);

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">จัดการแบบประเมิน</h1>

      <div className="flex justify-center w-full mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-end w-full mb-4">
        <button
          className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90"
          onClick={() =>
            navigate("/create-assessment-teacher", { state: { reload: true } })
          }
        >
          เพิ่มแบบประเมิน <CopyPlus className="w-4 h-4" />
        </button>
      </div>

      <div>
        {/* ✅ แสดง loading state */}
        {assessmentLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-blue-600">กำลังโหลดข้อมูล...</div>
          </div>
        )}
        
        {/* ✅ แสดง error state */}
        {assessmentError && (
          <div className="flex justify-center items-center py-8">
            <div className="text-red-600 bg-red-100 px-4 py-2 rounded">
              {assessmentError}
            </div>
          </div>
        )}
        
        {/* ✅ ส่ง dataToDisplay (ผลการค้นหาหรือข้อมูลทั้งหมด) ไปให้ AssessmentTablePage */}
        {!assessmentLoading && !assessmentError && (
          <AssessmentTablePage rows={dataToDisplay} />
        )}
      </div>
    </div>
  );
};

export default ListAssessmentTeacher;