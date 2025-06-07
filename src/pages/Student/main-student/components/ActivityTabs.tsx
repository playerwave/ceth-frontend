// components/Student/ActivityTabs.tsx
import React from "react";

interface Props {
  activeTab: "enrolled" | "pendingEvaluation";
  setActiveTab: (tab: "enrolled" | "pendingEvaluation") => void;
}

const ActivityTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
  <div className="flex gap-5 mt-2 ml-2 font-semibold text-[14px] sm:text-[16px] lg:text-[20px]">
  <button
    className={`relative pb-2 transition-all ${
      activeTab === "enrolled"
        ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full"
        : "text-gray-600"
    }`}
    onClick={() => setActiveTab("enrolled")}
  >
    กิจกรรมที่ลงทะเบียนไว้
  </button>

  <button
    className={`relative pb-2 transition-all ${
      activeTab === "pendingEvaluation"
        ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full"
        : "text-gray-600"
    }`}
    onClick={() => setActiveTab("pendingEvaluation")}
  >
    กิจกรรมที่ยังไม่ได้ทำแบบประเมิน
  </button>
</div>

);

};

export default ActivityTabs;
