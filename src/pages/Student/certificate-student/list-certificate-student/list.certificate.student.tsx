import { useEffect, useMemo, useState } from "react";
import Searchbar from "@src/components/Searchbar";
import Button from "../../../../components/Button";
import { FolderUp } from "lucide-react";
import CustomCard from "../../../../components/Card";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import TableRedesign from "../../../../components/Table_re";
import { useCertificateStore } from "../../../../stores/Student/certificate.store.student";
import { Certificate } from "../../../../types/certificate/certificate.type";

type Row = { id: number; name: string; sentAt: string; status: string };

export default function ListCertificateStudent() {
  // ใช้ store สำหรับจัดการข้อมูล
  const { 
    certificates, 
    certificateLoading, 
    certificateError, 
    fetchCertificatesByStudentId 
  } = useCertificateStore();

  // คอลัมน์
  const columns: GridColDef<Row>[] = [
    { field: "name", headerName: "ชื่อเกียรติบัตร", flex: 1, minWidth: 220 },
    {
      field: "sentAt",
      headerName: "วันที่ส่งเกียรติบัตร",
      flex: 0.8,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "สถานะ",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <span style={{ color: "red", fontWeight: 500 }}>{params.value}</span>
      ),
    },
  ];

  // ค้นหา (ระหว่างพิมพ์)
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (term: string) => setSearchTerm(term);

  // แปลงข้อมูลจาก Certificate เป็น Row format
  const rows: Row[] = useMemo(() => {
    return certificates.map((cert: Certificate) => ({
      id: cert.certificate_id,
      name: cert.activity?.activity_name || "ไม่ระบุกิจกรรม",
      sentAt: cert.date ? new Date(cert.date).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) : "ไม่ระบุวันที่",
      status: cert.status === "Pending" ? "รอตรวจสอบ" : 
              cert.status === "Pass" ? "ผ่าน" : 
              cert.status === "Fail" ? "ไม่ผ่าน" : "ไม่ระบุ"
    }));
  }, [certificates]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.sentAt, r.status].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [searchTerm, rows]);

  // Fetch ข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchCertificatesByStudentId();
  }, [fetchCertificatesByStudentId]);

  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">Certificate</h1>

      {/* Search bar */}
      <div className="flex justify-center w-full mb-4">
        {/* ถ้า SearchBar ของคุณมี debounceMs จะพิมพ์ลื่นขึ้น */}
        <Searchbar onSearch={handleSearch} />
      </div>

      {/* Action Button */}
      <div className="flex flex-wrap justify-end items-center gap-2 mb-6">
        <Button
          className="flex items-center"
          onClick={() => navigate("/send-certificate-student")}
        >
          อัปโหลด Certificate
          <FolderUp className="w-6 h-6 ml-2" />
        </Button>
      </div>

      <CustomCard className="p-0">
        <h2 className="text-left font-semibold text-black px-6 pt-5 pb-4">
          Certificate ของฉัน
        </h2>

        <div className="px-6 pb-6">
          <TableRedesign
            height={420}
            width="100%"
            columns={columns}
            rows={filteredRows}
            title=""
            getRowId={(row) => row.id}
            loading={certificateLoading}
            error={certificateError}
            initialPageSize={5}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </CustomCard>
    </div>
  );
}

