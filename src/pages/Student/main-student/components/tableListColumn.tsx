import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, Typography, Box } from "@mui/material";
import { User } from "lucide-react";

type ColumnOptions = {
  enableTypeFilter?: boolean;
  includeStatus?: boolean;
  selectedTypes?: string[];
  handleTypeChange?: (type: string) => void;
};

export const getTableListColumn = (
  options: ColumnOptions = {}
): GridColDef[] => {
  const columns: GridColDef[] = [
    // ✅ ชื่อบริษัท ต้องใช้ presenter_company_name
    {
      field: "presenter_company_name",
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
    {
      field: "type",
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
              checked={options.selectedTypes?.includes("Hard") ?? false}
              onChange={() => options.handleTypeChange?.("Hard")}
              sx={{
                color: "#F3D9B1",
                "&.Mui-checked": { color: "#F3D9B1" },
                bgcolor: "#1E3A8A",
                borderRadius: "4px",
              }}
            />
            <Checkbox
              size="small"
              checked={options.selectedTypes?.includes("Soft") ?? false}
              onChange={() => options.handleTypeChange?.("Soft")}
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
                value === "Hard"
                  ? "#FFF4CC"
                  : value === "Soft"
                    ? "#EDE7F6"
                    : "transparent",
              color:
                value === "Hard"
                  ? "#FBBF24"
                  : value === "Soft"
                    ? "#5E35B1"
                    : "black",
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    // ✅ ชื่อกิจกรรม
    {
      field: "activity_name",
      headerName: "ชื่อกิจกรรม",
      width: 480,
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
    // ✅ วันที่จัด (start_activity_date / end_activity_date)
    {
      field: "start_activity_date",
      headerName: "วันที่จัดกิจกรรม",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const start = params.row.start_activity_date;
        const end = params.row.end_activity_date;
        if (!start || !end) return <span>ยังไม่ได้กำหนด</span>;

        const startDate = new Date(start);
        const endDate = new Date(end);

        // ✅ format วันที่แบบไทย (พ.ศ.)
        const formatDateThai = (date: Date) => {
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear() + 543; // +543 เป็นปีไทย
          return `${day}/${month}/${year}`;
        };

        // ✅ format เวลาแบบ 24 ชม.
        const formatTime = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}.${minutes}`;
        };

        return (
          <span>
            {`${formatDateThai(startDate)} - ${formatTime(startDate)} - ${formatTime(
              endDate
            )} น.`}
          </span>
        );
      },
    },
    // ✅ ที่นั่ง
    {
      field: "seat",
      headerName: "ที่นั่ง",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const totalSeats = params.row.seat;
        const eventFormat = params.row.event_format;
        const enrolledCount = params.row.registered_count; // ✅ ใช้ any type เพื่อหลีกเลี่ยง linter error

        // ✅ ถ้าเป็น Course ให้แสดง "-"
        if (eventFormat === "Course") {
          return <span>-</span>;
        }

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <span>
              {enrolledCount}/{totalSeats != null ? totalSeats : "-"}
            </span>
            <User />
          </Box>
        );
      },
    },
  ];
  if (options.includeStatus) {
    columns.push({
      field: "activity_status",
      headerName: "สถานะ",
      width: 100,
      renderCell: (params) => {
        const isPublic = params.value === "Public";
        return (
          <Box
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
              height: 23,
            }}
          >
            {params.value}
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: "white",
              }}
            />
          </Box>
        );
      },
    });
  }

  return columns;
};
