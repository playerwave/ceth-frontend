import { useNavigate } from "react-router-dom";
import SearchBar from "../../../../components/Searchbar";
import { CopyPlus } from "lucide-react";
import AssessmentTablePage from "./list.assessment.tablepage";
import { useState, useEffect } from "react";

// ✅ ใช้ store ใหม่ (SetNumber)
import { useSetNumberStore } from "../store/setNumber.store";

const ListAssessmentTeacher = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ ดึงจาก useSetNumberStore
  const {
    setNumbers,
    fetchSetNumbers,
    loading,
    error,
  } = useSetNumberStore();

  // ✅ โหลดข้อมูล SetNumber ตอน mount
  useEffect(() => {
    fetchSetNumbers();
  }, [fetchSetNumbers]);

  // ✅ ฟังก์ชันค้นหา
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // ✅ กรองข้อมูลตาม searchTerm (ค้นได้ทั้ง id และ name)
  const dataToDisplay = setNumbers.filter(
    (s) =>
      s.set_number_id?.toString().includes(searchTerm) ||
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">
        จัดการแบบประเมิน (ชุดข้อสอบ)
      </h1>

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
          เพิ่มชุดข้อสอบ <CopyPlus className="w-4 h-4" />
        </button>
      </div>

      {/* ✅ แสดงสถานะโหลด/ error */}
      {loading && <p className="text-center">กำลังโหลด...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div>
        {/* ✅ ส่ง setNumbers ไปที่ตาราง */}
        <AssessmentTablePage rows={dataToDisplay} />
      </div>
    </div>
  );
};

export default ListAssessmentTeacher;
