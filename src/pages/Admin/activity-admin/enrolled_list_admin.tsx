import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useActivityStore } from "../../../stores/Admin/activity_store";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button";

export default function enrolled_list_admin() {
  const { id } = useParams<{ id: string }>();
  const activityId = Number(id); // แปลงเป็นตัวเลข
  const {
    activity,
    fetchActivity,
    enrolledStudents,
    fetchEnrolledStudents,
    activityLoading,
  } = useActivityStore();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("list");

  console.log(id);

  // ✅ โหลด activity แล้วจะ trigger การโหลดนักศึกษาโดยอัตโนมัติ
  useEffect(() => {
    if (!isNaN(activityId) && activityId > 0) {
      fetchActivity(activityId);
    }
  }, [activityId]);

  // ✅ เมื่อ activity ใน store เปลี่ยนแล้วถึงจะเรียก fetchEnrolledStudents
  useEffect(() => {
    console.log("🔍 useEffect: activity = ", activity);
    console.log("🔍 useEffect: activityId = ", typeof activityId);

    if (activity && parseInt(activity.id) === activityId) {
      console.log("🎯 Calling fetchEnrolledStudents with:", activityId);
      fetchEnrolledStudents(activityId);
    } else {
      console.log("⚠️ Not calling because condition failed");
    }
  }, [activity, activityId, fetchEnrolledStudents]);

  const filteredStudents = enrolledStudents.filter((student) => {
    // 🔁 ใส่เงื่อนไข filter ของคุณที่นี่ หรือ return true ไปก่อน
    return true;
  });

  return (
    <div className="p-6 w-320 h-230 mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">รายชื่อนิสิตที่ลงทะเบียน</h1>

      {/* 🔹 เมนูตัวเลือก */}
      <div className="flex gap-6 text-lg pb-2">
        {[
          { key: "list", label: "ลิสต์" },
          { key: "partial", label: "นิสิตเข้าร่วมไม่เต็มเวลา" },
          { key: "no-eval", label: "นิสิตไม่ทำแบบประเมิน" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`relative pb-2 transition-all ${
              selectedTab === tab.key
                ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* กรอบทั้งหมด */}
      <div className="p-0 w-full h-[510px] border border-gray-300 shadow-md rounded-lg flex flex-col">
        {/* 🔹 จำนวนผู้เข้าร่วม & ฟิลเตอร์ */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            {activity
              ? `${activity.registered_count || 0}/${activity.seat || 0}`
              : "กำลังโหลด..."}{" "}
            <User size={24} />
          </div>

          {/* ตัวกรองข้อมูล */}
          <div className="flex gap-4">
            {/* ฟิลเตอร์สาขา */}
            <div className="flex items-center gap-2">
              <button className="bg-blue-900 text-white px-4 py-1 rounded">
                สาขา
              </button>
              {["SE", "AI", "CS", "IT"].map((dept) => (
                <FormControlLabel
                  key={dept}
                  control={
                    <Checkbox
                      checked={selectedDepartments.includes(dept)}
                      onChange={() =>
                        setSelectedDepartments((prev) =>
                          prev.includes(dept)
                            ? prev.filter((d) => d !== dept)
                            : [...prev, dept]
                        )
                      }
                      sx={{
                        color: "#757575",
                        "&.Mui-checked": { color: "#2196F3" },
                      }}
                    />
                  }
                  label={dept}
                />
              ))}
            </div>

            {/* ฟิลเตอร์สถานะ */}
            <div className="flex items-center gap-2">
              <button className="bg-blue-900 text-white px-4 py-1 rounded">
                สถานะ
              </button>
              {["normal", "risk"].map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={selectedStatus.includes(status)}
                      onChange={() =>
                        setSelectedStatus((prev) =>
                          prev.includes(status)
                            ? prev.filter((s) => s !== status)
                            : [...prev, status]
                        )
                      }
                      sx={{
                        color: "#757575",
                        "&.Mui-checked": { color: "#2196F3" },
                      }}
                    />
                  }
                  label={status === "normal" ? "ปกติ" : "เสี่ยง"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto max-h-[400px] rounded-lg ">
          <table className="w-full border-spacing-0 table-auto">
            {/* 🔹 หัวตาราง (มนทั้ง 4 มุม) */}
            <thead className="bg-blue-900 text-white sticky top-0 z-10 rounded-lg">
              <tr>
                <th className="p-3 text-left w-[120px] rounded-tl-lg rounded-bl-lg">
                  รหัสนิสิต
                </th>
                <th className="p-3 text-left w-[200px]">ชื่อ-นามสกุล</th>
                <th className="p-3 text-left w-[120px]">สาขา</th>
                <th className="p-3 text-center w-[120px]">สถานะ</th>
                <th className="p-3 text-center w-[120px]">อาหาร</th>
                <th className="p-3 text-center w-[120px]">ลงชื่อเข้า</th>
                <th className="p-3 text-center w-[120px]">ลงชื่อออก</th>
                <th className="p-3 text-center w-[120px] rounded-tr-lg rounded-br-lg">
                  ทำแบบประเมิน
                </th>
              </tr>
            </thead>

            {/* 🔹 เนื้อหาข้อมูล (เลื่อนเฉพาะส่วนนี้) */}
            <tbody className="bg-white">
              {activityLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    ไม่มีข้อมูลนิสิตที่ลงทะเบียน
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-300 hover:bg-gray-100"
                  >
                    <td className="p-3 text-left">{student.id}</td>
                    <td className="p-3 text-left">{student.name}</td>
                    <td className="p-3 text-left">{student.department}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`w-[110px] h-[30px] flex items-center justify-center rounded-md text-sm font-semibold border ${
                          student.status === "normal"
                            ? "text-green-700 bg-green-100 border-green-400"
                            : "text-red-700 bg-red-100 border-red-400"
                        }`}
                      >
                        {student.status === "normal" ? "ปกติ" : "เสี่ยง"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {activity?.location_type !== "Onsite"
                        ? "-"
                        : student.selectedfood}
                    </td>
                    <td className="p-3 text-center">{student.checkIn}</td>
                    <td className="p-3 text-center">{student.checkOut}</td>
                    <td className="p-3 text-center">{student.evaluated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ปุ่มย้อนกลับ อยู่ในกรอบ */}
        <div className="mt-auto flex justify-left p-4">
          <Button color="blue" onClick={() => window.history.back()}>
            ← กลับ
          </Button>
        </div>
      </div>
    </div>
  );
}
