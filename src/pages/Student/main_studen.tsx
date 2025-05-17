import React, { useState, useEffect } from "react";
import { Box, Typography, Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, Button } from "@mui/material";
import { People, Search } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useActivityStore } from "../../stores/store_main_student";

const MainStudent = () => {
    const [searchId, setSearchId] = useState("");
    const { activities, softSkillCount, hardSkillCount, fetchActivitiesByStudentId, fetchSkillStats, activityLoading } = useActivityStore();

    // ✅ อัปเดตข้อมูล Soft Skill & Hard Skill ทันทีที่มี ID
  


    const handleSearch = () => {
        if (searchId.trim()) {
            fetchActivitiesByStudentId(searchId); // ✅ ดึงกิจกรรม
            fetchSkillStats(searchId); // ✅ ดึงข้อมูล Soft/Hard Skill เฉพาะตอนกดปุ่มค้นหา
            console.log("📡 Fetching data for student ID:", searchId);
        }
    };
  
    useEffect(() => {
        console.log("🔄 Updated UI - softSkillCount:", softSkillCount);
        console.log("🔄 Updated UI - hardSkillCount:", hardSkillCount);
    }, [softSkillCount, hardSkillCount]);
    
    // ✅ ดึงข้อมูลสำหรับกราฟจาก Backend
    const graphData = [
        { name: "Soft Skill", value: softSkillCount },
        { name: "Hard Skill", value: hardSkillCount }
    ];

    return (
        <Box p={3} sx={{ width: "1400px", margin: "auto" }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
                หน้าหลัก
            </Typography>

            <Grid container spacing={3} mt={3}>
                {/* Soft Skill & Hard Skill */}
                <Grid item sx={{ width: "300px" }}>
                    <Card sx={{ p: 8, textAlign: "center", width: "300px", borderRadius: 3, boxShadow: 10 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Soft Skill ปัจจุบัน
                        </Typography>
                        <Typography variant="h2" color="blue" fontWeight="bold">
                            {softSkillCount ?? "⏳"}  {/* ถ้าไม่มีค่าให้แสดง ⏳ */}
                        </Typography>
                    </Card>

                    <Card sx={{ p: 7.5, textAlign: "center", mt: 8, width: "300px", borderRadius: 3, boxShadow: 10 }}>
                        <Typography variant="h6">Hard Skill ปัจจุบัน</Typography>
                        <Typography variant="h3" color="orange">
                            {hardSkillCount ?? "⏳"}  {/* ถ้าไม่มีค่าให้แสดง ⏳ */}
                        </Typography>
                    </Card>

                </Grid>

              {/* Graph */}
<Grid item sx={{ ml: "50px" }}>
    <Card sx={{ p: 5, width: "1000px", height: "500px", boxShadow: 10, borderRadius: 3, backgroundColor: "#fff", border: "2px solid #0094FF" }}>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            กราฟแสดงจำนวน Soft Skill และ Hard Skill ในแต่ละเดือน
        </Typography>
        <BarChart width={900} height={350} data={graphData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="softSkill" fill="#4169E1" name="Soft Skill" barSize={30} />
            <Bar dataKey="hardSkill" fill="#FFC107" name="Hard Skill" barSize={30} />
        </BarChart>
    </Card>
</Grid>

            </Grid>



            {/* ตารางกิจกรรม */}
            <Box mt={4} sx={{ bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 10 ,width: "1350px", height: "auto"}}>
               
                <Typography variant="h6" fontWeight="bold">สถิติกิจกรรมของฉัน</Typography>
                <TableContainer component={Paper} sx={{ width: "1300px" }}>
                    
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#1976d2" }}>

                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ชื่อกิจกรรม</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ประเภท</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>คำอธิบาย</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>วันที่</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ที่นั่ง</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activityLoading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">กำลังโหลดข้อมูล...</TableCell>
                                </TableRow>
                            )}
                            {!activityLoading && activities.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">📭 ไม่มีกิจกรรมที่ลงทะเบียน</TableCell>
                                </TableRow>
                            )}
                            {!activityLoading && activities.length > 0 && (
                                activities.map((row, index) => (

                                    <TableRow key={index}>

                                        <TableCell>{row.ac_name}</TableCell>
                                        <TableCell>
                                            <Chip label={row.ac_type} color={row.ac_type === "Hard Skill" ? "warning" : "primary"} />
                                        </TableCell>
                                        <TableCell>{row.ac_description}</TableCell>
                                        <TableCell>{row.ac_start_time} - {row.ac_end_time}</TableCell>
                                        <TableCell>{row.ac_seat} <People sx={{ fontSize: 18 }} /></TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* ช่องกรอก ID และปุ่มค้นหา */}
            <Box mt={6} display="flex" justifyContent="center" alignItems="center">
                <TextField
                    label="กรอก ID"
                    variant="outlined"
                    size="medium"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    sx={{ width: "250px", mr: 2 }}
                />
                <Button variant="contained" color="primary" startIcon={<Search />} onClick={handleSearch}>
                    ค้นหา
                </Button>
            </Box>
        </Box>
    );
};

export default MainStudent;
