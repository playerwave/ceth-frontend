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
import Toggle from "./Toggle";
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
  disableStatusToggle?: boolean; // ✅ เพิ่ม option สำหรับปิดปุ่ม Toggle
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
      width: 200,
      renderCell: (params) => {
        const companyLecturer = params.value ?? "ไม่มีชื่อ";
        return <span>{companyLecturer}</span>;
      },
    },
    {
      field: "type",
      headerName: "ประเภท",
      width: 250,
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
      width: 280,
      renderCell: (params) =>
        typeof params.value === "string" && params.value.length > 40
          ? params.value.slice(0, 40) + "..."
          : (params.value ?? "-"),
    },
    {
      field: "start_register_date",
      headerName: "วันที่จัดกิจกรรม",
      width: 300,
      sortable: true,
      renderCell: (params) => {
        const eventFormat = params.row.event_format;
        const startActivityDate = params.row.start_activity_date;
        const endActivityDate = params.row.end_activity_date;

        // ✅ ฟังก์ชันสำหรับแปลงวันที่ให้เป็นรูปแบบ วัน/เดือน/ปี
        const formatDateOnly = (dateStr: string) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        };

        // ✅ ตรวจสอบ event_format และแสดงผลตามเงื่อนไข
        if (eventFormat === "Course") {
          // ✅ สำหรับ Course แสดง start_activity_date - end_activity_date
          if (!startActivityDate || !endActivityDate) {
            return <span>ยังไม่ได้กำหนด</span>;
          }
          return (
            <span>
              {formatDateOnly(startActivityDate)} - {formatDateOnly(endActivityDate)}
            </span>
          );
        } else {
          // ✅ สำหรับ Onsite และ Online แสดงแค่ start_activity_date
          if (!startActivityDate) {
            return <span>ยังไม่ได้กำหนด</span>;
          }
          return <span>{formatDateOnly(startActivityDate)}</span>;
        }
      },
    },

    {
      field: "event_format",
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
        return map[value] ?? <span style={{ color: "gray" }}>ไม่ได้ระบุ</span>;
      },
    },
    {
      field: "seat",
      headerName: "ที่นั่ง",
      width: 130,
      renderCell: (params) => {
        const totalSeats = params.row.seat;
        const eventFormat = params.row.event_format;
        const enrolledCount = (params.row as any).enrolled_count || 0; // ✅ ใช้ any type เพื่อหลีกเลี่ยง linter error
        
        // ✅ ถ้าเป็น Course ให้แสดง "-"
        if (eventFormat === "Course") {
          return <span>-</span>;
        }
        
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <span>{enrolledCount}/{totalSeats != null ? totalSeats : "-"}</span>
            <User />
          </Box>
        );
      },
    },
  ];

  if (options.includeStatus) {
    columns.push(
    {
      field: "activity_status",
      headerName: "สถานะ",
      width: 150,
  renderCell: (params) => {
    const isPublic = params.value === "Public";
    const isEvaluating = params.row.activity_state === "Start Assessment";
    const isDisabled = options.disableStatusToggle || isEvaluating;
    
    if (isEvaluating) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            py: 1,
            fontSize: 14,
            fontWeight: 600,
            height: 32,
          }}
        >
          {params.row.activity_state}
        </Box>
      );
    }

            return (
              <Toggle
                isPublic={isPublic}
                onToggle={() => options.handleStatusToggle?.(params.row)}
                disabled={isDisabled}
              />
            );
  },
}

    );
  }

  return columns;
};
