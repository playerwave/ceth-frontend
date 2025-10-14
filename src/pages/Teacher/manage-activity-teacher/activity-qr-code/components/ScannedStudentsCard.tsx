import { GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Card from "../../../../../components/Card";
import Table_re from "../../../../../components/Table_re";
import axiosInstance from "../../../../../libs/axios";
import Loading from "../../../../../components/Loading";

interface ScannedStudent {
  id: string;
  first_name_tha: string;
  last_name_tha: string;
  department_short_name: string;
  username: string;
  fullName: string;
  time_in?: string | null;
  time_out?: string | null;
}


interface ScannedStudentsCardProps {
  scannedStudents: ScannedStudent[];
  activityId?: number;
}

export default function ScannedStudentsCard({ scannedStudents, activityId }: ScannedStudentsCardProps) {
  const [allScannedStudents, setAllScannedStudents] = useState<ScannedStudent[]>([]);
  // const [checkedInStudents, setCheckedInStudents] = useState<CheckedInStudent[]>([]);
  // const [checkedOutStudents, setCheckedOutStudents] = useState<CheckedOutStudent[]>([]);
  const [loading, setLoading] = useState(false);

  // ตรวจสอบข้อมูล
  console.log("🔍 ScannedStudentsCard: received students:", scannedStudents);
  console.log("🔍 ScannedStudentsCard: activityId:", activityId);

  // ดึงข้อมูลนิสิตที่ลงทะเบียนทั้งหมด
  useEffect(() => {
    console.log("🔍 ScannedStudentsCard: useEffect triggered");
    console.log("🔍 ScannedStudentsCard: activityId:", activityId);
    console.log("🔍 ScannedStudentsCard: activityId type:", typeof activityId);
    
    // ✅ ตรวจสอบ activityId อย่างเข้มงวด
    if (!activityId || isNaN(Number(activityId)) || Number(activityId) <= 0) {
      console.log("❌ ScannedStudentsCard: Invalid activityId:", activityId);
      return;
    }

    const fetchEnrolledStudents = async () => {
      setLoading(true);
      try {
        console.log("🔍 ScannedStudentsCard: Fetching enrolled students for activityId:", activityId);
        
        // ✅ ดึงข้อมูลนิสิตที่ลงทะเบียนทั้งหมด (รวม time_in/time_out แล้ว)
        const enrolledResponse = await axiosInstance.get(`/teacher/activity/get-enrolled-students/${activityId}`);
        const enrolledData = enrolledResponse.data?.data || enrolledResponse.data || [];
        
        console.log("📊 Full enrolled response:", enrolledResponse);
        console.log("📊 Enrolled students data:", enrolledData);
        console.log("📊 Enrolled students count:", enrolledData.length);

        // ✅ สร้างข้อมูลรวมจากนิสิตที่ลงทะเบียนทั้งหมด
        const combinedStudents: ScannedStudent[] = enrolledData.map((student: any) => {
          console.log("🔍 Processing student:", student);
          
          // ✅ ใช้ time_in และ time_out จาก enrolledData โดยตรง
          const mappedStudent = {
            id: student.id?.toString() || student.students_id?.toString() || student.username,
            first_name_tha: student.first_name_tha,
            last_name_tha: student.last_name_tha,
            department_short_name: student.department_short_name,
            username: student.username,
            fullName: `${student.first_name_tha} ${student.last_name_tha}`,
            time_in: student.time_in || null,
            time_out: student.time_out || null,
          };
          
          console.log("🔍 Mapped student:", mappedStudent);
          return mappedStudent;
        });

        setAllScannedStudents(combinedStudents);
        console.log("🔍 Combined enrolled students:", combinedStudents);
        
      } catch (error) {
        console.error("❌ Error fetching enrolled students data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, [activityId]);

  // ฟังก์ชันแปลงเวลา - แสดงเวลาตามที่บันทึกในฐานข้อมูลโดยไม่ปรับ timezone
  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "-";
    
    try {
      // แยกวันที่และเวลาจาก string โดยตรง (ไม่ใช้ Date object ที่จะปรับ timezone)
      // ตัวอย่าง: "2025-09-04T13:00:00.000Z" หรือ "2025-09-04 13:00:00"
      
      // ลบ timezone indicator และมิลลิวินาทีออก แล้วแยกส่วน
      // ใช้ regex ที่ครอบคลุมมากขึ้นเพื่อลบมิลลิวินาทีในทุกกรณี
      const cleanTimeString = timeString
        .replace(/[TZ]/g, ' ')  // ลบ T และ Z
        .replace(/\.\d+/g, '')  // ลบจุดทศนิยมและตัวเลขที่ตามมา (มิลลิวินาที)
        .trim();
      const parts = cleanTimeString.split(/[\s:-]/);
      
      if (parts.length >= 6) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        const hours = parts[3];
        const minutes = parts[4];
        const seconds = parts[5];
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      } else if (parts.length >= 3) {
        // กรณีที่มีแค่วันที่
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        
        return `${day}/${month}/${year}`;
      }
      
      // ถ้าไม่สามารถแยกได้ ให้ใช้วิธีเดิม
      console.warn("⚠️ Cannot parse time string format:", timeString);
      return timeString;
      
    } catch (error) {
      console.error("❌ Error formatting time:", error);
      return timeString || "-";
    }
  };

  // กำหนด columns สำหรับ DataGrid
  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'ชื่อนิสิต',
      width: 200,
      flex: 1,
    },
    {
      field: 'department_short_name',
      headerName: 'สาขา',
      width: 200,
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'รหัสนิสิต',
      width: 150,
      flex: 1,
    },
    {
      field: 'time_in',
      headerName: 'ลงชื่อเข้า',
      width: 180,
      flex: 1,
      renderCell: (params) => (
        <span className={params.value ? "text-green-600 font-medium" : "text-gray-400"}>
          {params.value ? formatTime(params.value) : "ยังไม่ลงชื่อ"}
        </span>
      ),
    },
    {
      field: 'time_out',
      headerName: 'ลงชื่อออก',
      width: 180,
      flex: 1,
      renderCell: (params) => (
        <span className={params.value ? "text-red-600 font-medium" : "text-gray-400"}>
          {params.value ? formatTime(params.value) : "ยังไม่ลงชื่อ"}
        </span>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">
          รายชื่อนิสิตที่ลงทะเบียน
        </h2>
      </div>
      
      {/* สถิติการเข้าร่วม */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg flex-shrink-0">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{allScannedStudents.length}</div>
          <div className="text-sm text-gray-600">ลงทะเบียนทั้งหมด</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {allScannedStudents.filter(s => s.time_in).length}
          </div>
          <div className="text-sm text-gray-600">ลงชื่อเข้าแล้ว</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {allScannedStudents.filter(s => s.time_out).length}
          </div>
          <div className="text-sm text-gray-600">ลงชื่อออกแล้ว</div>
        </div>
      </div>
      
      {/* ตรวจสอบข้อมูลก่อนแสดง Table */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Table_re
            columns={columns}
            rows={allScannedStudents}
            height={600}
            initialPageSize={50}
            getRowId={(row) => row.id}
          />
        </div>
      </div>
    </Card>
  );
}
