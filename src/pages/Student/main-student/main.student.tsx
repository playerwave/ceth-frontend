import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

import { useActivityStore } from "@/stores/Student/activity.store.student";
import { useAuthStore } from "@/stores/Visitor/auth.store";
import SoftHardSkillCards from "./components/softHardSkillCards";
import BarChartSection from "./components/barChartSection";
import TableActivitySection from "./components/tableListSection";
import TableOngoingSection from "./components/tableOngoingSection";
import ActivityTabs from "./components/activityTabs"; // ✅ Tabs
import TablePendingEvaluation from "./components/tablePendingEvaluation";
import CustomCard from "@/components/Card";
import type { Activity } from "@/types/activity.types";

type StudentEnrolledActivity = Activity & { has_submitted_assessment?: boolean };

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

  const { user, fetchMe } = useAuthStore(); // ✅ เพิ่ม fetchMe เพื่อ refresh user data
  const lastStudentIdRef = useRef<number | null>(null);
  const hasFetchedUserRef = useRef<boolean>(false); // ✅ เพิ่ม ref เพื่อป้องกันการเรียก fetchMe ซ้ำ
  
  // ใช้ students_id จาก auth store เท่านั้น
  // const studentId = useMemo(() => {
  //   console.log("🔍 studentId recalculated:", user?.student?.students_id);
  //   return user?.student?.students_id;
  // }, [user?.student?.students_id]);

  // ✅ Fetch user data ทุกครั้งที่มาหน้านี้ เพื่อให้ได้ข้อมูล soft/hard hours ล่าสุด (ไม่ใช้ cache)
  useEffect(() => {
    // ✅ ป้องกันการเรียกซ้ำ (ใช้ ref + global flag ใน store)
    if (hasFetchedUserRef.current) {
      console.log("⏭️ [MainStudent] Already fetched user data, skipping...");
      return;
    }
    
    console.log("🔄 [MainStudent] Fetching user data on mount (always fetch to get latest soft/hard hours)...");
    hasFetchedUserRef.current = true;
    
    // ✅ เรียก fetchMe (store มี global flag ป้องกันการเรียกซ้ำ)
    fetchMe().catch((error) => {
      console.error("❌ [MainStudent] Error fetching user data:", error);
      // ✅ ไม่ reset ref เพราะ store จัดการ global flag เอง
    });
    
    // ✅ Cleanup: Reset ref เมื่อ component unmount (แต่ไม่ reset global flag ใน store)
    return () => {
      hasFetchedUserRef.current = false;
    };
  }, []); // ✅ เรียกแค่ครั้งเดียวตอน mount

  // เพิ่มการฟัง events สำหรับอัพเดทข้อมูลหลังจากส่งแบบประเมิน
  useEffect(() => {
    let refreshTimeout: number | null = null;
    
    const handleAssessmentSubmitted = () => {
      console.log("🔄 [MainStudent] Assessment submitted event received, refreshing user data...");
      
      // Clear existing timeout
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      
      // ใช้ setTimeout เพื่อป้องกัน infinite loop และ debounce
      refreshTimeout = setTimeout(() => {
        console.log("🔄 [MainStudent] Executing delayed fetchMe...");
        fetchMe();
        refreshTimeout = null;
      }, 2000); // เพิ่มเวลาเป็น 2 วินาที
    };

    // ฟัง custom event ที่ส่งมาจากหน้า assessment
    window.addEventListener('assessmentSubmitted', handleAssessmentSubmitted);

    return () => {
      window.removeEventListener('assessmentSubmitted', handleAssessmentSubmitted);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
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
  }, [user?.student?.students_id]); // ✅ ลบ fetchEnrolledActivities และ fetchOngoingActivities ออกจาก dependency

  // ✅ กรองกิจกรรมที่ลงทะเบียนไว้ตาม activity_state ที่กำหนด - ต้องไม่รวม "Start Assessment"
  const filteredEnrolledActivities = enrolledActivities.filter((act) => {
    const allowedStates = [
      "Special Open Register",
      "Open Register",
      "Close Register",
    ];
    return allowedStates.includes(act.activity_state || "");
  });

  const filteredOngoingActivities = ongoingActivities.filter((act) =>
    ["Start Activity", "End Activity"].includes(act.activity_state || "")
  );

  // แปลง Activity[] เป็น MainActivity[] สำหรับ TableListSection (ไม่ใช้แล้ว ใช้ filteredEnrolledActivities แทน)
  // const mainActivities = filteredEnrolledActivities.map((act) => ({
  //   ac_id: act.activity_id,
  //   ac_name: act.activity_name || "",
  //   ac_company_lecturer: act.presenter_company_name || "",
  //   ac_description: act.description || "",
  //   ac_type: (act.type === "Soft" ? "Soft Skill" : "Hard Skill") as "Soft Skill" | "Hard Skill",
  //   ac_start_time: act.start_activity_date ? new Date(act.start_activity_date).toISOString() : new Date().toISOString(),
  //   ac_end_time: act.end_activity_date ? new Date(act.end_activity_date).toISOString() : new Date().toISOString(),
  //   ac_seat: act.seat || 0,
  //   ac_registered_count: 0, // ต้องดึงจาก database ถ้าต้องการ
  //   ac_status: act.activity_status || "Private",
  //   ac_state: "Enrolled" as "Not Start" | "Enrolled" | "Ended", // เนื่องจากเป็น enrolled activities
  //   ac_location_type: act.event_format || "Online",
  //   ac_soft_hours: act.type === "Soft" ? (act.recieve_hours || 0) : 0,
  //   ac_hard_hours: act.type === "Hard" ? (act.recieve_hours || 0) : 0,
  //   ac_start_assessment: act.start_assessment ? new Date(act.start_assessment) : null,
  //   ac_end_assessment: act.end_assessment ? new Date(act.end_assessment) : null,
  //   activity_state: act.activity_state, // ✅ เพิ่ม activity_state เพื่อให้ TablePendingEvaluation ใช้งานได้
  // }));

  // ✅ สร้างข้อมูลสำหรับตาราง "กิจกรรมที่ยังไม่ได้ทำแบบประเมิน" จากกิจกรรมที่อยู่ในสถานะ Start Assessment
  const pendingAssessmentActivities = enrolledActivities.filter(
    (act) => act.activity_state === "Start Assessment"
  );

  const allActivitiesForPending = pendingAssessmentActivities.map((act) => ({
    ac_id: act.activity_id,
    ac_name: act.activity_name || "",
    ac_company_lecturer: act.presenter_company_name || "",
    ac_description: act.description || "",
    ac_type: (act.type === "Soft" ? "Soft Skill" : "Hard Skill") as "Soft Skill" | "Hard Skill",
    ac_start_time: act.start_activity_date
      ? new Date(act.start_activity_date).toISOString()
      : new Date().toISOString(),
    ac_end_time: act.end_activity_date
      ? new Date(act.end_activity_date).toISOString()
      : new Date().toISOString(),
    ac_seat: act.seat || 0,
    ac_registered_count: 0,
    ac_status: act.activity_status || "Private",
    ac_state: "Enrolled" as "Not Start" | "Enrolled" | "Ended",
    ac_location_type: act.event_format || "Online",
    ac_soft_hours: act.type === "Soft" ? (act.recieve_hours || 0) : 0,
    ac_hard_hours: act.type === "Hard" ? (act.recieve_hours || 0) : 0,
    ac_start_assessment: act.start_assessment ? new Date(act.start_assessment) : null,
    ac_end_assessment: act.end_assessment ? new Date(act.end_assessment) : null,
    activity_state: act.activity_state,
    has_submitted_assessment:
      (act as StudentEnrolledActivity).has_submitted_assessment ?? false,
  }));

  const transformedActivities = allActivitiesForPending;

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
              <TableActivitySection filteredActivities={filteredEnrolledActivities} />
              <TableOngoingSection
                ongoingActivities={filteredOngoingActivities}
                loading={ongoingLoading}
                error={ongoingError}
              />
            </>
          ) : (
            <TablePendingEvaluation
              activityLoading={activityLoading}
              activityError={activityError}
              enrolledActivities={allActivitiesForPending}
              transformedActivities={transformedActivities}
            />
          )}
        </CustomCard>
      </div>
    </Box>
  );
};

export default MainStudent;
