import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, Typography, Box } from "@mui/material";
import {
  Album,
  HouseWifi,
  MapPin,
  School as SchoolLucide,
  User,
} from "lucide-react";

type ColumnOptions = {
  enableTypeFilter?: boolean;
  includeStatus?: boolean;
  selectedTypes?: string[];
  handleTypeChange?: (type: string) => void;
};

export const getTablePendingColumn = (
  options: ColumnOptions = {},
): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: "company_lecturer",
      headerName: "ชื่อบริษัท/วิทยากร",
      width: 170,
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
    {
      field: "type",
      headerName: "ประเภท",
      sortable: false,
      width: 220,
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
    {
      field: "name",
      headerName: "ชื่อกิจกรรม",
      width: 240,
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
    {
      field: "end_assessment",
      headerName: "วันที่ปิดทำแบบประเมิน",
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const start = params.row.start_assessment;
        const end = params.row.end_assessment;
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

        const now = new Date();
        const isExpired = now > new Date(end); // ✅ เช็กว่าหมดเขตหรือยัง

        const displayText = isSameDay
          ? `${formatDate(start)} - ${formatTime(start)} - ${formatTime(
              end,
            )} น.`
          : `${formatDate(start)} - ${formatDate(end)}`;

        return (
          <span
            title={displayText}
            style={{
              color: isExpired ? "#dc2626" : "inherit", // ✅ สีแดงถ้าหมดเขต
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              display: "inline-block",
              width: "100%",
            }}
          >
            {displayText}
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
        return (
          map[params.value] ?? <span style={{ color: "gray" }}>ไม่ได้ระบุ</span>
        );
      },
    },
    {
      field: "seat",
      headerName: "ที่นั่ง",
      width: 100,
      renderCell: (params) => {
        const total = params.row.seat; // ✅ แก้จาก registered_count → seat
        const registered = params.row.registered_count;
        return total != null && registered != null ? (
          <Box display="flex" alignItems="center" gap={1}>
            {registered}/{total} <User />
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
