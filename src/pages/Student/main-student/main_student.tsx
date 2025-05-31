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

import { useMainActivityStore } from "../../../stores/Student/store_main_activity_student";
import SoftHardSkillCards from "../main-student/components/SoftHardSkillCards";
import BarChartSection from "../main-student/components/BarChartSection";
import TableActivitySection from "../main-student/components/TableListSection";
import PendingEvaluation from "../main-student/components/PendingEvaluation";
import ActivityTabs from "../main-student/components/ActivityTabs"; // ✅ Tabs

const MainStudent = () => {
  const [searchId, setSearchId] = useState("");
  const [activeTab, setActiveTab] = useState<"enrolled" | "pendingEvaluation">("enrolled"); // ✅ Tab state

  const {
    fetchEnrolledActivities,
    enrolledActivities,
    activityLoading,
    activityError,
  } = useMainActivityStore();

  const userId = localStorage.getItem("userId") || "8";

  useEffect(() => {
    fetchEnrolledActivities(userId);
  }, []);

  const mockPendingActivities = [
  {
    id: 1,
    company: "Clicknext",
    type: "Soft Skill",
    name: "อบรมการทำงานเป็นทีมอย่างมืออาชีพ",
    endDate: "2025-06-01T13:00:00",
    registered: "50/50",
  },
  {
    id: 2,
    company: "SCG",
    type: "Hard Skill",
    name: "เวิร์กช็อปเขียนโปรแกรม IoT",
    endDate: "2025-06-10T16:00:00",
    registered: "35/40",
  },
  {
    id: 3,
    company: "Google Thailand",
    type: "Soft Skill",
    name: "พัฒนาทักษะการสื่อสารเพื่อ Presentation",
    endDate: "2025-05-30T09:30:00",
    registered: "60/60",
  },
  {
    id: 4,
    company: "Bitkub",
    type: "Hard Skill",
    name: "เรียนรู้การลงทุน Crypto เบื้องต้น",
    endDate: "2025-06-05T14:00:00",
    registered: "20/25",
  },
  {
    id: 5,
    company: "Workpoint",
    type: "Soft Skill",
    name: "คิดอย่างสร้างสรรค์ในยุคดิจิทัล",
    endDate: "2025-06-15T10:00:00",
    registered: "45/50",
  },
  {
    id: 6,
    company: "Tesla",
    type: "Hard Skill",
    name: "พื้นฐานการสร้างรถยนต์ไฟฟ้า",
    endDate: "2025-06-08T15:00:00",
    registered: "10/15",
  },
  {
    id: 7,
    company: "LINE",
    type: "Soft Skill",
    name: "ทักษะการทำงานในองค์กรญี่ปุ่น",
    endDate: "2025-05-29T13:00:00",
    registered: "40/40",
  },
  {
    id: 8,
    company: "Apple",
    type: "Hard Skill",
    name: "ออกแบบ UX/UI ให้โดนใจผู้ใช้",
    endDate: "2025-06-12T14:00:00",
    registered: "30/35",
  },
  {
    id: 9,
    company: "Accenture",
    type: "Soft Skill",
    name: "ทักษะผู้นำในโลกแห่งอนาคต",
    endDate: "2025-06-18T11:00:00",
    registered: "25/30",
  },
  {
    id: 10,
    company: "Amazon Web Services",
    type: "Hard Skill",
    name: "Cloud Computing สำหรับมือใหม่",
    endDate: "2025-06-20T16:00:00",
    registered: "18/20",
  },
];
  

  const transformedActivities = enrolledActivities
    .filter((act) => act.ac_status === "Public")
    .map((act) => ({
      id: act.ac_id.toString(),
      name: act.ac_name,
      company_lecturer: act.ac_company_lecturer,
      description: act.ac_description,
      type: act.ac_type as "Soft Skill" | "Hard Skill",
      start_time: new Date(act.ac_start_time),
      seat: act.ac_seat,
      status: act.ac_status as "Public" | "Private",
      registered_count: act.ac_registered_count,
    }));

  const pendingEvaluationData = enrolledActivities
    .filter(
      (act) =>
        act.ac_status === "Public" &&
        act.ac_evaluation_status === "NotEvaluated"
    )
    .map((act, index) => ({
      id: index + 1,
      company: act.ac_company_lecturer || "ไม่ระบุ",
      type: act.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
      name: act.ac_name,
      endDate: act.ac_end_evaluation_time || act.ac_end_time,
      registered: `${act.ac_registered_count}/${act.ac_seat}`,
    }));

  return (
    <Box className="justify-items-center">
      <div className="w-345 mx-auto ml-2xl mb-5 p-4 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center">หน้าหลัก</h1>

        {/* Section: Soft/Hard Skill & Graph */}
        <div className="mt-16 ml-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col gap-4 w-[300px]">
            <SoftHardSkillCards />
          </div>
          <div className="flex-grow flex justify-center">
            <BarChartSection />
          </div>
        </div>
        <br />
        <br />

        {/* Tabs */}
        <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="flex gap-6 text-lg mt-2 ml-10">
          {activeTab === "enrolled" ? (
            <TableActivitySection
              activityLoading={activityLoading}
              activityError={activityError}
              enrolledActivities={enrolledActivities}
              transformedActivities={transformedActivities}
            />
          ) : (
            <PendingEvaluation data={mockPendingActivities} />

          )}
        </div>
      </div>
    </Box>
  );
};

export default MainStudent;
