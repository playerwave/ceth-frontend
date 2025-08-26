import { GridColDef } from "@mui/x-data-grid";
import Card from "../../../../../components/Card";
import Table_re from "../../../../../components/Table_re";

interface ScannedStudent {
  id: string;
  first_name: string;
  last_name: string;
  department_name: string;
  username: string;
  fullName: string;
}

interface ScannedStudentsCardProps {
  scannedStudents: ScannedStudent[];
}

export default function ScannedStudentsCard({ scannedStudents }: ScannedStudentsCardProps) {
  // ตรวจสอบข้อมูล
  console.log("🔍 ScannedStudentsCard: received students:", scannedStudents);
  
  // กำหนด columns สำหรับ DataGrid
  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'ชื่อนิสิต',
      width: 200,
      flex: 1,
    },
    {
      field: 'department_name',
      headerName: 'สาขา',
      width: 250,
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'รหัสนิสิต',
      width: 150,
      flex: 1,
    },
  ];

  return (
    <Card className="lg:col-span-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        รายชื่อนิสิตที่สแกนแล้ว
      </h2>
      
      {/* ตรวจสอบข้อมูลก่อนแสดง Table */}
      {!Array.isArray(scannedStudents) || scannedStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>ยังไม่มีนักเรียนลงทะเบียน</p>
        </div>
      ) : (
        <Table_re
          columns={columns}
          rows={scannedStudents}
          height={400}
          initialPageSize={10}
          getRowId={(row) => row.id}
        />
      )}
    </Card>
  );
}
