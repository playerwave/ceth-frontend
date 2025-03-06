import { useEffect, useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
import SearchBar from "../../../components/search_bar";
import Table from "../../../components/Admin/ActivityTable/table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActivityStore } from "../../../stores/Admin/activity_store";
import { useNavigate } from "react-router-dom";

const ManageActivityAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");

  // ✅ เรียก API เพื่อโหลดกิจกรรมครั้งแรก
  useEffect(() => {
    console.log("📡 กำลังเรียก fetchActivities...");
    fetchActivities();
  }, [fetchActivities]);

  console.log("✅ ข้อมูลกิจกรรมที่ได้รับจาก Store:", activities);

  // ✅ ใช้ค่าจากการค้นหาก่อน ถ้าไม่มีให้ใช้ activities ปกติ
  const displayedActivities = searchResults ?? activities;
  const activitiesSuccess = displayedActivities.filter(
    (a) => a.status === "Public"
  );
  const activitiesOngoing = displayedActivities.filter(
    (a) => a.status === "Private"
  );

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการกิจกรรม</h1>

      {/* ✅ SearchBar ใช้งานฟังก์ชัน searchActivities */}
      <SearchBar onSearch={searchActivities} />

      {/* ✅ แท็บ ลิสต์ / ปฏิทิน */}
      <div className="flex justify-between items-center mb-4 mt-5">
        {/* 🔹 กลุ่มปุ่ม ลิสต์ & ปฏิทิน */}
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

        {/* 🔹 ปุ่มเพิ่ม (อยู่ขวาสุด) */}
        <button
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded flex items-center gap-2 transition hover:bg-blue-700"
          onClick={() => navigate("/add-activity")}
        >
          เพิ่ม <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* ✅ แสดงผลลัพธ์ตามการค้นหา */}
      {activeTab === "list" ? (
        <>
          {activityLoading ? (
            <p className="text-center text-gray-500 p-4">
              ⏳ กำลังโหลดข้อมูล...
            </p>
          ) : activityError ? (
            <p className="text-center text-red-500 p-4">
              ❌ เกิดข้อผิดพลาด: {activityError}
            </p>
          ) : displayedActivities.length === 0 ? (
            <p className="text-center text-gray-500 p-4">
              📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
            </p>
          ) : (
            <>
              <Table title="กิจกรรมสหกิจ" data={activitiesSuccess} />
              <Table title="กิจกรรมสหกิจที่ร่าง" data={activitiesOngoing} />
            </>
          )}
        </>
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
