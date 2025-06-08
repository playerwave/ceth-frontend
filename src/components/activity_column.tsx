import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, Typography, Box } from "@mui/material";
import {
  Album,
  HouseWifi,
  MapPin,
  School as SchoolLucide,
  User,
} from "lucide-react";
<<<<<<< HEAD
import { Switch } from "@mui/material";
import { Activity } from "../types/Admin/activity_list_type";
=======
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e

// 👉 type ที่สามารถใช้ปรับรูปแบบคอลัมน์ได้
type ColumnOptions = {
  enableTypeFilter?: boolean;
  includeStatus?: boolean;
  selectedTypes?: string[]; // ✅ เพิ่ม
  handleTypeChange?: (type: string) => void; // ✅ เพิ่ม
<<<<<<< HEAD
  handleStatusToggle?: (row: Activity) => void;
=======
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
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
<<<<<<< HEAD
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
=======
        return <span>{companyLecturer}</span>;
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
      },
    },
    {
      field: "type",
      headerName: "ประเภท",
      width: 220,
      renderHeader: () => (
<<<<<<< HEAD
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
=======
        <Box display="flex" alignItems="center" gap={1}>
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
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
<<<<<<< HEAD
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
=======
      renderCell: (params) =>
        typeof params.value === "string" && params.value.length > 40
          ? params.value.slice(0, 40) + "..."
          : params.value ?? "-",
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
    },
    {
      field: "date",
      headerName: "วันที่จัดกิจกรรม",
<<<<<<< HEAD
      minWidth: 190, // ✅ เพิ่มขนาดขั้นต่ำที่พอแสดงทั้งวันที่
      flex: 0.5, // ✅ ขยายคอลัมน์แบบ responsive ได้
=======
      flex: 1,
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
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
<<<<<<< HEAD
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              minWidth: 120,
            }}
          >
=======
          <span>
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
            {isSameDay
              ? `${formatDate(start)} - ${formatTime(start)} - ${formatTime(
                  end
                )} น.`
              : `${formatDate(start)} - ${formatDate(end)}`}
<<<<<<< HEAD
          </Box>
=======
          </span>
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
        );
      },
    },
    {
      field: "location_type",
      headerName: "สถานที่",
<<<<<<< HEAD
      width: 120,
=======
      width: 90,
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
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
<<<<<<< HEAD
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
=======
        return map[value] ?? <span style={{ color: "gray" }}>ไม่ได้ระบุ</span>;
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
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
<<<<<<< HEAD
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
=======
      width: 100,
      renderCell: (params) => {
        const isPublic = params.value === "Public";
        return (
          <Box
            onClick={() => console.log("toggle")}
            sx={{
              display: "flex",
              alignItems: "center",
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
              bgcolor: isPublic ? "#22c55e" : "#ef4444",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: "9999px",
              fontSize: 12,
              fontWeight: 600,
<<<<<<< HEAD
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
=======
              gap: 1.2,
              minWidth: "80px",
              justifyContent: "space-between",
              cursor: "pointer",
              height: 23,
            }}
          >
            {isPublic ? (
              <>
                {params.value}
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: "white",
                  }}
                />
              </>
            ) : (
              <>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: "white",
                  }}
                />
                {params.value}
              </>
            )}
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
          </Box>
        );
      },
    });
  }

  return columns;
};
