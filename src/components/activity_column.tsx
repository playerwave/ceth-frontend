import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, Typography, Box } from "@mui/material";
import {
  Album,
  HouseWifi,
  MapPin,
  School as SchoolLucide,
  User,
} from "lucide-react";

// 👉 type ที่สามารถใช้ปรับรูปแบบคอลัมน์ได้
type ColumnOptions = {
  enableTypeFilter?: boolean;
  includeStatus?: boolean;
  selectedTypes?: string[]; // ✅ เพิ่ม
  handleTypeChange?: (type: string) => void; // ✅ เพิ่ม
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
        return <span>{companyLecturer}</span>;
      },
    },
    {
      field: "type",
      headerName: "ประเภท",
      width: 220,
      renderHeader: () => (
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
      renderCell: (params) =>
        typeof params.value === "string" && params.value.length > 40
          ? params.value.slice(0, 40) + "..."
          : params.value ?? "-",
    },
    {
      field: "date",
      headerName: "วันที่จัดกิจกรรม",
      flex: 1,
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
          <span>
            {isSameDay
              ? `${formatDate(start)} - ${formatTime(start)} - ${formatTime(
                  end
                )} น.`
              : `${formatDate(start)} - ${formatDate(end)}`}
          </span>
        );
      },
    },
    {
      field: "location_type",
      headerName: "สถานที่",
      width: 90,
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
        return map[value] ?? <span style={{ color: "gray" }}>ไม่ได้ระบุ</span>;
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
      width: 100,
      renderCell: (params) => {
        const isPublic = params.value === "Public";
        return (
          <Box
            onClick={() => console.log("toggle")}
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: isPublic ? "#22c55e" : "#ef4444",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: "9999px",
              fontSize: 12,
              fontWeight: 600,
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
          </Box>
        );
      },
    });
  }

  return columns;
};
