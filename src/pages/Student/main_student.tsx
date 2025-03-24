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
import { useActivityStore } from "../../stores/Student/activity_student.store";
import Table from "../../components/Student/table";
import Loading from "../../components/Loading";

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
  } = useActivityStore();

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
    fetchEnrolledActivities(userId).finally(() => {});
  }, []);

  useEffect(() => {
    console.log("📌 ข้อมูลกิจกรรมที่ลงทะเบียน:", enrolledActivities);
  }, [enrolledActivities]);

  const transformedActivities = enrolledActivities
    .filter((act) => act.ac_status === "Public")
    .map((act) => ({
      id: act.ac_id.toString(), // ✅ แปลง id เป็น string
      name: act.ac_name || "ไม่มีชื่อกิจกรรม",
      company_lecturer: act.ac_company_lecturer || "ไม่มีข้อมูลบริษัท",
      description: act.ac_description || "",
      type: act.ac_type || "Soft Skill",
      start_time: new Date(act.ac_start_time), // ✅ แปลงเป็น Date object
      seat: act.ac_seat || 0,
      status: act.ac_status || "Public",
      registered_count: act.ac_registered_count || 0,
    }));

  return (
    <Box className="justify-items-center">
      <div className="w-345 mx-auto ml-2xl mb-5 p-4 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center">หน้าหลัก</h1>
        <div className="mt-16 ml-10 flex flex-col lg:flex-row justify-between items-center ">
          {/* Soft Skill & Hard Skill */}
          <div className="flex flex-col gap-4 w-[300px]">
            <Card
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 3,
                boxShadow: 10,
                width: "300px",
                height: "220px",
              }}
            >
              <h2 className="text-lg font-bold mb-5">Soft Skill ปัจจุบัน</h2>
              <p className="text-4xl font-bold text-blue-600">5</p>
            </Card>

            <Card
              sx={{
                p: 7.5,
                textAlign: "center",
                mt: { xs: 3, md: 4, lg: 5 }, // ลดระยะห่างของ Card สองอัน
                borderRadius: 3,
                boxShadow: 10,
                width: "300px",
                height: "220px",
              }}
            >
              <h2 className="text-lg font-bold mb-5">Hard Skill ปัจจุบัน</h2>
              <p className="text-4xl font-bold text-orange-500">7</p>
            </Card>
          </div>

          {/* Graph */}
          <div className="flex-grow flex justify-center">
            <Card
              sx={{
                p: 5,
                width: "100%",
                maxWidth: { xs: "100%", md: "900px", lg: "950px" }, // ปรับขนาดให้เล็กลงเล็กน้อย
                height: "500px",
                boxShadow: 10,
                borderRadius: 3,
                backgroundColor: "#fff",
              }}
            >
              <h2 className="text-lg font-bold text-center mb-4">
                กราฟแสดงจำนวน Soft Skill และ Hard Skill ในแต่ละเดือน
              </h2>
              <BarChart
                width={800}
                height={350}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="softSkill"
                  fill="#4169E1"
                  name="Soft Skill"
                  barSize={30}
                />
                <Bar
                  dataKey="hardSkill"
                  fill="#FFC107"
                  name="Hard Skill"
                  barSize={30}
                />
              </BarChart>
            </Card>
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

        <div className="flex justify-center mt-4 lg:mt-6">
          <Card
            sx={{
              p: 5,
              width: "95%", // ✅ ปรับให้สัมพันธ์กับ Layout
              maxWidth: "1310px", // ✅ ทำให้พอดีกับ Card ด้านบน
              height: "auto", // ✅ ทำให้สูงตามเนื้อหา
              minHeight: "500px", // ✅ ป้องกันไม่ให้เตี้ยเกินไป
              boxShadow: 10,
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
            className="ml-4 mt-5"
          >
            <h1 className="text-xl font-semibold">ลิสต์กิจกรรมของฉัน</h1>

            {activityLoading ? (
              <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
                <Loading />
              </div>
            ) : activityError ? (
              <p className="text-center text-red-500 p-4">
                ❌ เกิดข้อผิดพลาด: {activityError}
              </p>
            ) : enrolledActivities.length === 0 ? (
              <p className="text-center text-gray-500 p-4">📭 ไม่พบกิจกรรม</p>
            ) : (
              <Table title="" data={transformedActivities} />
            )}
          </Card>
        </div>
      </div>
    </Box>
  );
};

export default MainStudent;
