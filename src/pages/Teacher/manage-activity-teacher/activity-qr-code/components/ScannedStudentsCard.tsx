import { GridColDef } from "@mui/x-data-grid";
import Card from "../../../../../components/Card";
import Table_re from "../../../../../components/Table_re";

interface ScannedStudent {
  id: string;
  student_name: string;
  department: string;
  student_code: string;
}

interface ScannedStudentsCardProps {
  scannedStudents: ScannedStudent[];
}

export default function ScannedStudentsCard({ scannedStudents }: ScannedStudentsCardProps) {
  // กำหนด columns สำหรับ DataGrid
  const columns: GridColDef[] = [
    {
      field: 'student_name',
      headerName: 'ชื่อนิสิต',
      width: 200,
      flex: 1,
    },
    {
      field: 'department',
      headerName: 'สาขา',
      width: 250,
      flex: 1,
    },
    {
      field: 'student_code',
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
      <Table_re
        columns={columns}
        rows={scannedStudents}
        height={400}
        initialPageSize={10}
        getRowId={(row) => row.id}
      />
    </Card>
  );
}
