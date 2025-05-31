// import * as React from "react";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { Box, Typography } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";

// interface ActivityRow {
//   id: number;
//   company: string;
//   type: "Soft Skill" | "Hard Skill";
//   name: string;
//   endDate: string; // เช่น "2025-06-01T13:00:00"
//   registered: string; // เช่น "50/50"
// }

// interface Props {
//   data: ActivityRow[];
// }

// const PendingEvaluation: React.FC<Props> = ({ data }) => {
//   const columns: GridColDef[] = [
//     {
//       field: "company",
//       headerName: "ชื่อบริษัท/วิทยากร",
//       flex: 1,
//       headerClassName: "super-app-theme--header",
//     },
//     {
//       field: "type",
//       headerName: "ประเภท",
//       flex: 1,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <span
//           className={`px-3 py-1 rounded font-semibold text-sm ${
//             params.value === "Soft Skill"
//               ? "bg-[#E9E5FF] text-[#5D47E1]"
//               : "bg-[#FFF3D9] text-[#D49100]"
//           }`}
//         >
//           {params.value}
//         </span>
//       ),
//     },
//     {
//       field: "name",
//       headerName: "ชื่อกิจกรรม",
//       flex: 2,
//       headerClassName: "super-app-theme--header",
//     },
//     {
//       field: "endDate",
//       headerName: "วันที่ปิดทำแบบประเมิน",
//       flex: 1.5,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => {
//         const date = new Date(params.value);
//         const now = new Date();
//         const isPast = date < now;

//         const formatter = new Intl.DateTimeFormat("th-TH", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         return (
//           <span className={`font-medium ${isPast ? "text-red-500" : ""}`}>
//             {formatter.format(date)}
//           </span>
//         );
//       },
//     },
//     {
//       field: "registered",
//       headerName: "จำนวนที่ลงทะเบียน",
//       flex: 1,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <div className="flex items-center gap-1 font-semibold">
//           {params.value} <PersonIcon fontSize="small" />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Box
//       className="mt-6"
//       sx={{
//         p: 3,
//         backgroundColor: "#fff",
//         borderRadius: 3,
//         boxShadow: 4,
//         width: "100%",
//         maxWidth: "1310px",
//         mx: "auto",
//       }}
//     >
//       <Typography variant="h6" fontWeight="bold" gutterBottom>
//         ลิสต์กิจกรรมที่ยังไม่ได้ทำแบบประเมิน
//       </Typography>
//       <div style={{ height: 500, width: "100%" }}>
//         <DataGrid
//           rows={data}
//           getRowId={(row) => row.id} // ✅ จำเป็น
//           columns={columns}
//           pageSizeOptions={[5, 10]}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 5, page: 0 } },
//           }}
//           sx={{
//             "& .super-app-theme--header": {
//               backgroundColor: "#1E3A8A",
//               color: "#FFFFFF",
//               fontWeight: "bold",
//               fontSize: "16px",
//             },
//             "& .MuiDataGrid-sortIcon": {
//               color: "#FFFFFF",
//             },
//             "& .MuiSvgIcon-root": {
//               color: "#FFFFFF",
//             },
//             "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
//               color: "#000000 !important",
//             },
//             "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
//               {
//                 color: "#000000 !important",
//               },
//             "& .MuiSelect-select, & .MuiSvgIcon-root.MuiSelect-icon": {
//               color: "#000000 !important",
//             },
//             "& .MuiTablePagination-actions button": {
//               color: "#000000 !important",
//             },
//             "& .MuiTablePagination-actions button svg": {
//               color: "#000000 !important",
//             },

//             // ✅ ลบเส้นกั้นระหว่างคอลัมน์
//             "& .MuiDataGrid-columnSeparator": {
//               display: "none !important",
//             },
//           }}
//         />
//       </div>
//     </Box>
//   );
// };

// export default PendingEvaluation;

// import * as React from "react";
// import { useState } from "react";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { Box, Typography, Checkbox, Chip } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";

// interface ActivityRow {
//   id: number;
//   company: string;
//   type: "Soft Skill" | "Hard Skill";
//   name: string;
//   endDate: string; // เช่น "2025-06-01T13:00:00"
//   registered: string; // เช่น "50/50"
// }

// interface Props {
//   data: ActivityRow[];
// }

// const PendingEvaluation: React.FC<Props> = ({ data }) => {
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

//   const handleTypeChange = (type: string) => {
//     setSelectedTypes((prev) =>
//       prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
//     );
//   };

