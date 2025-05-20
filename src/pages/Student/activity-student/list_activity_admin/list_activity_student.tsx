import { useEffect, useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
import { useActivityStore } from "../../../../stores/Student/activity_list_studen";
import { useNavigate, useLocation } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import Table from "../../../../components/Student/table";

import {
  filterAvailablePublicActivities,
  isSameSearchTerm,
} from "./utils.ts/activity";

const ManageActivityAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activities,
    searchResults,
    searchActivities,
    activityLoading,
    activityError,
    fetchStudentActivities,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("userId") || "8";

  // โหลดกิจกรรมนิสิตเมื่อ mount หน้านี้
  useEffect(() => {
    if (userId) {
      fetchStudentActivities(userId);
    }
  }, [userId, fetchStudentActivities]);

  // ใช้ utils แยก logic กรองกิจกรรม
  const displayedActivities = searchResults ?? activities;
  const activitiesFilter = filterAvailablePublicActivities(displayedActivities);

  // ใช้ utils ตรวจว่า term ซ้ำหรือไม่
  const handleSearch = (term: string) => {
    if (isSameSearchTerm(term, searchTerm)) return;
    setSearchTerm(term);
    searchActivities(term);
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">กิจกรรม</h1>

      <div className="flex justify-center items-center w-full mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "list"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("list")}
          >
            <FaList className="inline mr-2" /> ลิสต์
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "calendar"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            <FaCalendar className="inline mr-2" /> ปฏิทิน
          </button>
        </div>
      </div>

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
        <Table title="กิจกรรมสหกิจ" data={activitiesFilter} />
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

export default ManageActivityAdmin;
