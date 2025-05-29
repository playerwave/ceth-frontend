import { useEffect, useState } from "react";
import { useActivityStore } from "../../../../stores/Admin/activity_list_store";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import { AlarmClockPlus, CopyPlus } from "lucide-react";
import ActivityTablePageStuden from "./ActivityTablePageStuden";

const ManageActivityStuden: React.FC = () => {
  const navigate = useNavigate();
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
    mockActivities,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
    "list"
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const displayedActivities = searchResults ?? activities;

  const activitiesStuden = displayedActivities.filter(
    (a) => a.status === "Public"
  );

  const activitiesStudenRecommend = mockActivities.filter(
    (a) => a.status === "Public"
  );

  const handleSearch = (term: string) => {
    if (term.trim() === searchTerm.trim()) return;
    setSearchTerm(term);
    searchActivities(term);
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

      {/* Tabs + Add Button */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-lg font-semibold flex items-center ${
              activeTab === "list"
                ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("list")}
          >
            ลิสต์
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold flex items-center ${
              activeTab === "calendar"
                ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            ปฏิทิน
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold flex items-center ${
              activeTab === "recommend"
                ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("recommend")}
          >
            กิจกรรมที่แนะนำให้ลงทะเบียน
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className="w-full md:w-auto max-w-xs sm:max-w-sm bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center justify-center gap-2 hover:brightness-90 transition"
            onClick={() =>
              activeTab === "recommend"
                ? console.log("คำนวณกิจกรรมที่แนะนำ") // ใส่ฟังก์ชันจริงตรงนี้
                : navigate("/create-activity-admin", {
                    state: { reload: true },
                  })
            }
          >
            {activeTab === "recommend" ? (
              <>
                คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
              </>
            ) : (
              <>
                เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
              </>
            )}
          </button>
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
      ) : displayedActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "list" ? (
        <ActivityTablePageStuden
          rows1={activitiesStuden}
          rows2={[]} // ✅ ให้มีค่าเริ่มต้น
        />
      ) : activeTab === "recommend" ? (
        <ActivityTablePageStuden
          rows1={[]} // ✅ ไม่ใช้ก็ส่ง [] ไป
          rows2={activitiesStudenRecommend}
        />
      ) : (
        <div className="text-center text-gray-500 p-6">
          <h2 className="text-xl font-semibold">
            📅 โหมดปฏิทิน (ยังไม่มีข้อมูล)
          </h2>
        </div>
      )}
    </div>
  );
};

export default ManageActivityStuden;
