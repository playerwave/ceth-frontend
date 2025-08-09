import * as React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import CertificateActions from "./certificateactions";

interface Activity {
  id: number;
  fullName: string;
  subActivity: string;
  courseName: string;
  submissionDate: string;
}

const mockData: Activity[] = [
  {
    id: 1,
    fullName: "ญาณภัทร บรรยศักดิ์",
    subActivity: "Click next",
    courseName: "อิเล็กทรอนิกส์",
    submissionDate: "14 May 2023, 01:45 PM",
  },
  {
    id: 2,
    fullName: "ญาณภัทร บรรยศักดิ์",
    subActivity: "AI Thai",
    courseName: "รูปแบบที่อยู่ในชุดข้อมูล",
    submissionDate: "14 May 2023, 01:45 PM",
  },
  {
    id: 3,
    fullName: "ญาณภัทร บรรยศักดิ์",
    subActivity: "AI Buu",
    courseName: "หลักสูตรปัญญาประดิษฐ์",
    submissionDate: "14 May 2023, 01:45 PM",
  }
];

const columns: GridColDef[] = [
  { field: "fullName", headerName: "ชื่อ-นามสกุล", flex: 1 },
  { field: "subActivity", headerName: "ชื่อกิจกรรมย่อย", flex: 1 },
  { field: "courseName", headerName: "ชื่อหลักสูตร", flex: 1 },
  { field: "submissionDate", headerName: "วันที่ส่งใบรับรอง", flex: 1 },
  {
    field: "actions",
    headerName: "ตรวจสอบใบรับรอง",
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <CertificateActions id={params.row.id} />
    ),

  },
];

const ActivityTable: React.FC = () => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={mockData}
        columns={columns}
        pageSizeOptions={[5, 10]}
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        onRowClick={(params: GridRowParams) =>
          console.log("Row clicked:", params.row)
        }
        sx={{
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
            backgroundColor: "#1E3A8A",
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: "16px",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "#FFFFFF",
          },
          "& .MuiSvgIcon-root": {
            color: "#FFFFFF",
          },
          "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
            color: "#000000 !important",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
          {
            color: "#000000 !important",
          },
          "& .MuiSelect-select, & .MuiSvgIcon-root.MuiSelect-icon": {
            color: "#000000 !important",
          },
          "& .MuiTablePagination-actions button": {
            color: "#000000 !important",
          },
          "& .MuiTablePagination-actions button svg": {
            color: "#000000 !important",
          },
        }}
      />
    </div>
  );
};

export default ActivityTable;
