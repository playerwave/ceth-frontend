// src/pages/ListActivityHistoryStudent.tsx
import { useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Searchbar from "../../../../components/Searchbar";
import ActivityHistoryTableStudent from "./activity.history.table.student";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";
// import Button from "../../../../components/Button";

const ListActivityHistoryStudent = () => {
  // const navigate = useNavigate();

  const searchEndActivities = useActivityStore((s) => s.searchEndActivities);
  const fetchEndedActivities = useActivityStore((s) => s.fetchEndedActivities);
  const { user } = useAuthStore();

  // ✅ ใช้ users_id จาก auth store แทน students_id
  const studentId = useMemo(() => {
    const id = user?.student?.users_id; // ✅ เปลี่ยนจาก students_id เป็น users_id
    return typeof id === "number" && id > 0 ? id : null;
  }, [user?.student?.users_id]);

  function handleSearch(term: string) {
    if (!studentId) return; // ไม่มี id ก็ไม่ค้นหา
    searchEndActivities(term, studentId);
  }

  // ✅ เพิ่ม: Refresh activity history เมื่อ component mount
  useEffect(() => {
    if (studentId) {
      console.log("🔄 [ListActivityHistory] Refreshing activity history for student:", studentId);
      fetchEndedActivities(studentId);
    }
  }, [studentId, fetchEndedActivities]);

  // const handleClick = () => {
  //   navigate("/assessment-student");
  // };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">
        ประวัติกิจกรรม
      </h1>

      <div className="flex justify-center w-full mb-4">
        {/* ถ้าไม่มี studentId จะยังพิมพ์ค้นหาได้ แต่กดแล้วไม่ยิงค้นหา */}
        <Searchbar onSearch={handleSearch} />
      </div>

      {studentId ? (
        <ActivityHistoryTableStudent studentId={studentId} />
      ) : (
        <div className="text-center text-gray-500 py-10">
          ยังไม่พบรหัสนักศึกษาในระบบเข้าสู่ระบบ/รีเฟรชหน้าเพื่อดึงข้อมูลผู้ใช้
        </div>
      )}
    </div>
  );
};

export default ListActivityHistoryStudent;
