import { useState, useEffect, useMemo } from 'react';
import TableRedesign from "../../../../components/Table_re";
import Searchbar from "../../../../components/Searchbar";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const listCertificateTeacher = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch certificates from API (ตอนนี้ใช้ empty array ก่อน)
  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        // TODO: เรียก API ดึงข้อมูลเกียรติบัตร
        // const response = await getCertificates();
        // setCertificates(response.data);
        setCertificates([]); // ตอนนี้ให้เป็น empty array ก่อน
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลเกียรติบัตรได้");
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // ✅ Filter certificates ตาม search term
  const filteredCertificates = useMemo(() => {
    if (!searchTerm.trim()) return certificates;
    
    const searchLower = searchTerm.toLowerCase();
    return certificates.filter((cert) =>
      cert.fullName?.toLowerCase().includes(searchLower) ||
      cert.courseName?.toLowerCase().includes(searchLower) ||
      cert.subActivity?.toLowerCase().includes(searchLower)
    );
  }, [certificates, searchTerm]);

  // ✅ Define columns
  const columns: GridColDef[] = [
    { 
      field: "fullName", 
      headerName: "ชื่อ-นามสกุล", 
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    { 
      field: "subActivity", 
      headerName: "ชื่อกิจกรรมย่อย", 
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    { 
      field: "courseName", 
      headerName: "ชื่อหลักสูตร", 
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    { 
      field: "submissionDate", 
      headerName: "วันที่ส่งใบรับรอง", 
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "ตรวจสอบใบรับรอง",
      flex: 1,
      minWidth: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={() => navigate(`/preview-certificate-teacher?id=${params.row.id}`)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Preview
          </button>
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            onClick={() => console.log("Download certificate for ID:", params.row.id)}
          >
            Download
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-3xl font-bold mb-4">จัดการเกียรติบัตร</h1>

      <div className="flex justify-center items-center w-full mt-10 mb-6">
        <Searchbar 
          onSearch={(term) => setSearchTerm(term)}
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="bg-white p-6 shadow-2xl rounded-lg my-10">
        <h2 className="text-left text-xl font-semibold text-black mb-4">
          นิสิตที่เคลมเกียรติบัตร
        </h2>

        <TableRedesign
          columns={columns}
          rows={filteredCertificates}
          height={600}
          width="100%"
          loading={loading}
          error={error}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default listCertificateTeacher;
