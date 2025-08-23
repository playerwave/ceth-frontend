// src/pages/VisitorActivityList.tsx (ปรับปรุง)

import { useEffect, useState } from "react";
import { useActivityVisitorStore } from "../../../stores/Visitor/activity.store.visitor";
import Loading from "../../../components/Loading";
import SearchBar from "../../../components/Searchbar";
import ActivityTablePage from "./ActivityTablePageVIsiter";

const VisitorActivityList: React.FC = () => {
  const { activities, fetchPublicActivities, activityLoading, activityError } =
    useActivityVisitorStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPublicActivities();
  }, [fetchPublicActivities]);

  const activitiesForDisplay = activities;

  const displayedActivities = activitiesForDisplay.filter((a) => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return (
      a.activity_name?.toLowerCase().normalize("NFC").includes(lowerSearch) ||
      a.activity_id?.toString().includes(lowerSearch)
      // คุณสามารถเพิ่ม field อื่นๆ ที่ต้องการค้นหาได้ที่นี่ เช่น description, organizer
      // a.description?.toLowerCase().normalize("NFC").includes(lowerSearch) ||
      // a.organizer?.toLowerCase().normalize("NFC").includes(lowerSearch)
    );
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">
        กิจกรรมสหกิจ (สำหรับผู้เยี่ยมชม)
      </h1>

      {/* Search bar */}
      <div className="flex justify-center w-full mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Tabs */}
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
        </div>
      </div>

      {/* Content */}
      {activityLoading ? (
        <div className="fixed inset-0 flex justify-center ml-10 items-center bg-white bg-opacity-50 z-40">
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
        <ActivityTablePage rows1={displayedActivities} />
      ) : null}
    </div>
  );
};

export default VisitorActivityList;
