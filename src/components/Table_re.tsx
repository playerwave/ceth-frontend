// ✅ TableRedesign.tsx
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputBase,
} from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

// 🔧 Custom MapPin icon แทน lucide-react
const MapPin = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// import Button from "./Button"; // ปรับเส้นทางให้ตรงกับที่เก็บ Button

import { Activity } from "../types/model"; // ปรับเส้นทางให้ตรงกับที่เก็บ Activity
// import { useAuthStore } from "../stores/Visitor/auth.store";

export interface TableRedesignProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  columns: GridColDef[];
  rows: unknown[];
  title?: string;
  onRowDoubleClick?: (row: Activity) => void;
  handleStatusToggle?: (row: Activity) => void;
  initialPageSize?: number;
  getRowId?: (row: any) => string | number;
}

export default function TableRedesign({
  height = 500,
  width = "100%",
  columns,
  rows,
  title,
  onRowDoubleClick,
  handleStatusToggle,
  initialPageSize = 10,
  getRowId,
}: TableRedesignProps) {
  // const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState<string>("");
  // const user = useAuthStore.getState().user;

  // const handleRowClick: GridEventListener<"rowClick"> = (params) => {
  //   const id = params.row.activity_id;
  //   if (id) {
  //     const role =
  //       typeof user?.role === "string" ? user.role : user?.role?.role_name;
  //     if (role === "Student") {
  //         navigate(`/activity-info-student/${id}`);
  //       } else {
  //         navigate(`/activity-info-admin/${id}`);
  //       }
  //   }
  // };

  // 🔗 เพิ่มฟังก์ชันสำหรับ double-click
  const handleRowDoubleClick: GridEventListener<"rowDoubleClick"> = (
    params
  ) => {
    console.log("🔍 TableRedesign: Double-click detected!");
    console.log("🔍 TableRedesign: Row data:", params.row);

    if (onRowDoubleClick) {
      onRowDoubleClick(params.row);
    }
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocationFilter(event.target.value);
  };

  const filteredRows = locationFilter
    ? rows.filter((row) => (row as any).event_format === locationFilter)
    : rows;

  const columnsWithDropdown = columns.map((col) => {
    if (col.field === "event_format") {
      return {
        ...col,
        renderHeader: () => (
          <FormControl
            size="small"
            variant="standard"
            sx={{
              minWidth: 40,
              backgroundColor: "#1E3A8A",
              alignItems: "center",
              justifyContent: "center",
              px: 0.2,
              display: "flex",
              flexDirection: "row",
              gap: 0.2,
            }}
          >
            <MapPin size={18} color="white" />
            <Select
              value={locationFilter}
              onChange={handleLocationChange}
              displayEmpty
              renderValue={() => (
                <span style={{ color: "white", fontSize: 14 }}> </span>
              )}
              input={<InputBase sx={{ color: "white", fontSize: 14 }} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    border: "1px solid #ccc",
                    mt: 1,
                    "& .MuiMenuItem-root": {
                      fontSize: 13,
                    },
                  },
                },
              }}
              sx={{
                color: "white",
                border: "none",
                fontSize: 14,
                padding: 0,
                minWidth: 20,
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: 0,
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Onsite">Onsite</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
            </Select>
          </FormControl>
        ),
      };
    }
    return col;
  });

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
          width,
          overflowX: "hidden", // ปิดแกน X ที่ container
          overflowY: "hidden", // ให้เลื่อนอยู่ใน DataGrid เท่านั้น
          backgroundColor: "white",
          boxShadow: 2,
          textAlign: "center",
          maxWidth: "100vw",
        }}
      >
        <Box sx={{ width: "100%", minWidth: "100%", height: "100%" }}>
          <DataGrid
            columns={columnsWithDropdown}
            rows={filteredRows}
            getRowId={getRowId || ((row) => row.activity_id)}
            onRowDoubleClick={handleRowDoubleClick}
            disableRowSelectionOnClick
            /* --- สกอลล์ในตาราง + มี pagination --- */
            autoHeight={false}
            pagination
            hideFooterPagination={false}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: initialPageSize, page: 0 } },
            }}
            sx={{
              height: "100%",
              border: "none",
              overflowX: "hidden",

              "& .MuiDataGrid-main": { height: "100%", overflowX: "hidden" },
              "& .MuiDataGrid-virtualScroller": {
                overflowY: "auto",
                overflowX: "hidden",
              },
              "& .MuiDataGrid-footerContainer": {
                overflowX: "hidden",
                overflowY: "hidden",
              },

              /* บังคับความกว้าง content ให้ไม่เกินกรอบ → ปิดสกอลล์ X เด็ดขาด */
              "& .MuiDataGrid-virtualScrollerContent": {
                minWidth: "100% !important",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                minWidth: "100% !important",
              },

              "& .MuiTablePagination-root": {
                overflowY: "hidden", // กัน pagination component มีสกอลล์
              },

              /* สไตล์ของคุณเดิม */
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1E3A8A",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.95rem",
                textTransform: "none",
                width: "100% !important",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1E3A8A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                textAlign: "center",
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                  lineHeight: "1.5rem",
                  whiteSpace: "normal",
                  fontWeight: "600",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "25%",
                  bottom: "25%",
                  width: "1px",
                  backgroundColor: "white",
                  opacity: 0,
                  transition: "opacity .3s",
                },
                "&:hover::after": { opacity: 1 },
              },
              "& .MuiDataGrid-columnHeader:last-of-type::after": {
                display: "none",
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
              },

              "& .MuiDataGrid-scrollbarFiller": {
                display: "none", // ✅ เอาช่อง filler ที่ขาวออก
              },

              "& .MuiDataGrid-filler": {
                display: "none", // กัน padding ขาวข้างหัวตาราง
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
