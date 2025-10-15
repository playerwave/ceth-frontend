import { useEffect, useState, useMemo, useRef } from "react";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import { AlarmClockPlus } from "lucide-react";
import ActivityTablePageStudent from "./ActivityTablePageStuden"; // ตรวจสอบชื่อไฟล์ให้ตรง ActivityTablePageStudent.tsx
import StudentActivityCalendar from "./components/activityCarlendar";
// import CalculateDialog from "./components/CalculateDialog";
// import { useAuth } from "../../../../hooks/useAuth";
import { isRecommended } from "./utils.ts/activity";
// import { Activity } from "../../../../types/model";

const ListActivityStudent: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchMe } = useAuthStore();
  const lastStudentIdRef = useRef<number | null>(null);
  const triedFetchMeRef = useRef(false);
  
  // ใช้ students_id จาก auth store หรือ fallback เป็น 3
  // const studentId = useMemo(() => {
  //   return user?.student?.students_id || 3;
  // }, [user?.student?.students_id]);

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

  // ลบการเรียก fetchMe ออก เพราะ main.student.tsx เรียกแล้ว
  // useEffect(() => {
  //   if (triedFetchMeRef.current) return;
  //   if (!user || !user.student) {
  //     triedFetchMeRef.current = true;
  //     fetchMe();
  //   }
  // }, [user?.student]);

  useEffect(() => {
    const id = user?.student?.students_id;
    const isValidId = typeof id === "number" && id > 0;
  
    console.log("🔍 [ListActivity] useEffect triggered:", {
      id,
      isValidId,
      lastStudentId: lastStudentIdRef.current,
      user: user?.student
    });
  
    if (isValidId && id !== lastStudentIdRef.current) {
      lastStudentIdRef.current = id;
      console.log("🔄 [ListActivity] Fetching activities for student_id:", id);
      fetchStudentActivities(id);
    }
  }, [user?.student?.students_id, fetchStudentActivities]);



  // กรองกิจกรรมตาม searchTerm เท่านั้น
  const publicActivities = useMemo(() => {
    if (!allPublicActivities || !Array.isArray(allPublicActivities)) {
      return [];
    }
    
    if (searchTerm.trim()) {
      return allPublicActivities.filter((a) =>
        a.activity_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }
    
    return allPublicActivities;
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
      ) : activeTab === "calendar" ? (
        <div className="flex justify-center">
          <StudentActivityCalendar />
        </div>
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
