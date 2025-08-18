import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { useActivityStore } from "../../../stores/Student/activity.store.student";
import SoftHardSkillCards from "../main-student/components/SoftHardSkillCards";
import BarChartSection from "../main-student/components/BarChartSection";
import TableActivitySection from "../main-student/components/TableListSection";
import ActivityTabs from "../main-student/components/ActivityTabs"; // ✅ Tabs
import TablePendingEvaluation from "./components/TablePendingEvaluation";
import { useAuthStore } from "../../../stores/Visitor/auth.store";
import CustomCard from "../../../components/Card";

const MainStudent = () => {
  const [searchId, setSearchId] = useState("");
  const [activeTab, setActiveTab] = useState<"enrolled" | "pendingEvaluation">(
    "enrolled"
  );

  const {
    fetchEnrolledActivities,
    enrolledActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  // แปลง userId จาก localStorage (string) เป็น number
  const { user } = useAuthStore(); // หรือ context ที่เก็บ user login
  const userId = user?.userId;

  useEffect(() => {
    if (userId) {
      fetchEnrolledActivities(userId);
    }
  }, [userId, fetchEnrolledActivities]);

  useEffect(() => {
    console.log("📌 ข้อมูลกิจกรรมที่ลงทะเบียน:", enrolledActivities);
  }, [enrolledActivities]);
  

  return (
    <Box className="justify-items-center">
      <div className="w-full max-w-[1400px] mx-auto mb-5 px-4 sm:px-6 py-4 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6">หน้าหลัก</h1>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* ซ้าย: Soft/Hard Skill */}
          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[300px]">
            <SoftHardSkillCards />
          </div>

          {/* ขวา: กราฟขยายได้ */}
          <div className="flex-grow">
            <BarChartSection />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content */}
          <CustomCard className="flex flex-col gap-6 text-lg mt-4">
          {activeTab === "enrolled" ? (
            <TableActivitySection
            />
          ) : (
            <TablePendingEvaluation
            />
          )}
        </CustomCard>
      </div>
    </Box>
  );
};

export default MainStudent;
