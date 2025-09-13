import { useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
// import Loading from "../../../../components/Loading";
// import CustomCard from "../../../../components/Card";
import TableListRow from "./TableListRow";
import { getTableListColumn } from "./TableListColumn";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

interface TableListSectionProps {
  filteredActivities?: any[]; // ✅ เพิ่ม prop สำหรับข้อมูลที่กรองแล้ว
}

export default function TableListSection({ filteredActivities }: TableListSectionProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const columns = getTableListColumn({
    enableTypeFilter: true,
    selectedTypes,
    handleTypeChange,
  });

  // 👉 ดึงจาก store
  const {
    enrolledActivities,
    fetchEnrolledActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const { user, isAuthenticated, authLoading } = useAuthStore();
  const studentId = user?.student?.students_id; // ใช้ students_id เท่านั้น

  console.log("🔍 [DEBUG] TableListSection - user:", user);
  console.log("🔍 [DEBUG] TableListSection - studentId:", studentId);
  console.log("🔍 [DEBUG] TableListSection - user.student:", user?.student);
  console.log("🔍 [DEBUG] TableListSection - user.student?.students_id:", user?.student?.students_id);
  console.log("🔍 [DEBUG] TableListSection - isAuthenticated:", isAuthenticated);
  console.log("🔍 [DEBUG] TableListSection - authLoading:", authLoading);

  // 👉 โหลดข้อมูลครั้งแรก
  useEffect(() => {
    console.log("🔍 [DEBUG] TableListSection useEffect - studentId:", studentId);
    console.log("🔍 [DEBUG] TableListSection useEffect - isAuthenticated:", isAuthenticated);
    console.log("🔍 [DEBUG] TableListSection useEffect - authLoading:", authLoading);
    
    // รอให้ authentication เสร็จก่อน
    if (isAuthenticated && !authLoading && studentId) {
      console.log("📞 [DEBUG] Calling fetchEnrolledActivities with studentId:", studentId);
      
      // เพิ่ม delay เล็กน้อยเพื่อให้แน่ใจว่า component mount เสร็จแล้ว
      const timer = setTimeout(() => {
        fetchEnrolledActivities(studentId).catch((error) => {
          console.error("❌ [DEBUG] Error in fetchEnrolledActivities:", error);
        });
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (isAuthenticated && !authLoading && !studentId) {
      console.log("⚠️ [DEBUG] No student ID available - user may not be a student");
    }
  }, [studentId, isAuthenticated, authLoading, fetchEnrolledActivities]); // เพิ่ม dependencies

  console.log("🔍 [DEBUG] TableListSection render - enrolledActivities:", enrolledActivities);
  console.log("🔍 [DEBUG] TableListSection render - activityLoading:", activityLoading);
  console.log("🔍 [DEBUG] TableListSection render - activityError:", activityError);
  console.log("🔍 [DEBUG] TableListSection render - enrolledActivities length:", enrolledActivities?.length);
  console.log("🔍 [DEBUG] TableListSection render - enrolledActivities is array:", Array.isArray(enrolledActivities));
  
  // Debug: แสดงสถานะปัจจุบัน
  console.log("🔍 [DEBUG] Current state summary:", {
    loading: activityLoading,
    error: activityError,
    hasData: enrolledActivities && enrolledActivities.length > 0,
    dataLength: enrolledActivities?.length || 0,
    studentId
  });

  // ✅ ใช้ข้อมูลที่กรองแล้วถ้ามี หรือใช้ข้อมูลจาก store เป็น fallback
  const activitiesToShow = filteredActivities || enrolledActivities;
  
  console.log("🔍 [DEBUG] TableListSection - filteredActivities:", filteredActivities);
  console.log("🔍 [DEBUG] TableListSection - activitiesToShow:", activitiesToShow);
  console.log("🔍 [DEBUG] TableListSection - activitiesToShow length:", activitiesToShow?.length);

  return (
    <div>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ลิสต์กิจกรรมของฉัน ({activitiesToShow?.length || 0} รายการ)
      </Typography>

      {activityLoading ? (
        <Box className="text-center p-4">
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 1 }}>
            กำลังโหลดกิจกรรม...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            กรุณารอสักครู่
          </Typography>
        </Box>
      ) : activityError ? (
        <div className="text-center text-red-500 p-4">
          <p>❌ เกิดข้อผิดพลาด: {activityError}</p>
          <button 
            onClick={() => studentId && fetchEnrolledActivities(studentId)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ลองใหม่
          </button>
        </div>
      ) : !activitiesToShow || activitiesToShow.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <p>📭 ไม่พบกิจกรรมที่ลงทะเบียน</p>
          <p className="text-sm mt-2">Student ID: {studentId}</p>
          <button 
            onClick={() => studentId && fetchEnrolledActivities(studentId)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            โหลดใหม่
          </button>
        </div>
      ) : (
        <TableListRow
          columns={columns}
          rows={activitiesToShow}     // ✅ ใช้ข้อมูลที่กรองแล้ว
          height={420}
          width="100%"
          initialPageSize={10}
          selectedTypes={selectedTypes}
        />
      )}
    </div>
  );
}
