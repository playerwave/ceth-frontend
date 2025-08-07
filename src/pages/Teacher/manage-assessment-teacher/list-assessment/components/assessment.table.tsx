// components/table/AssessmentTable.tsx
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
// ✅ นำเข้า Custom Button ของคุณ
import CustomButton from "../../../../../components/Button";

import { useState } from "react";

import { Assessment } from "../../../../../types/model";
import { Padding } from "@mui/icons-material";

import {
  Button, // ✅ นำเข้า Button ของ MUI กลับมา
} from "@mui/material";

export interface AssessmentTableProps {
  height?: number | string;
  width?: number | string;
  title?: string;
  initialPageSize?: number;
  rows: Assessment[];
}

export default function AssessmentTable({
  height = 500,
  width = "100%",
  rows,
  title,
  initialPageSize,
}: AssessmentTableProps) {
  const [openActionRowId, setOpenActionRowId] = useState<string | null>(null);

  const handleDuplicate = (id: string) => {
    console.log("ทำซ้ำ Assessment ID:", id);
    setOpenActionRowId(null);
  };

  const handleToggleActions = (id: string) => {
    setOpenActionRowId((prevId) => (prevId === id ? null : id));
  };

  const filteredRows = rows;
  console.log("Rows received by AssessmentTable:", rows);
  console.log("Filtered Rows (no type filter):", filteredRows);

  const columns: GridColDef[] = [
    {
      field: "assessment_name",
      headerName: "ชื่อแบบประเมิน",
      flex: 1,
      // minWidth: 180,
      align: "center",
      headerAlign: "center",
      sortable: true, // ✅ ทำให้ sortable
    },
    {
      field: "create_date",
      headerName: "วันที่สร้าง",
      // width: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: true, // ✅ ทำให้ sortable
      valueFormatter: (value) =>
        value ? new Date(value as string).toLocaleDateString("th-TH") : "N/A",
    },
    {
      field: "last_update",
      headerName: "วันที่แก้ไข",
      // width: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: true, // ✅ ทำให้ sortable
      valueFormatter: (value) =>
        value ? new Date(value as string).toLocaleDateString("th-TH") : "N/A",
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      // width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            position: "relative",
            maxHeight: 2,
          }}
        >
          {openActionRowId === params.row.assessment_id ? (
            <>
              <Tooltip title="ทำซ้ำ">
                <div style={{ padding: "1x" }}>
                  <Button
                    onClick={() => handleDuplicate(params.row.assessment_id)}
                    variant="contained" // ✅ ทำให้ปุ่มมีพื้นหลัง
                    sx={{
                      backgroundColor: "#1E3A8A", // ✅ กำหนดสีพื้นหลัง
                      color: "#FFFFFF", // ✅ กำหนดสีตัวอักษร
                      borderRadius: "20px", // ✅ ทำให้ปุ่มมีขอบมน (ตัวอย่าง 20px)
                      whiteSpace: "nowrap",
                      // ถ้าอยากลดความสูงของปุ่มลงอีก สามารถใช้ paddingY หรือ minHeight ได้
                      // paddingY: '4px', // ตัวอย่าง: ลด padding บน-ล่างเหลือ 4px
                      // minHeight: '30px', // ตัวอย่าง: กำหนดความสูงขั้นต่ำ
                    }}
                    size="small" // ✅ กำหนดขนาดปุ่มเป็น small (ความสูงเริ่มต้นจะประมาณ 28-32px)
                  >
                    Duplicate
                  </Button>
                </div>
              </Tooltip>
            </>
          ) : (
            <IconButton
              onClick={() => handleToggleActions(params.row.assessment_id)}
              size="small"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography variant="h6" fontWeight={600} mb={1} textAlign="center">
          {title}
        </Typography>
      )}
      <Box
        sx={{
          height,
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          backgroundColor: "white",
          boxShadow: 2,
          textAlign: "center",
          maxWidth: "100vw",
          // ✅ กำหนดเฉพาะ border-top-radius ที่ Box หลัก
          borderTopLeftRadius: 8, // กำหนดรัศมีโค้งที่มุมซ้ายบน
          borderTopRightRadius: 8, // กำหนดรัศมีโค้งที่มุมขวาบน
          borderRadius: 0, // ✅ กำหนดเป็น 0 เพื่อให้ด้านล่างเป็นเหลี่ยม
          overflow: "hidden",
          // border: '1px solid #e0e0e0', // เพิ่ม border รอบ Box แม่
        }}
      >
        <Box
          sx={{
            minWidth: "100%",
          }}
        >
          <DataGrid
            columns={columns}
            rows={filteredRows}
            getRowId={(row) => row.assessment_id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: initialPageSize ?? 5, page: 0 },
              },
              sorting: {
                sortModel: [{ field: "create_date", sort: "desc" }],
              },
            }}
            disableRowSelectionOnClick
            autoHeight={false}
            rowHeight={40}
            headerHeight={48}
            sx={{
              "&.MuiDataGrid-root": {
                border: "none",
                // ✅ กำหนดเฉพาะ border-top-radius ให้ DataGrid รับค่าจาก Box แม่
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
                borderRadius: 0, // ✅ กำหนดเป็น 0 เพื่อให้ด้านล่างเป็นเหลี่ยม
                overflow: "hidden",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1E3A8A",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.95rem",
                textTransform: "none",
                borderBottom: "1px solid rgba(224, 224, 224, 0.2)",
                lineHeight: "normal",
                // ✅ Header รับค่า border-top-radius มาจาก root
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                overflow: "hidden",
                boxSizing: "border-box",
                "& .MuiDataGrid-columnHeaderTitleContainer > .MuiDataGrid-sortIcon":
                  {
                    color: "white",
                  },
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1E3A8A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                position: "relative",
                padding: "0 8px",
                borderBottom: "none", // ลบเส้นขอบล่างของ header cell
                "&:not(:last-of-type)": {
                  borderRight: "none",
                  borderBottom: "none",
                },
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                  lineHeight: "1.5rem",
                  whiteSpace: "normal",
                  fontWeight: "600",
                },
              },
              "& .MuiDataGrid-iconSeparator": { display: "none" },
              "& .MuiDataGrid-sortIcon": { color: "white" },
              "& .MuiDataGrid-menuIcon": { display: "none" },
              "& .MuiDataGrid-cell": {
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                borderBottom: "1px solid #e0e0e0", // ✅ มีเส้นแบ่งระหว่างแถว
                borderRight: "none",
                padding: "0 8px",
                borderTop: "none",
              },
              "& .MuiDataGrid-cell:last-of-type": { borderRight: "none" },
              "& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell": {
                borderBottom: "none",
              }, // ✅ ลบเส้นแบ่งที่แถวสุดท้าย
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
                // ✅ ทำให้ footer มีขอบล่างเป็นเหลี่ยม
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}