//   const filteredRows = data.filter((row) => selectedTypes.includes(row.type));

//   const columns: GridColDef[] = [
//     {
//       field: "company",
//       headerName: "ชื่อบริษัท/วิทยากร",
//       width: 170,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <Box
//           sx={{
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//             maxWidth: "100%",
//           }}
//         >
//           {params.value ?? "-"}
//         </Box>
//       ),
//     },
//     {
//       field: "type",
//       headerName: "ประเภท",
//       width: 200,
//       disableColumnMenu: true,
//       sortable: false,
//       headerClassName: "super-app-theme--header",
//       renderHeader: () => (
//         <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
//           <Typography fontWeight={600} color="white">
//             ประเภท
//           </Typography>
//           <Checkbox
//             size="small"
//             checked={selectedTypes.includes("Hard Skill")}
//             onChange={() => handleTypeChange("Hard Skill")}
//             sx={{
//               color: "#F3D9B1",
//               "&.Mui-checked": { color: "#F3D9B1" },
//               bgcolor: "#1E3A8A",
//               borderRadius: "4px",
//             }}
//           />
//           <Checkbox
//             size="small"
//             color="default"
//             checked={selectedTypes.includes("Soft Skill")}
//             onChange={() => handleTypeChange("Soft Skill")}
//             sx={{
//               color: "#E9D5FF",
//               "&.Mui-checked": { color: "#E9D5FF" },
//               bgcolor: "#1E3A8A",
//               borderRadius: "4px",
//             }}
//           />
//         </Box>
//       ),
//       renderCell: (params) => {
//         const value = params.value ?? "ไม่ได้ระบุ";
//         return (
//           <Chip
//             label={value}
//             size="small"
//             sx={{
//               backgroundColor:
//                 value === "Hard Skill"
//                   ? "#FFF4CC"
//                   : value === "Soft Skill"
//                   ? "#EDE7F6"
//                   : "transparent",
//               color:
//                 value === "Hard Skill"
//                   ? "#FBBF24"
//                   : value === "Soft Skill"
//                   ? "#5E35B1"
//                   : "black",
//               fontWeight: "bold",
//             }}
//           />
//         );
//       },
//     },
//     {
//       field: "name",
//       headerName: "ชื่อกิจกรรม",
//       flex: 2,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <Box
//           sx={{
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//             maxWidth: "100%",
//           }}
//         >
//           {params.value ?? "-"}
//         </Box>
//       ),
//     },
//     {
//       field: "endDate",
//       headerName: "วันที่ปิดทำแบบประเมิน",
//       flex: 1.5,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => {
//         const date = new Date(params.value);
//         const now = new Date();
//         const isPast = date < now;

//         const formatter = new Intl.DateTimeFormat("th-TH", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         return (
//           <span className={`font-medium ${isPast ? "text-red-500" : ""}`}>
//             {formatter.format(date)}
//           </span>
//         );
//       },
//     },
//     {
//       field: "registered",
//       headerName: "จำนวนที่ลงทะเบียน",
//       flex: 1,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <div className="flex items-center gap-1 font-semibold">
//           {params.value} <PersonIcon fontSize="small" />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Box
//       className="mt-6"
//       sx={{
//         p: 3,
//         backgroundColor: "#fff",
//         borderRadius: 3,
//         boxShadow: 4,
//         width: "100%",
//         maxWidth: "1310px",
//         mx: "auto",
//       }}
//     >
//       <Typography variant="h6" fontWeight="bold" gutterBottom>
//         ลิสต์กิจกรรมที่ยังไม่ได้ทำแบบประเมิน
//       </Typography>
//       <div style={{ height: 500, width: "100%" }}>
//         <DataGrid
//           rows={filteredRows}
//           getRowId={(row) => row.id}
//           columns={columns}
//           pageSizeOptions={[5, 10]}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 5, page: 0 } },
//           }}
//           sx={{
//             "& .super-app-theme--header": {
//               backgroundColor: "#1E3A8A",
//               color: "#FFFFFF",
//               fontWeight: "bold",
//               fontSize: "16px",
//             },
//             "& .MuiDataGrid-columnSeparator": {
//               display: "none !important", // ❌ ลบเส้นคอลัมน์
//             },
//             "& .MuiDataGrid-sortIcon": {
//               color: "#FFFFFF",
//             },
//             "& .MuiSvgIcon-root": {
//               color: "#FFFFFF",
//             },
//             "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
//               color: "#000000 !important",
//             },
//             "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
//               {
//                 color: "#000000 !important",
//               },
//             "& .MuiSelect-select, & .MuiSvgIcon-root.MuiSelect-icon": {
//               color: "#000000 !important",
//             },
//             "& .MuiTablePagination-actions button": {
//               color: "#000000 !important",
//             },
//             "& .MuiTablePagination-actions button svg": {
//               color: "#000000 !important",
//             },
//           }}
//         />
//       </div>
//     </Box>
//   );
// };

