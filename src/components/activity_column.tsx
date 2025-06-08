import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, Typography, Box } from "@mui/material";
import {
  Album,
  HouseWifi,
  MapPin,
  School as SchoolLucide,
  User,
} from "lucide-react";
import { Switch } from "@mui/material";
import { Activity } from "../types/Admin/activity_list_type";

// 👉 type ที่สามารถใช้ปรับรูปแบบคอลัมน์ได้
type ColumnOptions = {
  enableTypeFilter?: boolean;
  includeStatus?: boolean;
  selectedTypes?: string[]; // ✅ เพิ่ม
  handleTypeChange?: (type: string) => void; // ✅ เพิ่ม
  handleStatusToggle?: (row: Activity) => void;
};

export const getActivityColumns = (
  options: ColumnOptions = {}
): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: "company_lecturer",
      headerName: "ชื่อบริษัท/วิทยากร",
      width: 170,
      renderCell: (params) => {
        const companyLecturer = params.value ?? "ไม่มีชื่อ";
        return (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {companyLecturer}
          </Box>
        );
      },
    },
    {
      field: "type",
      headerName: "ประเภท",
      width: 220,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
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
      ),
      renderCell: (params) => {
        const value = params.value ?? "ไม่ได้ระบุ";
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor:
                value === "ไม่ได้ระบุ"
                  ? "transparent"
                  : value === "Hard Skill"
                  ? "#FFF4CC"
                  : "#EDE7F6",
              color:
                value === "Hard Skill"
                  ? "#FBBF24"
                  : value === "ไม่ได้ระบุ"
                  ? "black"
                  : "#5E35B1",
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "ชื่อกิจกรรม",
      width: 240,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {typeof params.value === "string" && params.value.length > 40
            ? params.value.slice(0, 40) + "..."
            : params.value ?? "-"}
        </Box>
      ),
    },
    {
      field: "date",
      headerName: "วันที่จัดกิจกรรม",
      minWidth: 190, // ✅ เพิ่มขนาดขั้นต่ำที่พอแสดงทั้งวันที่
      flex: 0.5, // ✅ ขยายคอลัมน์แบบ responsive ได้
      sortable: true,
      renderCell: (params) => {
        const start = params.row.start_register;
        const end = params.row.end_register;
        if (!start || !end) return <span>ยังไม่ได้กำหนด</span>;
        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          return date.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        };
        const formatTime = (dateStr: string) => {
          const date = new Date(dateStr);
          return `${date.getHours().toString().padStart(2, "0")}.${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        };
        const isSameDay =
          new Date(start).toDateString() === new Date(end).toDateString();
        return (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              minWidth: 120,
            }}
          >
            {isSameDay
              ? `${formatDate(start)} - ${formatTime(start)} - ${formatTime(
                  end
                )} น.`
              : `${formatDate(start)} - ${formatDate(end)}`}
          </Box>
        );
      },
    },
    {
      field: "location_type",
      headerName: "สถานที่",
      width: 120,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1}>
          <MapPin fontSize="small" />
        </Box>
      ),
      renderCell: (params) => {
        const map: Record<string, JSX.Element> = {
          Onsite: <SchoolLucide fontSize="small" />,
          Online: <HouseWifi fontSize="small" />,
          Course: <Album fontSize="small" />,
        };
        const value = params.value;
        return (
          map[value] ?? (
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              ไม่ได้ระบุ
            </Box>
          )
        );
      },
    },
    {
      field: "seat",
      headerName: "ที่นั่ง",
      width: 100,
      renderCell: (params) => {
        const total = params.row.registered_count;
        const absent = params.row.not_attended_count;
        return total != null && absent != null ? (
          <Box display="flex" alignItems="center" gap={1}>
            {absent}/{total} <User />
          </Box>
        ) : (
          <span>-</span>
        );
      },
    },
  ];

  if (options.includeStatus) {
    columns.push({
      field: "status",
      headerName: "สถานะ",
      width: 140,
      renderCell: (params) => {
        const isPublic = params.value === "Public";

        const handleToggle = () => {
          console.log("✅ CLICK TOGGLE"); // จะต้องเห็นใน console
          options.handleStatusToggle?.(params.row); // เปิด Dialog
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: isPublic ? "#22c55e" : "#ef4444",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: "9999px",
              fontSize: 12,
              fontWeight: 600,
              minWidth: "100px",
              height: 30,
            }}
          >
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {isPublic ? "Public" : "Private"}
            </Typography>
            <Switch
              size="small"
              checked={isPublic}
              onClick={(e) => e.stopPropagation()} // 🛑 ป้องกัน row click
              onChange={(e) => {
                e.preventDefault(); // ❗ สำคัญมาก
                e.stopPropagation();
                handleToggle(); // ✅ เปิด dialog
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "white",
                },
                "& .MuiSwitch-track": {
                  bgcolor: "white",
                  opacity: 0.3,
                },
              }}
            />
          </Box>
        );
      },
    });
  }

  return columns;
};
