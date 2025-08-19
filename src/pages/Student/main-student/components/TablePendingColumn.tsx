import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, Typography, Box } from "@mui/material";
import { School as SchoolLucide, User } from "lucide-react";

type ColumnOptions = {
  enableTypeFilter?: boolean;
  selectedTypes?: string[];
  handleTypeChange?: (type: string) => void;
};

export const getTablePendingColumn = (
  options: ColumnOptions = {}
): GridColDef[] => {
  const columns: GridColDef[] = [
    // ชื่อบริษัท/วิทยากร
    {
      field: "ac_company_lecturer",
      headerName: "ชื่อบริษัท/วิทยากร",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          title={params.value}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
            width: "100%",
          }}
        >
          {params.value ?? "ไม่มีชื่อ"}
        </span>
      ),
    },
    // ประเภท
    {
      field: "ac_type",
      headerName: "ประเภท",
      sortable: false,
      width: 220,
      align: "center",
      headerAlign: "center",
      renderHeader: () => {
        if (!options.enableTypeFilter) {
          return <Typography fontWeight={600}>ประเภท</Typography>;
        }
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={600} mr={1}>
              ประเภท
            </Typography>
            <Checkbox
              size="small"
              checked={options.selectedTypes?.includes("Hard Skill") ?? false}
              onChange={() => options.handleTypeChange?.("Hard Skill")}
              sx={{
                color: "#F3D9B1",
                "&.Mui-checked": { color: "#F3D9B1" },
                bgcolor: "#1E3A8A",
                borderRadius: "4px",
              }}
            />
            <Checkbox
              size="small"
              checked={options.selectedTypes?.includes("Soft Skill") ?? false}
              onChange={() => options.handleTypeChange?.("Soft Skill")}
              sx={{
                color: "#E9D5FF",
                "&.Mui-checked": { color: "#E9D5FF" },
                bgcolor: "#1E3A8A",
                borderRadius: "4px",
              }}
            />
          </Box>
        );
      },
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
    // ชื่อกิจกรรม
    {
      field: "ac_name",
      headerName: "ชื่อกิจกรรม",
      width: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          title={params.value}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
            width: "100%",
          }}
        >
          {params.value ?? "-"}
        </span>
      ),
    },
    // สถานะกิจกรรม
    {
      field: "activity_state",
      headerName: "สถานะกิจกรรม",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let color = "#666";
        let bgColor = "#f5f5f5";
        
        if (value === "End Activity") {
          color = "#d97706";
          bgColor = "#fef3c7";
        } else if (value === "Start Assessment") {
          color = "#059669";
          bgColor = "#d1fae5";
        }
        
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor: bgColor,
              color: color,
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    // วันที่เริ่มประเมิน
    {
      field: "ac_start_assessment",
      headerName: "วันที่เริ่มประเมิน",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return <span>ยังไม่กำหนด</span>;
        
        const date = new Date(params.value);
        const formatDateThai = (date: Date) => {
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear() + 543;
          return `${day}/${month}/${year}`;
        };
        
        const formatTime = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}.${minutes}`;
        };
        
        return (
          <span>
            {`${formatDateThai(date)} ${formatTime(date)} น.`}
          </span>
        );
      },
    },
    // วันที่สิ้นสุดประเมิน
    {
      field: "ac_end_assessment",
      headerName: "วันที่สิ้นสุดประเมิน",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return <span>ยังไม่กำหนด</span>;
        
        const date = new Date(params.value);
        const formatDateThai = (date: Date) => {
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear() + 543;
          return `${day}/${month}/${year}`;
        };
        
        const formatTime = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}.${minutes}`;
        };
        
        return (
          <span>
            {`${formatDateThai(date)} ${formatTime(date)} น.`}
          </span>
        );
      },
    },
    // สถานที่
    {
      field: "ac_location_type",
      headerName: "สถานที่",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let icon = null;
        
        if (value === "Online") {
          icon = <SchoolLucide size={16} />;
        } else if (value === "Onsite") {
          icon = <User size={16} />;
        } else if (value === "Course") {
          icon = <SchoolLucide size={16} />;
        }
        
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <span>{value}</span>
          </Box>
        );
      },
    },
  ];

  return columns;
};
