import { useEffect, useMemo, useState } from "react";
import SearchBar from "../list-certificate-student/components/SearchBar";
import Button from "../../../../components/Button";
import { FolderUp } from "lucide-react";
import CustomCard from "../../../../components/Card";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

type Row = { id: number; name: string; sentAt: string; status: string };

export default function ListCertificateStudent() {
  // ข้อมูลตามภาพ
  const rows: Row[] = [
    { id: 1, name: "Click next", sentAt: "14 May 2025, 01:45 PM", status: "รอตรวจสอบ" },
    { id: 2, name: "Ai Thai",    sentAt: "14 May 2025, 01:45 PM", status: "รอตรวจสอบ" },
    { id: 3, name: "Ai Buu",     sentAt: "14 May 2025, 01:45 PM", status: "รอตรวจสอบ" },
  ];

  // คอลัมน์
  const columns: GridColDef<Row>[] = [
    { field: "name",   headerName: "ชื่อเกียรติบัตร",      flex: 1,   minWidth: 220 },
    { field: "sentAt", headerName: "วันที่ส่งเกียรติบัตร", flex: 0.8, minWidth: 200 },
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

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.sentAt, r.status].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [searchTerm, rows]); // ⬅ เพิ่ม rows ใน dependency ให้ถูกต้อง

  // รีเซ็ต pagination เมื่อมีการค้นหาใหม่
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  useEffect(() => {
    setPaginationModel((m) => ({ ...m, page: 0 }));
  }, [searchTerm]);

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">Certificate</h1>

      {/* Search bar */}
      <div className="flex justify-center w-full mb-4">
        {/* ถ้า SearchBar ของคุณมี debounceMs จะพิมพ์ลื่นขึ้น */}
        <SearchBar onSearch={handleSearch} debounceMs={250} />
      </div>

      {/* Action Button */}
      <div className="flex flex-wrap justify-end items-center gap-2 mb-6">
        <Button className="flex items-center">
          อัปโหลด Certificate
          <FolderUp className="w-6 h-6 ml-2" />
        </Button>
      </div>

      <CustomCard className="p-0">
        <h2 className="text-left font-semibold text-black px-6 pt-5 pb-4">
          Certificate ของฉัน
        </h2>

        <div style={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            slots={{
              noRowsOverlay: () => (
                <div style={{ padding: 24, color: "#6B7280" }}>ไม่พบข้อมูล</div>
              ),
            }}
            sx={{
              // หัวตาราง
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
                backgroundColor: "#1E3A8A",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "16px",
              },
              // ไอคอนเรียงลำดับ
              "& .MuiDataGrid-sortIcon, & .MuiSvgIcon-root": {
                color: "#FFFFFF",
              },

              // เส้นคั่นแถว
              "& .MuiDataGrid-row, & .MuiDataGrid-cell": {
                borderColor: "#E5E7EB",
              },

              // Pagination สีดำ
              "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
                color: "#000000 !important",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "#000000 !important",
              },
              "& .MuiSelect-select, & .MuiSvgIcon-root.MuiSelect-icon": {
                color: "#000000 !important",
              },
              "& .MuiTablePagination-actions button, & .MuiTablePagination-actions button svg": {
                color: "#000000 !important",
              },
            }}
          />
        </div>
      </CustomCard>
    </div>
  );
}

