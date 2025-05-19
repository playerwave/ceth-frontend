import React, { useState, useEffect } from "react";
import { Box, Typography, Card, Grid, TextField, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useMainActivityStore } from "../../../stores/Student/store_main_activity_student";

import Table from "../../../components/Student/table";
import Loading from "../../../components/Loading";
import { MainActivity } from "../../../types/Student/type_main_activity_student";
import SoftHardSkillCards from "../main-student/components/SoftHardSkillCards";
import BarChartSection from "../main-student/components/BarChartSection";
import TableActivitySection from "../main-student/components/TableListSection";
const MainStudent = () => {
  const [searchId, setSearchId] = useState("");

  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
    fetchEnrolledActivities,
    enrolledActivities, // ✅ ดึง enrolledActivities มาใช้งาน
  } = useMainActivityStore();

  // ✅ อัปเดตข้อมูล Soft Skill & Hard Skill ทันทีที่มี ID

  const handleSearch = () => {
    if (searchId.trim()) {
      //   fetchActivitiesByStudentId(searchId); // ✅ ดึงกิจกรรม
      //   fetchSkillStats(searchId); // ✅ ดึงข้อมูล Soft/Hard Skill เฉพาะตอนกดปุ่มค้นหา
      console.log("📡 Fetching data for student ID:", searchId);
    }
  };

  const userId = localStorage.getItem("userId") || "8";

  useEffect(() => {
    fetchEnrolledActivities(userId).finally(() => { });
  }, []);

  useEffect(() => {
    console.log("📌 ข้อมูลกิจกรรมที่ลงทะเบียน:", enrolledActivities);
  }, [enrolledActivities]);

  const transformedActivities = enrolledActivities
    .filter((act) => act.ac_status === "Public" /* && act.state === "Enrolled" */)
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



  return (
    <Box className="justify-items-center">
      <div className="w-345 mx-auto ml-2xl mb-5 p-4 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center">หน้าหลัก</h1>
        <div className="mt-16 ml-10 flex flex-col lg:flex-row justify-between items-center ">
          {/* Soft Skill & Hard Skill */}
          <div className="flex flex-col gap-4 w-[300px]">
         
            <SoftHardSkillCards />
          </div>

          {/* Graph */}
          <div className="flex-grow flex justify-center">
          
            <BarChartSection />

          </div>
        </div>
        {/* ช่องกรอก ID และปุ่มค้นหา */}
        {/* <div className="mt-6 flex justify-center items-center gap-2 ">
          <input
            type="text"
            placeholder="กรอก ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Search />}
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            ค้นหา
          </Button>
          <p>(ใช้ทดสอบดึงข้อมูลกิจกรรมของนิสิต)</p>
        </div> */}


        <div >
         
          <TableActivitySection
            activityLoading={activityLoading}
            activityError={activityError}
            enrolledActivities={enrolledActivities}
            transformedActivities={transformedActivities}
          />
        </div>
      </div>
    </Box>
  );
};

export default MainStudent;
