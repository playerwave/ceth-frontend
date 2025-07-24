import { useEffect, useState, useMemo } from "react";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import { AlarmClockPlus, CopyPlus } from "lucide-react";
import ActivityTablePageStudent from "./ActivityTablePageStuden"; // ตรวจสอบชื่อไฟล์ให้ตรง ActivityTablePageStudent.tsx
import CalculateDialog from "./components/CalculateDialog";
// import { useAuth } from "../../../../hooks/useAuth";
import { isRecommended } from "./utils.ts/activity";
import { Activity } from "../../../../types/model";

const ListActivityStudent: React.FC = () => {
  const navigate = useNavigate();
  const userId = 14;

  const {
    activities: allPublicActivities,
    fetchStudentActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const [enrolledActivities, setEnrolledActivities] = useState<Activity[]>([]);

  const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
    "list"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchStudentActivities(userId);
  }, [fetchStudentActivities, userId]);

  // กรองกิจกรรมตาม searchTerm เท่านั้น
  const publicActivities = useMemo(() => {
    let filtered = allPublicActivities;

    if (searchTerm.trim()) {
      filtered = filtered.filter((a) =>
        a.activity_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

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
              ? setOpenDialog(true)
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
      ) : activeTab === "list" && publicActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "recommend" && recommendedActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "list" ? (
        <ActivityTablePageStudent rows1={publicActivities} rows2={[]} />
      ) : activeTab === "recommend" ? (
        <ActivityTablePageStudent rows1={[]} rows2={recommendedActivities} />
      ) : (
        <div className="text-center text-gray-500 p-6">
          <h2 className="text-xl font-semibold">
            📅 โหมดปฏิทิน (ยังไม่รองรับ)
          </h2>
        </div>
      )}

      {/* Calculate Dialog */}
      <CalculateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        currentSkillHours={{
          hard: enrolledActivities.reduce(
            (sum, a) => sum + (a.type === "Hard" ? a.recieve_hours : 0),
            0
          ),
          soft: enrolledActivities.reduce(
            (sum, a) => sum + (a.type === "Soft" ? a.recieve_hours : 0),
            0
          ),
        }}
        selectedActivities={enrolledActivities}
      />
    </div>
  );
};

export default ListActivityStudent;
