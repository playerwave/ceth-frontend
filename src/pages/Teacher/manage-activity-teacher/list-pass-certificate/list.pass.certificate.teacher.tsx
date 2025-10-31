import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import TableRedesign from "@/components/Table_re";
import CustomCard from "@/components/Card";
import Button from "@/components/Button";
import { useCertificateStore } from "@/stores/Teacher/certificate.store";

const ListPassCertificateTeacher: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { getPassedCertificatesByActivity, certificateLoading, error } = useCertificateStore();
  
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (activityId) {
        try {
          const data = await getPassedCertificatesByActivity(Number(activityId));
          setCertificates(data);
        } catch (err) {
          console.error("Failed to fetch certificates:", err);
        }
      }
    };

    fetchData();
  }, [activityId, getPassedCertificatesByActivity]);

  const columns: GridColDef[] = [
    // {
    //   field: "students_id",
    //   headerName: "ID",
    //   width: 100,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "full_name",
      headerName: "ชื่อ-นามสกุล",
      width: 300,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => {
        const firstName = params.row.first_name_tha || params.row.first_name_eng || '';
        const lastName = params.row.last_name_tha || params.row.last_name_eng || '';
        return `${firstName} ${lastName}`.trim() || 'ไม่ระบุ';
      },
    },
    {
      field: "username",
      headerName: "รหัสนิสิต",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
    },
    {
      field: "email",
      headerName: "อีเมล",
      width: 300,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
    },
    {
      field: "hours",
      headerName: "ชั่วโมง",
      width: 150,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => (
        <span className="text-sm font-semibold">
          {params.value || 0}
        </span>
      ),
    },
    {
      field: "date",
      headerName: "วันที่ส่ง",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
    },
    {
      field: "certificate_type",
      headerName: "ประเภท",
      width: 180,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => (
        <span className="text-sm">
          {params.value || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 px-8 w-450 ml-20">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          รายชื่อนิสิตที่ผ่านการตรวจสอบ Certificate
        </h1>
        <p className="text-gray-600">
          กิจกรรม ID: {activityId}
        </p>
      </div>

      <CustomCard className="mx-4">
        <TableRedesign
          columns={columns}
          rows={certificates}
          height={600}
          loading={certificateLoading}
          error={error}
          getRowId={(row) => row.certificate_id || row.students_id}
          initialPageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </CustomCard>

      <div className="mt-4 mx-4">
        <Button
          onClick={() => navigate(-1)}
          width="120px"
        >
          ← กลับ
        </Button>
      </div>
    </div>
  );
};

export default ListPassCertificateTeacher;