// export default PendingEvaluation;

import * as React from "react";
import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography, Checkbox, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { CheckIcon, User } from "lucide-react";
import CustomCard from "../../../../components/Card";

interface ActivityRow {
  id: number;
  company: string;
  type: "Soft Skill" | "Hard Skill";
  name: string;
  endDate: string;
  registered: string;
}

interface Props {
  data: ActivityRow[];
}

const PendingEvaluation: React.FC<Props> = ({ data }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // ✅ default ไม่เลือก

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredRows =
    selectedTypes.length === 0
      ? data
      : data.filter((row) => selectedTypes.includes(row.type));

  const columns: GridColDef[] = [
    {
      field: "company",
      headerName: "ชื่อบริษัท/วิทยากร",
      width: 170,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {params.value ?? "-"}
        </Box>
      ),
    },
    {
      field: "type",
      headerName: "ประเภท",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Typography fontWeight={600} color="white">
            ประเภท
          </Typography>

          {/* Hard Skill */}
          <Checkbox
            size="small"
            checked={selectedTypes.includes("Hard Skill")}
            onChange={() => handleTypeChange("Hard Skill")}
            disableRipple
            icon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "4px",
                  border: "2px solid #F3D9B1",
                }}
              />
            }
            checkedIcon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: "#F3D9B1",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1E3A8A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
            }
          />

          {/* Soft Skill */}
          <Checkbox
            size="small"
            checked={selectedTypes.includes("Soft Skill")}
            onChange={() => handleTypeChange("Soft Skill")}
            disableRipple
            icon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "4px",
                  border: "2px solid #E9D5FF",
                }}
              />
            }
            checkedIcon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: "#E9D5FF",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1E3A8A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
            }
          />
        </Box>
      ),
      renderCell: (params) => {
        const value = params.value ?? "ไม่ได้ระบุ";
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor:
                value === "Hard Skill"
                  ? "#FFF4CC"
                  : value === "Soft Skill"
                  ? "#EDE7F6"
                  : "transparent",
              color:
                value === "Hard Skill"
                  ? "#FBBF24"
                  : value === "Soft Skill"
                  ? "#5E35B1"
                  : "black",
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "ชื่อกิจกรรม",
      flex: 2,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {params.value ?? "-"}
        </Box>
      ),
    },
    {
      field: "endDate",
      headerName: "วันที่ปิดทำแบบประเมิน",
      flex: 1.5,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const date = new Date(params.value);
        const now = new Date();
        const isPast = date < now;

        const formatter = new Intl.DateTimeFormat("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <span className={`font-medium ${isPast ? "text-red-500" : ""}`}>
            {formatter.format(date)}
          </span>
        );
      },
    },
    {
      field: "registered",
      headerName: "จำนวนที่ลงทะเบียน",
      flex: 1,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center gap-1 font-semibold">
          {params.value} <User />
        </div>
      ),
    },
  ];

  return (
    <CustomCard className="mt-6 mx-auto" width="100%">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ลิสต์กิจกรรมที่ยังไม่ได้ทำแบบประเมิน
      </Typography>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          getRowId={(row) => row.id}
          columns={columns}
          pageSizeOptions={[5, 10]}
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          sx={{
            "& .super-app-theme--header": {
              backgroundColor: "#1E3A8A",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "16px",
              textAlign: "center", // ✅ ข้อความหัวตารางกึ่งกลาง
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center", // ✅ แนวตั้งกึ่งกลาง
              justifyContent: "center", // ✅ แนวนอนกึ่งกลาง
              textAlign: "center", // ✅ ข้อความกึ่งกลาง
            },
            "& .MuiDataGrid-columnHeaders": {
              textAlign: "center",
            },
            "& .MuiDataGrid-columnHeader": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              textAlign: "center",
              width: "100%",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none !important",
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
    </CustomCard>
  );
};

export default PendingEvaluation;
