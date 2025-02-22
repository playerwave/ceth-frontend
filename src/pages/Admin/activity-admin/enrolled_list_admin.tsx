import { useState } from "react";
import { FaList, FaCalendar } from "react-icons/fa";
import SearchBar from "../../../components/search_bar";
import Table from "../../../components/table";
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // ✅ นำเข้าไอคอน
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListActivityAdmin: React.FC = () => {
  interface Activity {
    name: string;
    type: "Hard Skill" | "Soft Skill";
    date: string;
    time: string;
    slots: string;
    status: "Public" | "Private";
  }

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");

  const activitiesSuccess: Activity[] = [
    {
      name: "Clicknext",
      type: "Hard Skill",
      date: "06/03/2025",
      time: "13:00 - 16:00",
      slots: "50/50",
      status: "Public",
    },
    {
      name: "Clicknext",
      type: "Hard Skill",
      date: "13/02/2025",
      time: "13:00 - 16:00",
      slots: "15/50",
      status: "Public",
    },
    {
      name: "Clicknext",
      type: "Soft Skill",
      date: "12/03/2025",
      time: "13:00 - 16:00",
      slots: "15/50",
      status: "Public",
    },
  ];

  const activitiesOngoing: Activity[] = [
    {
      name: "Clicknext",
      type: "Soft Skill",
      date: "12/03/2024",
      time: "13:00 - 16:00",
      slots: "15/50",
      status: "Private",
    },
    {
      name: "Alicknext",
      type: "Soft Skill",
      date: "09/03/2024",
      time: "13:00 - 16:00",
      slots: "40/50",
      status: "Private",
    },
    {
      name: "Clicknext",
      type: "Hard Skill",
      date: "01/03/2024",
      time: "13:00 - 16:00",
      slots: "3/50",
      status: "Private",
    },
  ];

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการกิจกรรม</h1>
      {/* แถบค้น */}
      <div className="w-full">
        <SearchBar />
      </div>
      {/* ปุ่มเพิ่ม */}
      <div className="flex justify-end">
        <button className="bg-[#1E3A8A] text-white px-4 py-2 rounded flex items-center gap-2 transition">
          เพิ่ม <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* ✅ แท็บ "ลิสต์" และ "ปฏิทิน" */}
      <div className="flex border-b mb-4">
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

      {/* ✅ แสดงเนื้อหาตามแท็บที่เลือก */}
      {activeTab === "list" ? (
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

export default ListActivityAdmin;
