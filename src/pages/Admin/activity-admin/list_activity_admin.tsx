import { useEffect, useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActivityStore } from "../../../stores/Admin/activity_store";
import { useNavigate, useLocation } from "react-router-dom";

// Import Component
import Loading from "../../../components/Loading";
import SearchBar from "../../../components/Searchbar";
import Table from "../../../components/Admin/ActivityTable/table";

const ManageActivityAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");

  // ✅ โหลดกิจกรรมครั้งแรกเท่านั้น
  // useEffect(() => {
  //   if (activities.length === 0) {
  //     fetchActivities();
  //   }
  // }, []);

  // // ✅ รีเฟรชข้อมูลแค่ครั้งเดียวหลังจากเพิ่มกิจกรรมใหม่
  // useEffect(() => {
  //   if (location.state?.reload) {
  //     fetchActivities(); // โหลดข้อมูลใหม่
  //     navigate(location.pathname, { replace: true }); // ล้างค่า `state`
  //   }
  // }, [location, navigate]);

  useEffect(() => {
    fetchActivities(); // ✅ โหลดข้อมูลใหม่ทุกครั้งเมื่อเปิดหน้านี้
  }, []);

  const displayedActivities = searchResults ?? activities;
  const activitiesSuccess = displayedActivities.filter(
    (a) => a.status === "Public"
  );
  const activitiesOngoing = displayedActivities.filter(
    (a) => a.status === "Private"
  );

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    if (term !== searchTerm) {
      // ✅ เช็คว่าไม่ใช่ค่าซ้ำ
      setSearchTerm(term);
      searchActivities(term);
    }
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการกิจกรรม</h1>

      <div className="flex justify-center items-center w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-between items-center mb-4 mt-5">
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

        <button
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded flex items-center gap-2 transition hover:bg-blue-700"
          onClick={() =>
            navigate("/create-activity-admin", { state: { reload: true } })
          }
        >
          เพิ่ม <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* ✅ แสดง Loading อยู่กลางจอ แต่ไม่ทับ Navbar */}
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
        <>
          <Table title="กิจกรรมสหกิจ" data={activitiesSuccess} />
          <Table title="กิจกรรมสหกิจที่ร่าง" data={activitiesOngoing} />
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
