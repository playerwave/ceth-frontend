import { useEffect, useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActivityStore } from "../../../stores/Student/activity_student.store";
import { useNavigate, useLocation } from "react-router-dom";

// Import Component
import Loading from "../../../components/Loading";
import SearchBar from "../../../components/Searchbar";
import Table from "../../../components/Student/table";

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
    fetchStudentActivities,
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

  const userId = localStorage.getItem("userId") || "8";
  const [showRecommendModal, setShowRecommendModal] = useState(false); // ✅ NEW: modal toggle

  useEffect(() => {
    if (userId) {
      fetchStudentActivities(userId);
    } // ✅ โหลดข้อมูลใหม่ทุกครั้งเมื่อเปิดหน้านี้
  }, []);

  const displayedActivities = searchResults ?? activities;
  const activitiesFilter = displayedActivities.filter(
    (a) => a.status === "Public" && a.seat !== a.registered_count
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
      <h1 className="text-center text-2xl font-bold mb-4">กิจกรรม</h1>

      <div className="flex justify-center items-center w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-end items-center mb-4 mt-5">
        <button
          onClick={() => setShowRecommendModal(true)} // ✅ เปิด modal
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded flex items-center gap-2 transition hover:bg-blue-700"
        >
          แนะนำกิจกรรม
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
          <Table title="กิจกรรมสหกิจ" data={activitiesFilter} />
        </>
      ) : (
        <div className="text-center text-gray-500 p-6">
          <h2 className="text-xl font-semibold">
            📅 โหมดปฏิทิน (ยังไม่มีข้อมูล)
          </h2>
        </div>
      )}
      {showRecommendModal && (
        <>
          {/* Overlay โปร่งเบลอ */}
          <div
            className="fixed inset-0 bg-black/30  z-40"
            onClick={() => setShowRecommendModal(false)}
          />

          {/* Modal Box */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-[#C2C5D2] w-full max-w-5xl rounded-4xl shadow-xl p-10 relative">
              {/* หัวข้อ */}
              <h2 className="text-xl font-bold text-center mb-6 text-[25px]">
                แนะนำรายการกิจกรรมที่ควรลง
              </h2>

              {/* รายการกิจกรรม */}
              <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-2 mb-2">
                {/* กิจกรรมที่ 1 */}
                <div className="flex items-center justify-between bg-white rounded-full px-6 py-4 shadow">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">Clicknext</p>
                    <span className="bg-yellow-100 text-[#FFAE00] text-sm font-medium px-2 py-1 rounded-full">
                      Hard Skill
                    </span>
                    <p>Participating in cooperative education activities</p>
                  </div>
                  <div className="text-sm ">
                    12/09/2024 - 09.00 - 16.00 PM
                    <span className="text-black font-medium ml-7">
                      ชั่วโมงที่ได้รับ 6 ชั่วโมง
                    </span>
                  </div>
                </div>

                {/* กิจกรรมที่ 2 */}
                <div className="flex items-center justify-between bg-white rounded-full px-6 py-4 shadow">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">Clicknext</p>
                    <span className="bg-blue-100 text-[#0900FF] text-sm font-medium px-2 py-1 rounded-full">
                      Soft Skill
                    </span>
                    <p>Participating in cooperative education activities</p>
                  </div>
                  <div className="text-sm">
                    12/09/2024 - 09.00 - 16.00 PM
                    <span className="text-black font-medium ml-7">
                      ชั่วโมงที่ได้รับ 3 ชั่วโมง
                    </span>
                  </div>
                </div>
              </div>

              {/* สรุปข้อมูลด้านล่าง */}
              <div className="-mt-20 flex items-stretch gap-3 h-full">
                {/* ชั่วโมงปัจจุบัน */}
                <div className="flex flex-col w-[220px] min-h-[200px] justify-end">
                  <p className="text-base font-semibold mb-2 text-center">
                    ชั่วโมงปัจจุบัน
                  </p>
                  <div className="bg-white rounded-full px-6 py-3 h-[67px] shadow flex justify-between w-full">
                    {/* Hard Skill */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-yellow-100 text-[#FFAE00] px-2 py-0.5 rounded-full mb-1">
                        Hard Skill
                      </span>
                      <p className="text-lg font-bold leading-none">
                        0 <span className="text-sm text-green-600">+6</span>
                      </p>
                    </div>
                    {/* Soft Skill */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-indigo-100 text-[#0900FF] px-2 py-0.5 rounded-full mb-1">
                        Soft Skill
                      </span>
                      <p className="text-lg font-bold  leading-none">
                        15 <span className="text-sm text-green-600">+3</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* ชั่วโมงหลังจากลงกิจกรรม */}
                <div className="flex flex-col w-[220px] min-h-[200px] justify-end">
                  <p className="text-base font-semibold mb-2 text-center">
                    ชั่วโมงหลังจากลงกิจกรรม
                  </p>
                  <div className="bg-white rounded-full px-6 py-3 h-[67px] shadow flex justify-between w-full">
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-yellow-100 text-[#FFAE00] px-2 py-0.5 rounded-full mb-1">
                        Hard Skill
                      </span>
                      <p className="text-lg font-bold leading-none">
                        6
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-indigo-100 text-[#0900FF] px-2 py-0.5 rounded-full mb-1">
                        Soft Skill
                      </span>
                      <p className="text-lg font-bold leading-none">
                        18
                      </p>
                    </div>
                  </div>
                </div>

                {/* คะแนนความเสี่ยง */}
                <div className="flex flex-col w-[220px] min-h-[200px] justify-end">
                  <p className="text-base font-semibold mb-2 text-center">
                    คะแนนความเสี่ยง
                  </p>
                  <div className="bg-white rounded-full px-6 py-3 h-[67px] shadow flex justify-between w-full">
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full mb-1">
                        Before
                      </span>
                      <p className="text-lg font-bold  leading-none">
                        40 <span className="text-sm text-green-600">-10</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-1">
                        After
                      </span>
                      <p className="text-lg font-bold leading-none">
                        30
                      </p>
                    </div>
                  </div>
                </div>

                {/* ปุ่มปิด */}
                <div className="flex flex-col w-[220px] min-h-[200px] justify-end items-end">
                  <button
                    onClick={() => setShowRecommendModal(false)}
                    className="bg-red-500 hover:bg-red-600 text-white text-lg font-medium w-[150px] px-6 py-2 rounded-full transition"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageActivityAdmin;
