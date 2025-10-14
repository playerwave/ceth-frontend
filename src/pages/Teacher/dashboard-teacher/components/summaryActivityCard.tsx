import React from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "@/components/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { getActiveActivityYears, getActivitySummary, ActivitySummaryItem } from "@/service/Teacher/activity.service";
import { useSecureLink } from "@/routes/secure/SecureRoute";
import Loading from "@/components/Loading";

type EventFormat = "Online" | "Onsite" | "Course" | string;

interface SummaryActivityCardProps {
  // ไม่ต้องส่ง fetchSummary แล้ว เพราะจะใช้ service โดยตรง
}

const QUARTER_OPTIONS: Array<{ value: number | "all"; label: string; months?: number[] }> = [
  { value: "all", label: "ทุกไตรมาส" },
  { value: 1, label: "ไตรมาส 1 (ม.ค. - มี.ค.)", months: [1, 2, 3] },
  { value: 2, label: "ไตรมาส 2 (เม.ย. - มิ.ย.)", months: [4, 5, 6] },
  { value: 3, label: "ไตรมาส 3 (ก.ค. - ก.ย.)", months: [7, 8, 9] },
  { value: 4, label: "ไตรมาส 4 (ต.ค. - ธ.ค.)", months: [10, 11, 12] },
];

const MONTH_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: 1, label: "มกราคม" },
  { value: 2, label: "กุมภาพันธ์" },
  { value: 3, label: "มีนาคม" },
  { value: 4, label: "เมษายน" },
  { value: 5, label: "พฤษภาคม" },
  { value: 6, label: "มิถุนายน" },
  { value: 7, label: "กรกฎาคม" },
  { value: 8, label: "สิงหาคม" },
  { value: 9, label: "กันยายน" },
  { value: 10, label: "ตุลาคม" },
  { value: 11, label: "พฤศจิกายน" },
  { value: 12, label: "ธันวาคม" },
];

