import { useEffect, useState, useMemo, useRef } from "react";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import { AlarmClockPlus } from "lucide-react";
import ActivityTablePageStudent from "./ActivityTablePageStuden"; // ตรวจสอบชื่อไฟล์ให้ตรง ActivityTablePageStudent.tsx
// import CalculateDialog from "./components/CalculateDialog";
// import { useAuth } from "../../../../hooks/useAuth";
import { isRecommended } from "./utils.ts/activity";
// import { Activity } from "../../../../types/model";

const ListActivityStudent: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchMe } = useAuthStore();
  const lastStudentIdRef = useRef<number | null>(null);
  
  // ✅ ใช้ students_id จาก auth store
  const studentId = useMemo(() => {
    const id = user?.student?.students_id;
    console.log("🔍 [DEBUG] Current student ID:", id);
    return id;
  }, [user?.student?.students_id]);

  const {
    activities: allPublicActivities,
    fetchStudentActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  // const [enrolledActivities, setEnrolledActivities] = useState<Activity[]>([]);

  const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
    "list"
  );
  const [searchTerm, setSearchTerm] = useState("");
  // const [openDialog, setOpenDialog] = useState(false);

  // ✅ Fetch user data on mount และเมื่อ user เปลี่ยน
  useEffect(() => {
    console.log("🔍 [DEBUG] Initial useEffect - user:", user);
    console.log("🔍 [DEBUG] User role:", user?.role);
    
    // ถ้าไม่มี user หรือเป็น Visitor หรือไม่มี student data ให้ fetch
    if (!user || user.role === "Visitor" || !user.student) {
      console.log("🔍 [DEBUG] Fetching user data...");
      fetchMe();
    }
  }, [fetchMe, user]); // เพิ่ม dependencies

  // ✅ useEffect สำหรับ fetch กิจกรรมเมื่อมี student ID
  useEffect(() => {
    const id = user?.student?.students_id;
    const isValidId = typeof id === "number" && id > 0;
  
    console.log("🔍 [DEBUG] useEffect triggered:", { 
      id, 
      isValidId, 
      lastStudentIdRef: lastStudentIdRef.current,
      user: user?.student 
    });
  
    if (isValidId && id !== lastStudentIdRef.current) {
      lastStudentIdRef.current = id;
      console.log("📞 [DEBUG] Calling fetchStudentActivities with id:", id);
      fetchStudentActivities(id);
    } else if (!isValidId) {
      console.log("🔍 [DEBUG] No valid student ID - waiting for user data");
    }
  }, [user?.student?.students_id, fetchStudentActivities]);

  // ✅ Force fetch เมื่อ component mount
  useEffect(() => {
    if (studentId && typeof studentId === "number" && studentId > 0) {
      console.log("🔍 [DEBUG] Force fetch on mount with student ID:", studentId);
      fetchStudentActivities(studentId);
    }
  }, [studentId, fetchStudentActivities]);

  // ✅ เพิ่ม useEffect เพื่อ debug และ force fetch
  useEffect(() => {
    console.log("🔍 [DEBUG] User state changed:", user);
    console.log("🔍 [DEBUG] Student data:", user?.student);
    console.log("🔍 [DEBUG] Student ID:", user?.student?.students_id);
    
    // ถ้ามี user แต่ไม่มี student data ให้ fetch ใหม่
    if (user && !user.student) {
      console.log("🔍 [DEBUG] User exists but no student data - fetching again");
      fetchMe();
    }
  }, [user, fetchMe]);



  // กรองกิจกรรมตาม searchTerm เท่านั้น
  const publicActivities = useMemo(() => {
    console.log("🔍 [DEBUG] publicActivities useMemo - allPublicActivities:", allPublicActivities);
    console.log("🔍 [DEBUG] publicActivities useMemo - searchTerm:", searchTerm);
    
    // ตรวจสอบว่า allPublicActivities เป็น array ที่ถูกต้อง
    if (!allPublicActivities || !Array.isArray(allPublicActivities)) {
      console.warn("⚠️ [DEBUG] allPublicActivities is not a valid array:", allPublicActivities);
      return [];
    }
    
    let filtered = allPublicActivities;

    if (searchTerm.trim()) {
      filtered = filtered.filter((a) =>
        a.activity_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    console.log("🔍 [DEBUG] publicActivities useMemo - filtered result:", filtered);
    return filtered; // ✅ ลบ .filter((a) => a.activity_status === "Public") ออก
  }, [allPublicActivities, searchTerm]);

  const recommendedActivities = useMemo(() => {
    return publicActivities.filter(isRecommended);
  }, [publicActivities]);

  const handleTabChange = (tab: "list" | "calendar" | "recommend") => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">
        จัดการกิจกรรม
      </h1>

      {/* Search bar */}
      <div className="flex justify-center w-full mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Tabs + Action Button */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex space-x-4">
          {(["list", "calendar", "recommend"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-lg font-semibold flex items-center ${
                activeTab === tab
                  ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {
                {
                  list: "ลิสต์",
                  calendar: "ปฏิทิน",
                  recommend: "กิจกรรมที่แนะนำ",
                }[tab]
              }
            </button>
          ))}
        </div>

        <div className="flex justify-end">
        {activeTab === "recommend" && ( 
          <button
          className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90 transition"
          onClick={() =>
            activeTab === "recommend"
              ? console.log("Dialog would open here")
              : navigate("/create-activity-admin", {
                  state: { reload: true },
                })
          }
        >
          <>
              คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
            </>
          {/* {activeTab === "recommend" ? (
            <>
              คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
            </>
          ) : (
            <div className="hidden"></div>

          )} */}
        </button>
         )}
        </div>
      </div>

      {/* Content */}
      {activityLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
          <Loading />
        </div>
      ) : activityError ? (
        <p className="text-center text-red-500 p-4">
          ❌ เกิดข้อผิดพลาด: {activityError}
        </p>
      ) : activeTab === "list" && (!publicActivities || publicActivities.length === 0) ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "recommend" && (!recommendedActivities || recommendedActivities.length === 0) ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "list" ? (
        <ActivityTablePageStudent rows1={publicActivities || []} rows2={[]} />
      ) : activeTab === "recommend" ? (
        <ActivityTablePageStudent rows1={[]} rows2={recommendedActivities || []} />
      ) : (
        <div className="text-center text-gray-500 p-6">
          <h2 className="text-xl font-semibold">
            📅 โหมดปฏิทิน (ยังไม่รองรับ)
          </h2>
        </div>
      )}

      {/* Calculate Dialog */}
      {/* <CalculateDialog
        open={openDialog}
        onClose={() => console.log("Dialog would close here")}
        currentSkillHours={{
          hard: 0,
          soft: 0,
        }}
        selectedActivities={[]}
      /> */}
    </div>
  );
};

export default ListActivityStudent;
