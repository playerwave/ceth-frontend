import React from "react";
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

type EventFormat = "Online" | "Onsite" | "Course" | string;

interface ActivitySummaryItem {
  activityId: number;
  activityName: string;
  startDate: string; // ISO string
  eventFormat: EventFormat;
  registered: number; // คนที่ลงทะเบียน
  attendedFull: number; // คนที่เข้าร่วมครบ (มีทั้ง time_in และ time_out)
  attendedPartial: number; // คนที่ไม่เข้าร่วม หรือเข้าร่วมไม่เต็มเวลา
}

interface SummaryActivityCardProps {
  fetchSummary?: (params: {
    year: number;
    month?: number; // 1-12
    quarter?: number | "all";
  }) => Promise<ActivitySummaryItem[]>;
}

const QUARTER_OPTIONS: Array<{ value: number | "all"; label: string; months?: number[] }> = [
  { value: "all", label: "ทุกไตรมาส" },
  { value: 1, label: "ไตรมาส 1 (ม.ค. - มี.ค.)", months: [1, 2, 3] },
  { value: 2, label: "ไตรมาส 2 (เม.ย. - มิ.ย.)", months: [4, 5, 6] },
  { value: 3, label: "ไตรมาส 3 (ก.ค. - ก.ย.)", months: [7, 8, 9] },
  { value: 4, label: "ไตรมาส 4 (ต.ค. - ธ.ค.)", months: [10, 11, 12] },
];

const MONTH_OPTIONS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const formatDateKey = (iso: string) => {
  const d = new Date(iso);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${day}/${month}`;
};

const SummaryActivityCard: React.FC<SummaryActivityCardProps> = ({ fetchSummary }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  const [year] = React.useState<number>(currentYear);
  const [quarter, setQuarter] = React.useState<number | "all">("all");
  const [month, setMonth] = React.useState<number>(currentMonth);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rawData, setRawData] = React.useState<ActivitySummaryItem[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      if (fetchSummary) {
        const data = await fetchSummary({ year, month, quarter });
        setRawData(data || []);
      } else {
        setRawData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchSummary, year, month, quarter]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const selectedQuarter = QUARTER_OPTIONS.find((q) => q.value === quarter);
    const monthsInQuarter = selectedQuarter?.months;

    return (rawData || [])
      .filter((item) => item.eventFormat === "Online" || item.eventFormat === "Onsite")
      .filter((item) => {
        const d = new Date(item.startDate);
        if (d.getFullYear() !== year) return false;
        if (quarter !== "all" && monthsInQuarter && !monthsInQuarter.includes(d.getMonth() + 1)) {
          return false;
        }
        if (quarter === "all" && month && d.getMonth() + 1 !== month) return false;
        return true;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map((item) => ({
        name: `${formatDateKey(item.startDate)}\n${item.activityName}`,
        registered: item.registered,
        attendedFull: item.attendedFull,
        attendedPartial: item.attendedPartial,
      }));
  }, [rawData, year, month, quarter]);

  const handleQuarterChange = (e: SelectChangeEvent<number | "all">) => {
    const val = e.target.value === "all" ? "all" : Number(e.target.value);
    setQuarter(val);
  };

  const handleMonthChange = (e: SelectChangeEvent<number>) => {
    setMonth(Number(e.target.value));
  };

  const isMonthDisabled = quarter !== "all"; // ถ้าเลือกไตรมาส ให้ fix ตามไตรมาส

  return (
    <CustomCard className="w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">สรุปกิจกรรมตามช่วงเวลา</h3>
        <div className="flex items-center gap-10">
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
              {MONTH_OPTIONS.map((m, idx) => (
                <MenuItem key={m} value={idx + 1}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} label={{ value: "จำนวนคน", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="registered" name="ลงทะเบียน" stroke="#1890ff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="attendedFull" name="เข้าร่วมจริง" stroke="#52c41a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="attendedPartial" name="ไม่เข้าร่วมหรือไม่เต็มเวลา" stroke="#faad14" strokeWidth={2} dot={false} />
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


