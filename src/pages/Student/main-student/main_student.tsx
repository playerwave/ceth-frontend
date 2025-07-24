// import React, { useState, useEffect } from "react";
// import { Box, Typography, Card, Grid, TextField, Button } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { useMainActivityStore } from "../../../stores/Student/store_main_activity_student";

// import Table from "../../../components/Student/table";
// import Loading from "../../../components/Loading";
// import { MainActivity } from "../../../types/Student/type_main_activity_student";
// import SoftHardSkillCards from "../main-student/components/SoftHardSkillCards";
// import BarChartSection from "../main-student/components/BarChartSection";
// import TableActivitySection from "../main-student/components/TableListSection";
// const MainStudent = () => {
//   const [searchId, setSearchId] = useState("");

//   const {
//     activities,
//     searchResults,
//     fetchActivities,
//     searchActivities,
//     activityLoading,
//     activityError,
//     fetchEnrolledActivities,
//     enrolledActivities, // ✅ ดึง enrolledActivities มาใช้งาน
//   } = useMainActivityStore();

//   // ✅ อัปเดตข้อมูล Soft Skill & Hard Skill ทันทีที่มี ID

//   const handleSearch = () => {
//     if (searchId.trim()) {
//       //   fetchActivitiesByStudentId(searchId); // ✅ ดึงกิจกรรม
//       //   fetchSkillStats(searchId); // ✅ ดึงข้อมูล Soft/Hard Skill เฉพาะตอนกดปุ่มค้นหา
//       console.log("📡 Fetching data for student ID:", searchId);
//     }
//   };

//   const userId = localStorage.getItem("userId") || "8";

//   useEffect(() => {
//     fetchEnrolledActivities(userId).finally(() => { });
//   }, []);

//   useEffect(() => {
//     console.log("📌 ข้อมูลกิจกรรมที่ลงทะเบียน:", enrolledActivities);
//   }, [enrolledActivities]);

//   const transformedActivities = enrolledActivities
//     .filter((act) => act.ac_status === "Public" /* && act.state === "Enrolled" */)
//     .map((act) => ({
//       id: act.ac_id.toString(),
//       name: act.ac_name,
//       company_lecturer: act.ac_company_lecturer,
//       description: act.ac_description,
//       type: act.ac_type as "Soft Skill" | "Hard Skill",
//       start_time: new Date(act.ac_start_time),
//       seat: act.ac_seat,
//       status: act.ac_status as "Public" | "Private",
//       registered_count: act.ac_registered_count,
//     }));

//   return (
//     <Box className="justify-items-center">
//       <div className="w-345 mx-auto ml-2xl mb-5 p-4 min-h-screen flex flex-col">
//         <h1 className="text-3xl font-bold text-center">หน้าหลัก</h1>
//         <div className="mt-16 ml-10 flex flex-col lg:flex-row justify-between items-center ">
//           {/* Soft Skill & Hard Skill */}
//           <div className="flex flex-col gap-4 w-[300px]">

//             <SoftHardSkillCards />
//           </div>

//           {/* Graph */}
//           <div className="flex-grow flex justify-center">

//             <BarChartSection />

//           </div>
//         </div>
//         {/* ช่องกรอก ID และปุ่มค้นหา */}
//         {/* <div className="mt-6 flex justify-center items-center gap-2 ">
//           <input
//             type="text"
//             placeholder="กรอก ID"
//             value={searchId}
//             onChange={(e) => setSearchId(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<Search />}
//             onClick={handleSearch}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//           >
//             ค้นหา
//           </Button>
//           <p>(ใช้ทดสอบดึงข้อมูลกิจกรรมของนิสิต)</p>
//         </div> */}

//         <div >

//           <TableActivitySection
//             activityLoading={activityLoading}
//             activityError={activityError}
//             enrolledActivities={enrolledActivities}
//             transformedActivities={transformedActivities}
//           />
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default MainStudent;

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { useActivityStore } from "../../../stores/Student/activity.store.student";
import SoftHardSkillCards from "../main-student/components/SoftHardSkillCards";
import BarChartSection from "../main-student/components/BarChartSection";
import TableActivitySection from "../main-student/components/TableListSection";
import ActivityTabs from "../main-student/components/ActivityTabs"; // ✅ Tabs
import TablePendingEvaluation from "./components/TablePendingEvaluation";
import { useAuthStore } from "../../../stores/Visitor/auth.store";

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

  const transformedActivities = enrolledActivities
    .filter((act) => act.activity_status === "Public")
    .map((act) => ({
      id: act.activity_id.toString(),
      name: act.activity_name,
      company_lecturer: act.presenter_company_name,
      description: act.description,
      type: act.type as "Soft Skill" | "Hard Skill",
      start_time: new Date(act.start_activity_date),
      seat: act.seat,
      status: act.activity_status as "Public" | "Private",
      // registered_count: act.ac_registered_count,
    }));

  return (
    <Box className="justify-items-center">
      <div className="w-full max-w-[1400px] mx-auto mb-5 px-4 sm:px-6 py-4 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6">หน้าหลัก</h1>

        {/* Section: Soft/Hard Skill & Graph */}
        {/* <div className="mt-1 flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-6">
          <div className="flex flex-col gap-4 w-full max-w-[300px]">
            <SoftHardSkillCards />
          </div>

          <div className="w-full flex justify-center">
            <BarChartSection />
          </div>
        </div> */}

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
        <div className="flex flex-col gap-6 text-lg mt-4">
          {activeTab === "enrolled" ? (
            <TableActivitySection
              activityLoading={activityLoading}
              activityError={activityError}
              enrolledActivities={[]}
              transformedActivities={transformedActivities}
            />
          ) : (
            <TablePendingEvaluation
              activityLoading={activityLoading}
              activityError={activityError}
              enrolledActivities={[]}
              transformedActivities={transformedActivities}
            />
          )}
        </div>
      </div>
    </Box>
  );
};

export default MainStudent;
