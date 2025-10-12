import React from "react";
import SummaryActivityCard from "./components/summaryActivityCard";
import RiskStatusCard from "./components/riskStatusCard";

const TeacherDashboardMain: React.FC = () => {
  return (
    <div className="font-pt-sans w-full max-w-7xl mx-auto overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6">
        {/* การ์ดข้างบน (สูงกว่า) */}
        <div className="min-h-[460px]">
          <SummaryActivityCard />
        </div>

        {/* การ์ดข้างล่าง (เตี้ยกว่า) */}
        <div className="min-h-[360px]">
          <RiskStatusCard />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardMain;
