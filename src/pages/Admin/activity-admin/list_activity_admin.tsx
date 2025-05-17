import { useEffect, useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
import SearchBar from "../../../components/search_bar";
import Table from "../../../components/table";
// import TableHeader from "../../../components/table_header";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppStore } from "../../../stores/Test/store_test";
import { useNavigate } from "react-router-dom";

const ManageActivityAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { activities, fetchActivities, activityLoading, activityError } =
    useAppStore();
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");

  useEffect(() => {
    console.log("📡 กำลังเรียก fetchActivities...");
    fetchActivities();
  }, [fetchActivities]);

  console.log("✅ ข้อมูลกิจกรรมที่ได้รับจาก Store:", activities);

  // const handleRowClick = (activityId: string) => {
  //   navigate(`/activity/${activityId}`);
  // };

  const activitiesSuccess = activities.filter((a) => a.status === "Public");
  const activitiesOngoing = activities.filter((a) => a.status === "Private");

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการกิจกรรม</h1>

      <SearchBar />

      <div className="flex justify-end">
        <button
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded flex items-center gap-2 transition hover:bg-blue-700"
          onClick={() => navigate("/add-activity")}
        >
          เพิ่ม <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <div className="flex mb-4">
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
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 p-4">📭 ไม่มีกิจกรรม</p>
          ) : (
            <>
              <Table
                title="กิจกรรมสหกิจ"
                data={activitiesSuccess}
                // onRowClick={handleRowClick}
              />
              <Table
                title="กิจกรรมสหกิจที่ร่าง"
                data={activitiesOngoing}
                // onRowClick={handleRowClick}
              />
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
