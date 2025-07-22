// src/components/Table_re/activityColumns.ts

import { GridColDef } from "@mui/x-data-grid";
import {
  Chip,
  Checkbox,
  Typography,
  Box,
  IconButton, // ✅ เพิ่ม
  Menu, // ✅ เพิ่ม
  MenuItem, // ✅ เพิ่ม
} from "@mui/material";
import {
  Album,
  HouseWifi,
  MapPin,
  School as SchoolLucide,
  User,
} from "lucide-react";
import React, { useState } from "react"; // ✅ เพิ่ม React และ useState
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Activity } from "../types/model"; // ตรวจสอบเส้นทางให้ถูกต้อง

// 👉 type ที่สามารถใช้ปรับรูปแบบคอลัมน์ได้
type ColumnOptions = {
  enableTypeFilter?: boolean;
  includeStatus?: boolean;
  selectedTypes?: string[];
  handleTypeChange?: (type: string) => void;
  handleStatusToggle?: (row: Activity) => void;
  includeRecommend?: boolean;
  selectedLocations?: string[];
  handleLocationChange?: (locationType: string) => void;
};

// ✅ Custom Header Component สำหรับคอลัมน์สถานที่ (event_format)
const LocationFilterHeader: React.FC<{
  selectedLocations: string[];
  handleLocationChange: (locationType: string) => void;
}> = ({ selectedLocations, handleLocationChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (locationType: string) => {
    handleLocationChange(locationType);
  };

  return (
    <Box display="flex" alignItems="center" gap={0}>
      {" "}
      {/* ลด gap */}
      <MapPin fontSize="small" />
      <IconButton
        aria-label="filter location"
        aria-controls={open ? "location-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        sx={{ ml: 0 }}
      >
        <KeyboardArrowDownIcon sx={{ color: "white" }} />{" "}
        {/* ✅ เปลี่ยนตรงนี้ */}
      </IconButton>
      <Menu
        id="location-menu"
        MenuListProps={{
          "aria-labelledby": "filter-location-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={(e) => e.stopPropagation()}>
          {" "}
          {/* หยุด event propagation เพื่อไม่ให้ Menu ปิดเมื่อคลิก Checkbox */}
          <Checkbox
            size="small"
            checked={selectedLocations.includes("Onsite")}
            onChange={() => handleCheckboxChange("Onsite")}
          />
          <Typography variant="body2">Onsite</Typography>
        </MenuItem>
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <Checkbox
            size="small"
            checked={selectedLocations.includes("Online")}
            onChange={() => handleCheckboxChange("Online")}
          />
          <Typography variant="body2">Online</Typography>
        </MenuItem>
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <Checkbox
            size="small"
            checked={selectedLocations.includes("Course")}
            onChange={() => handleCheckboxChange("Course")}
          />
          <Typography variant="body2">Course</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export const getActivityColumns = (
  options: ColumnOptions = {}
): GridColDef<Activity>[] => {
  const columns: GridColDef<Activity>[] = [
    {
      field: "presenter_company_name",
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
          {options.enableTypeFilter && (
            <>
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
            </>
          )}
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
                  : value === "Hard"
                    ? "#FFF4CC"
                    : "#EDE7F6",
              color:
                value === "Hard"
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
      field: "activity_name",
      headerName: "ชื่อกิจกรรม",
      width: 240,
      renderCell: (params) =>
        typeof params.value === "string" && params.value.length > 40
          ? params.value.slice(0, 40) + "..."
          : (params.value ?? "-"),
    },
    {
      field: "start_register_date",
      headerName: "วันที่จัดกิจกรรม",
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const start = params.row.start_register_date;
        const end = params.row.end_register_date;
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
              : `${formatDate(start)} - ${formatTime(end)}`}
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
        const totalSeats = params.row.seat;
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {totalSeats != null ? `${totalSeats} ` : "- "} <User />
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
