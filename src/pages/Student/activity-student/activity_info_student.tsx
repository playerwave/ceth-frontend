import { useEffect, useState } from "react";
import SearchBar from "../../../components/Iist_Actitity_Student/search_bar_student";
import Table from "../../../components/Iist_Actitity_Student/table_student";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppStore } from "../../../stores/Test/store_test_student";
import { useNavigate } from "react-router-dom";

const ManageActivityStudent: React.FC = () => {
  const navigate = useNavigate();
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
  } = useAppStore();

  const [activeTab] = useState<"list" | "calendar">("list");

  // ✅ เรียก API เพื่อโหลดกิจกรรมครั้งแรก
  useEffect(() => {
    console.log("📡 กำลังเรียก fetchActivities...");
    fetchActivities();
  }, [fetchActivities]);

  console.log("✅ ข้อมูลกิจกรรมที่ได้รับจาก Store:", activities);

  // ✅ ใช้ค่าจากการค้นหาก่อน ถ้าไม่มีให้ใช้ activities ปกติ
  const displayedActivities = searchResults ?? activities;

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">กิจกรรม</h1>

      {/* ✅ SearchBar ใช้งานฟังก์ชัน searchActivities */}
      <SearchBar onSearch={searchActivities} />
      <div className="flex justify-end mb-4 mt-5">
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
              <Table title="กิจกรรมสหกิจ" data={displayedActivities} />
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

export default ManageActivityStudent;
