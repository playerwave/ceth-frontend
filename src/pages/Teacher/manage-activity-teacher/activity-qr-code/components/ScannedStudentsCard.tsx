import { GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Card from "../../../../../components/Card";
import Table_re from "../../../../../components/Table_re";
import axiosInstance from "../../../../../libs/axios";

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

interface CheckedInStudent {
  students_id: number;
  first_name_tha: string;
  last_name_tha: string;
  department_short_name: string;
  username: string;
  activity_detail_id: number;
  time_in: string;
  register_date: string;
  join_date: string;
  join_status: string;
}

interface CheckedOutStudent {
  students_id: number;
  first_name_tha: string;
  last_name_tha: string;
  department_short_name: string;
  username: string;
  activity_detail_id: number;
  time_in: string;
  time_out: string;
  register_date: string;
  join_date: string;
  join_status: string;
}

interface ScannedStudentsCardProps {
  scannedStudents: ScannedStudent[];
  activityId?: number;
}

export default function ScannedStudentsCard({ scannedStudents, activityId }: ScannedStudentsCardProps) {
  const [checkedInStudents, setCheckedInStudents] = useState<CheckedInStudent[]>([]);
  const [checkedOutStudents, setCheckedOutStudents] = useState<CheckedOutStudent[]>([]);
  // const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ตรวจสอบข้อมูล
  console.log("🔍 ScannedStudentsCard: received students:", scannedStudents);
  console.log("🔍 ScannedStudentsCard: activityId:", activityId);

  // ดึงข้อมูล check-in และ check-out students
  useEffect(() => {
    console.log("🔍 ScannedStudentsCard: useEffect triggered");
    console.log("🔍 ScannedStudentsCard: activityId:", activityId);
    console.log("🔍 ScannedStudentsCard: activityId type:", typeof activityId);
    
    // ✅ ตรวจสอบ activityId อย่างเข้มงวด
    if (!activityId || isNaN(Number(activityId)) || Number(activityId) <= 0) {
      console.log("❌ ScannedStudentsCard: Invalid activityId:", activityId);
      return;
    }

    const fetchCheckInOutData = async () => {
      setLoading(true);
      try {
        console.log("🔍 ScannedStudentsCard: Fetching data for activityId:", activityId);
        
        const [checkedInResponse, checkedOutResponse] = await Promise.all([
          axiosInstance.get(`/teacher/activity/students-checked-in/${activityId}`),
          axiosInstance.get(`/teacher/activity/students-checked-out/${activityId}`)
        ]);

        setCheckedInStudents(checkedInResponse.data.data || []);
        setCheckedOutStudents(checkedOutResponse.data.data || []);
        
        console.log("📊 Checked-in students response:", checkedInResponse);
        console.log("📊 Checked-out students response:", checkedOutResponse);
        console.log("📊 Checked-in students data:", checkedInResponse.data.data);
        console.log("📊 Checked-out students data:", checkedOutResponse.data.data);
      } catch (error) {
        console.error("❌ Error fetching check-in/out data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckInOutData();
  }, [activityId]);

  // รวมข้อมูล scanned students กับ check-in/out data
  const enrichedStudents = scannedStudents.map(student => {
    const checkedIn = checkedInStudents.find(s => s.username === student.username);
    const checkedOut = checkedOutStudents.find(s => s.username === student.username);
    
    return {
      ...student,
      fullName: `${student.first_name_tha || ''} ${student.last_name_tha || ''}`.trim(),
      time_in: checkedIn?.time_in || null,
      time_out: checkedOut?.time_out || null,
    };
  });

  // Debug: แสดงข้อมูล enrichedStudents
  console.log("🔍 ScannedStudentsCard: enrichedStudents:", enrichedStudents);
  console.log("🔍 ScannedStudentsCard: Students with time_in:", enrichedStudents.filter(s => s.time_in));
  console.log("🔍 ScannedStudentsCard: Students with time_out:", enrichedStudents.filter(s => s.time_out));

  // ฟังก์ชันแปลงเวลา
  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "-";
    
    try {
      const date = new Date(timeString);
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error("❌ Error formatting time:", error);
      return "-";
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
          {formatTime(params.value)}
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
          {formatTime(params.value)}
        </span>
      ),
    },
  ];

  return (
    <Card className="lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          รายชื่อนิสิตที่สแกนแล้ว
        </h2>
        {loading && (
          <div className="text-sm text-blue-600">
            กำลังโหลดข้อมูล...
          </div>
        )}
      </div>
      
      {/* สถิติการเข้าร่วม */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{enrichedStudents.length}</div>
          <div className="text-sm text-gray-600">รวมทั้งหมด</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {enrichedStudents.filter(s => s.time_in).length}
          </div>
          <div className="text-sm text-gray-600">ลงชื่อเข้า {}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {enrichedStudents.filter(s => s.time_out).length}
          </div>
          <div className="text-sm text-gray-600">ลงชื่อออก</div>
        </div>
      </div>
      
      {/* ตรวจสอบข้อมูลก่อนแสดง Table */}
      {!Array.isArray(scannedStudents) || scannedStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>ยังไม่มีนักเรียนลงทะเบียน</p>
        </div>
      ) : (
        <Table_re
          columns={columns}
          rows={enrichedStudents}
          height={400}
          initialPageSize={10}
          getRowId={(row) => row.id}
        />
      )}
    </Card>
  );
}
