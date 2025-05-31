// components/Student/ActivityTabs.tsx
import React from "react";

interface Props {
  activeTab: "enrolled" | "pendingEvaluation";
  setActiveTab: (tab: "enrolled" | "pendingEvaluation") => void;
}

const ActivityTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-6 text-lg mt-2 ml-10 font-semibold">
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
