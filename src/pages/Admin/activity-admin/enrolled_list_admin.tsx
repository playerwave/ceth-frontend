import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useActivityStore } from "../../../stores/Admin/activity_store";
import { useParams } from "react-router-dom";

export default function enrolled_list_admin() {
  const { id } = useParams<{ id: string }>();
  const activityId = Number(id); // แปลงเป็นตัวเลข
  const {
    activity,
    fetchActivity,
    enrolledStudents,
    fetchEnrolledStudents,
    isLoading,
  } = useActivityStore();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("list");

  // ✅ โหลด activity ก่อน แล้วค่อยดึง enrolledStudents เมื่อ activity มีค่าที่ถูกต้อง
  useEffect(() => {
    if (!isNaN(activityId) && activityId > 0) {
      fetchActivity(activityId).then(() => {
        if (activity) {
          fetchEnrolledStudents(activityId);
        }
      });
    }
  }, [activityId, fetchActivity]);

  // ✅ ตรวจสอบว่า activity โหลดเสร็จก่อน แล้วค่อยโหลด enrolledStudents
  useEffect(() => {
    if (activity && activity.ac_id === activityId) {
      fetchEnrolledStudents(activityId);
    }
  }, [activity, fetchEnrolledStudents]);

  const filteredStudents = (enrolledStudents || []).filter((student) => {
    return (
      (selectedDepartments.length === 0 ||
        selectedDepartments.includes(student.department)) &&
      (selectedStatus.length === 0 ||
        selectedStatus.includes(student.status)) &&
      (selectedTab !== "partial" || student.checkOut === "No") && // แสดงเฉพาะ checkOut === "No" ถ้าเลือก "นิสิตเข้าร่วมไม่เต็มเวลา"
      (selectedTab !== "no-eval" || student.evaluated === "No") // แสดงเฉพาะ evaluated === "No" ถ้าเลือก "นิสิตไม่ทำแบบประเมิน"
    );
  });

  return (
    <div>
      <h1>Enrolled List</h1>
    </div>
  );
}

export default enrolled_list_admin;
