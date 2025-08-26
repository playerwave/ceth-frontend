import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

import { useActivityStore } from "../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../stores/Visitor/auth.store";
import SoftHardSkillCards from "../main-student/components/SoftHardSkillCards";
import BarChartSection from "../main-student/components/BarChartSection";
import TableActivitySection from "../main-student/components/TableListSection";
import TableOngoingSection from "../main-student/components/TableOngoingSection";
import ActivityTabs from "../main-student/components/ActivityTabs"; // ✅ Tabs
import TablePendingEvaluation from "./components/TablePendingEvaluation";
import CustomCard from "../../../components/Card";

const MainStudent = () => {
  // const [searchId, setSearchId] = useState("");
  const [activeTab, setActiveTab] = useState<"enrolled" | "pendingEvaluation">(
    "enrolled"
  );

  const {
    fetchEnrolledActivities,
    fetchOngoingActivities,
    enrolledActivities,
    ongoingActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  // แยก loading states สำหรับแต่ละตาราง
  const [, setEnrolledLoading] = useState(false);
  const [ongoingLoading, setOngoingLoading] = useState(false);
  const [, setEnrolledError] = useState<string | null>(null);
  const [ongoingError, setOngoingError] = useState<string | null>(null);

  const { user, fetchMe } = useAuthStore();
  const lastStudentIdRef = useRef<number | null>(null);
  
  // ใช้ students_id จาก auth store หรือ fallback เป็น 3
  // const studentId = useMemo(() => {
  //   console.log("🔍 studentId recalculated:", user?.student?.students_id);
  //   return user?.student?.students_id || 3;
  // }, [user?.student?.students_id]);

  // Fetch user data on mount only if user is not authenticated
  useEffect(() => {
    if (!user || user.role === "Visitor") {
      fetchMe();
    }
  }, []); // ลบ fetchMe ออกจาก dependency array

  useEffect(() => {
    const id = user?.student?.students_id;
    const isValidId = typeof id === "number" && id > 0;
  
    console.log("🔍 [MainStudent] useEffect triggered:", {
      id,
      isValidId,
      lastStudentId: lastStudentIdRef.current,
      user: user?.student
    });
  
    if (isValidId && id !== lastStudentIdRef.current) {
      lastStudentIdRef.current = id;
      console.log("🔄 [MainStudent] Fetching data for student_id:", id);
      
      // เรียกทั้งสอง function พร้อมกัน
      const fetchData = async () => {
        try {
          console.log("🔄 [MainStudent] Starting fetchData...");
          setEnrolledLoading(true);
          setOngoingLoading(true);
          setEnrolledError(null);
          setOngoingError(null);
          
          console.log("🔄 [MainStudent] Calling fetchEnrolledActivities...");
          await fetchEnrolledActivities(id);
          console.log("✅ [MainStudent] fetchEnrolledActivities completed");
          
          console.log("🔄 [MainStudent] Calling fetchOngoingActivities...");
          await fetchOngoingActivities(id);
          console.log("✅ [MainStudent] fetchOngoingActivities completed");
          
        } catch (error) {
          console.error("❌ Error fetching data:", error);
        } finally {
          setEnrolledLoading(false);
          setOngoingLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user?.student?.students_id, fetchEnrolledActivities, fetchOngoingActivities]);

  // แปลง Activity[] เป็น MainActivity[] สำหรับ TableListSection
  const mainActivities = enrolledActivities.map((act) => ({
    ac_id: act.activity_id,
    ac_name: act.activity_name || "",
    ac_company_lecturer: act.presenter_company_name || "",
    ac_description: act.description || "",
    ac_type: (act.type === "Soft" ? "Soft Skill" : "Hard Skill") as "Soft Skill" | "Hard Skill",
    ac_start_time: act.start_activity_date ? new Date(act.start_activity_date).toISOString() : new Date().toISOString(),
    ac_end_time: act.end_activity_date ? new Date(act.end_activity_date).toISOString() : new Date().toISOString(),
    ac_seat: act.seat || 0,
    ac_registered_count: 0, // ต้องดึงจาก database ถ้าต้องการ
    ac_status: act.activity_status || "Private",
    ac_state: "Enrolled" as "Not Start" | "Enrolled" | "Ended", // เนื่องจากเป็น enrolled activities
    ac_location_type: act.event_format || "Online",
    ac_soft_hours: act.type === "Soft" ? (act.recieve_hours || 0) : 0,
    ac_hard_hours: act.type === "Hard" ? (act.recieve_hours || 0) : 0,
    ac_start_assessment: act.start_assessment ? new Date(act.start_assessment) : null,
    ac_end_assessment: act.end_assessment ? new Date(act.end_assessment) : null,
  }));

  const transformedActivities = enrolledActivities
    .filter((act) => act.activity_status === "Public")
    .map((act) => ({
      id: act.activity_id.toString(),
      name: act.activity_name,
      company_lecturer: act.presenter_company_name,
      description: act.description,
      type: act.type as "Soft Skill" | "Hard Skill",
      start_time: new Date(act.start_activity_date),
      seat: act.seat,
      status: act.activity_status as "Public" | "Private",
      // registered_count: act.ac_registered_count,
    }));

  return (
    <Box className="justify-items-center">
      <div className="w-full max-w-[1400px] mx-auto mb-5 px-4 sm:px-6 py-4 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6">หน้าหลัก</h1>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* ซ้าย: Soft/Hard Skill */}
          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[300px]">
            <SoftHardSkillCards />
          </div>

          {/* ขวา: กราฟขยายได้ */}
          <div className="flex-grow">
            <BarChartSection />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content */}
        <CustomCard className="flex flex-col gap-6 text-lg mt-4">
          {activeTab === "enrolled" ? (
            <>
              <TableActivitySection />
              <TableOngoingSection
                ongoingActivities={ongoingActivities}
                loading={ongoingLoading}
                error={ongoingError}
              />
            </>
          ) : (
            <TablePendingEvaluation
              activityLoading={activityLoading}
              activityError={activityError}
              enrolledActivities={mainActivities}
              transformedActivities={transformedActivities}
            />
          )}
        </CustomCard>
      </div>
    </Box>
  );
};

export default MainStudent;
