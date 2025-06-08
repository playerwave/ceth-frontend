import { useEffect, useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
<<<<<<<< HEAD:src/pages/Student/activity-student/list_activity_admin/list_activity_student.tsx
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
========
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActivityStore } from "../../../../stores/Admin/activity_list_store";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import Table from "./components/table";

import { isSameSearchTerm, filterActivitiesByStatus } from "./utils/activity";

const ManageActivityAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
>>>>>>>> 2d3a72fd0b30ee0fcde9a173e70a2ab8635a1f34:src/pages/Admin/activity-admin/list_activity_admin/list_activity_admin.tsx
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");

<<<<<<<< HEAD:src/pages/Student/activity-student/list_activity_admin/list_activity_student.tsx
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
========
  // โหลดกิจกรรมเมื่อ mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // ข้อมูลที่จะโชว์ตามผลค้นหา หรือทั้งหมด
  const displayedActivities = searchResults ?? activities;

  // แยกกิจกรรมตามสถานะ
  const activitiesSuccess = displayedActivities.filter(
    (a) => a.status === "Public"
  );
  const activitiesOngoing = displayedActivities.filter(
    (a) => a.status === "Private"
  );

  // ค้นหา ไม่ค้นซ้ำคำเดิม
  const handleSearch = (term: string) => {
    if (term.trim() === searchTerm.trim()) return;
>>>>>>>> 2d3a72fd0b30ee0fcde9a173e70a2ab8635a1f34:src/pages/Admin/activity-admin/list_activity_admin/list_activity_admin.tsx
    setSearchTerm(term);
    searchActivities(term);
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการกิจกรรม</h1>

<<<<<<<< HEAD:src/pages/Student/activity-student/list_activity_admin/list_activity_student.tsx
      <div className="flex justify-center items-center w-full mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-between items-center mb-6">
========
      <div className="flex justify-center mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* แท็บเลือกโหมด */}
>>>>>>>> 2d3a72fd0b30ee0fcde9a173e70a2ab8635a1f34:src/pages/Admin/activity-admin/list_activity_admin/list_activity_admin.tsx
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

        {/* ปุ่มเพิ่มกิจกรรม */}
        <button
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
          onClick={() =>
            navigate("/create-activity-admin", { state: { reload: true } })
          }
        >
          เพิ่ม <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

<<<<<<<< HEAD:src/pages/Student/activity-student/list_activity_admin/list_activity_student.tsx
========
      {/* แสดงผล Loading, Error หรือข้อมูลตามเงื่อนไข */}
>>>>>>>> 2d3a72fd0b30ee0fcde9a173e70a2ab8635a1f34:src/pages/Admin/activity-admin/list_activity_admin/list_activity_admin.tsx
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
<<<<<<<< HEAD:src/pages/Student/activity-student/list_activity_admin/list_activity_student.tsx
        <Table title="กิจกรรมสหกิจ" data={activitiesFilter} />
========
        <>
          <Table title="กิจกรรมสหกิจ" data={activitiesSuccess} />
          <Table title="กิจกรรมสหกิจที่ร่าง" data={activitiesOngoing} />
        </>
>>>>>>>> 2d3a72fd0b30ee0fcde9a173e70a2ab8635a1f34:src/pages/Admin/activity-admin/list_activity_admin/list_activity_admin.tsx
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
