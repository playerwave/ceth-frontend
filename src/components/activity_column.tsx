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
  visitorStatus?: boolean;
  selectedTypes?: string[];
  handleTypeChange?: (type: string) => void;
  handleStatusToggle?: (row: Activity) => void;
  includeRecommend?: boolean;
  selectedLocations?: string[];
  handleLocationChange?: (locationType: string) => void;
  disableStatusToggle?: boolean; // ✅ เพิ่ม option สำหรับปิดปุ่ม Toggle
  showActivityState?: boolean; // ✅ เพิ่ม option สำหรับแสดง activity_state แทน status
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
      flex: 1.5, minWidth: 200,
      // width: 200,
      renderCell: (params) => {
        const companyLecturer = params.value ?? "ไม่มีชื่อ";
        return <span>{companyLecturer}</span>;
      },
    },
    {
      field: "type",
      headerName: "ประเภท",
      // width: 250,
       sortable: false,
      flex: 1.5, minWidth: 160,
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

        const styleMap: Record<string, { bg: string; color: string }> = {
          Hard: { bg: "#FFF4CC", color: "#FBBF24" },
          Soft: { bg: "#EDE7F6", color: "#5E35B1" },
          ไม่ได้ระบุ: { bg: "transparent", color: "black" },
        };

        const chipStyle = styleMap[value] ?? {
          bg: "#F3F4F6",
          color: "#374151",
        };

        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor: chipStyle.bg,
              color: chipStyle.color,
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    {
      field: "activity_name",
      headerName: "ชื่อกิจกรรม",
      flex: 1.8, minWidth: 240,
      // width: 280,
      renderCell: (params) =>
        typeof params.value === "string" && params.value.length > 40
          ? params.value.slice(0, 40) + "..."
          : (params.value ?? "-"),
    },
    {
      field: "start_register_date",
      headerName: "วันที่จัดกิจกรรม",
      flex: 1.3, minWidth: 180,
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
              {formatDateOnly(startActivityDate)} -{" "}
              {formatDateOnly(endActivityDate)}
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
      // width: 120,
      flex: 0.7, minWidth: 100,
      sortable: false,
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
      flex: 0.8, minWidth: 110,
      // width: 130,
      renderCell: (params) => {
        const totalSeats = params.row.seat;
        const eventFormat = params.row.event_format;
        const registeredCount = (params.row as any).registered_count || 0; // ✅ ใช้ registered_count แทน enrolled_count

        // ✅ ถ้าเป็น Course ให้แสดง "-"
        if (eventFormat === "Course") {
          return <span>-</span>;
        }

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <span>
              {registeredCount}/{totalSeats != null ? totalSeats : "-"}
            </span>
            <User />
          </Box>
        );
      },
    },
  ];

  if (options.includeStatus) {
    columns.push({
      field: options.showActivityState ? "activity_state" : "activity_status",
      headerName: options.showActivityState ? "สถานะกิจกรรม" : "สถานะ",
      flex: 0.9, minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        // ถ้า showActivityState = true ให้แสดง activity_state แทน
        if (options.showActivityState) {
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
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              {params.row.activity_state}
            </Box>
          );
        }

        // Logic เดิมสำหรับแสดง status และ toggle
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
    });
  }

  if (options.visitorStatus) {
    columns.push({
      field: "start_register",
      headerName: "เปิดให้ลงทะเบียน",
      // width: 130,
      flex: 0.8, minWidth: 110,
      renderCell: (params) => {
        const acStartRegisterRaw = params.row.activity_state;

        if (!acStartRegisterRaw) {
          return <span>-</span>; // ถ้าไม่มีสถานะ ให้แสดง "-"
        }

        console.log(`Status : ${acStartRegisterRaw}`);
        if (acStartRegisterRaw=== "Not Start") {
          return <span>ปิด</span>;
        } else if (acStartRegisterRaw=="Special Open Register") {
          return <span>รอบพิเศษ</span>;
        } else if (acStartRegisterRaw=="Open Register") {
          return <span>รอบปกติ</span>;
        }
      },
    });
  }
  return columns;
};