const formatDateKey = (iso: string) => {
  const d = new Date(iso);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${day}/${month}`;
};

const SummaryActivityCard: React.FC<SummaryActivityCardProps> = () => {
  const navigate = useNavigate();
  const { createSecureLink } = useSecureLink();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  const [availableYears, setAvailableYears] = React.useState<number[]>([]);
  const [year, setYear] = React.useState<number>(currentYear);
  const [quarter, setQuarter] = React.useState<number | "all">("all");
  const [month, setMonth] = React.useState<number | "all">("all");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rawData, setRawData] = React.useState<ActivitySummaryItem[]>([]);

  // ✅ Load available years เมื่อ component mount
  React.useEffect(() => {
    const loadYears = async () => {
      try {
        console.log("📅 Loading available years...");
        const years = await getActiveActivityYears();
        console.log("✅ Available years:", years);
        setAvailableYears(years);
        
        // ✅ ถ้าปีปัจจุบันไม่มีในรายการ ให้เลือกปีแรก
        if (years.length > 0 && !years.includes(currentYear)) {
          setYear(years[0]);
        }
      } catch (error) {
        console.error("❌ Error loading years:", error);
        // ✅ ถ้า error ให้ใช้ปีปัจจุบัน
        setAvailableYears([currentYear]);
      }
    };
    
    loadYears();
  }, [currentYear]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      console.log("📊 Loading activity summary...");
      // ✅ ส่ง month เฉพาะเมื่อไม่ใช่ "all"
      const params: any = { year, quarter };
      if (month !== "all") {
        params.month = month;
      }
      const data = await getActivitySummary(params);
      setRawData(data || []);
    } catch (error) {
      console.error("❌ Error loading summary:", error);
      setRawData([]);
    } finally {
      setLoading(false);
    }
  }, [year, month, quarter]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = React.useMemo(() => {
    // ✅ Backend filter แล้ว ไม่ต้อง filter ซ้ำใน frontend
    return (rawData || [])
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map((item) => ({
        name: `${formatDateKey(item.startDate)}\n${item.activityName}`,
        registered: item.registered,
        attendedFull: item.attendedFull,
        attendedPartial: item.attendedPartial,
        activityId: item.activityId, // ✅ เก็บ activityId สำหรับ navigation
      }));
  }, [rawData]);

  // ✅ Handle click on chart (เมื่อคลิกที่จุดข้อมูลหรือเส้นกราฟ)
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedData = data.activePayload[0].payload;
      const activityId = clickedData.activityId;
      
      console.log("🖱️ Clicked on activity:", activityId, clickedData.name);
      
      // สร้าง secure link และ navigate
      const encryptedUrl = createSecureLink("/activity-info-admin", {
        id: activityId,
        name: "Activity Info",
        type: "view",
        isActive: true,
        timestamp: Date.now(),
      });
      
      console.log("🔐 Generated secure URL:", encryptedUrl);
      window.location.href = encryptedUrl;
    }
  };

  // ✅ Custom Tooltip ที่คลิกได้
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div 
          className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all min-w-[280px]"
          onClick={() => {
            console.log("🖱️ Tooltip clicked on activity:", data.activityId);
            const encryptedUrl = createSecureLink("/activity-info-admin", {
              id: data.activityId,
              name: "Activity Info",
              type: "view",
              isActive: true,
              timestamp: Date.now(),
            });
            window.location.href = encryptedUrl;
          }}
        >
          <p className="text-base font-bold text-gray-800 mb-3">📋 {data.name}</p>
          <p className="text-sm text-blue-600 mb-1">ลงทะเบียน: {data.registered} คน</p>
          <p className="text-sm text-green-600 mb-1">เข้าร่วมจริง: {data.attendedFull} คน</p>
          <p className="text-sm text-yellow-600 mb-3">ไม่เข้าร่วมหรือไม่เต็มเวลา: {data.attendedPartial} คน</p>
          <p className="text-sm text-gray-600 font-semibold italic">💡 คลิกเพื่อดูรายละเอียด</p>
        </div>
      );
    }
    return null;
  };

  const handleQuarterChange = (e: SelectChangeEvent<number | "all">) => {
    const val = e.target.value === "all" ? "all" : Number(e.target.value);
    setQuarter(val);
  };

  const handleMonthChange = (e: SelectChangeEvent<number | "all">) => {
    const val = e.target.value === "all" ? "all" : Number(e.target.value);
    setMonth(val);
  };

  const handleYearChange = (e: SelectChangeEvent<number>) => {
    setYear(Number(e.target.value));
  };

  const isMonthDisabled = quarter !== "all"; // ถ้าเลือกไตรมาส ให้ fix ตามไตรมาส

  // ✅ ใช้ปีที่มีกิจกรรมจริงๆ จาก backend
  const yearOptions = React.useMemo(() => {
    return availableYears.length > 0 ? availableYears : [currentYear];
  }, [availableYears, currentYear]);

  if (loading) return <Loading />;

  return (
    <CustomCard className="w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">สรุปกิจกรรมตามช่วงเวลา</h3>
        <div className="flex items-center gap-10">
          {/* ✅ Quarter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={quarter}
              onChange={handleQuarterChange}
              sx={{
                fontSize: "14px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              {QUARTER_OPTIONS.map((q) => (
                <MenuItem key={q.value.toString()} value={q.value}>
                  {q.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ Month Dropdown */}
          <FormControl size="small" sx={{ minWidth: 150 }} disabled={isMonthDisabled}>
            <Select
              value={month}
              onChange={handleMonthChange}
              sx={{
                fontSize: "14px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              {MONTH_OPTIONS.map((m) => (
                <MenuItem key={m.value.toString()} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ Year Dropdown */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={year}
              onChange={handleYearChange}
              sx={{
                fontSize: "14px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>
                  {y + 543} {/* แสดงเป็น พ.ศ. */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={filtered} 
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            onClick={handleChartClick}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} label={{ value: "จำนวนคน", angle: -90, position: "insideLeft" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="registered" 
              name="ลงทะเบียน" 
              stroke="#1890ff" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="attendedFull" 
              name="เข้าร่วมจริง" 
              stroke="#52c41a" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="attendedPartial" 
              name="ไม่เข้าร่วมหรือไม่เต็มเวลา" 
              stroke="#faad14" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {loading && (
        <div className="text-center text-gray-500 text-sm mt-2">กำลังโหลดข้อมูล...</div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 text-sm mt-2">ไม่มีข้อมูลสำหรับช่วงเวลานี้</div>
      )}
    </CustomCard>
  );
};

export default SummaryActivityCard;


