import React from "react";
import CustomCard from "@/components/Card";
import GroupBarChart from "@/components/Charts/GroupBarChart";
import { Checkbox, FormControlLabel } from "@mui/material";

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-block w-4 h-4 rounded-sm`} style={{ backgroundColor: color }} />
      <span className="text-white text-base font-medium">{label}</span>
    </div>
  );
};

type DepartmentKey = "AAI" | "SE" | "CS" | "IT";

interface RiskStatusCardProps {
  data?: Record<DepartmentKey, { normal: number; risk: number }>;
}

const defaultData: Record<DepartmentKey, { normal: number; risk: number }> = {
  AAI: { normal: 570, risk: 30 },
  SE: { normal: 310, risk: 250 },
  CS: { normal: 220, risk: 193 },
  IT: { normal: 320, risk: 80 },
};

const BAR_COLORS = {
  normal: "#26D2BE",
  risk: "#7D47FA",
};

const RiskStatusCard: React.FC<RiskStatusCardProps> = ({ data }) => {
  const chartData = data || defaultData;
  const departments: DepartmentKey[] = ["AAI", "SE", "CS", "IT"];

  // แปลงข้อมูลให้เป็นรูปแบบที่ GroupBarChart ต้องการ
  const chartBarData = departments.map((dept) => ({
    name: dept,
    Risk: chartData[dept].risk,
    Normal: chartData[dept].normal,
  }));

  return (
    <CustomCard className="w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">กราฟแสดงสถานะความเสี่ยงของแต่ละสาขา</h3>
      </div>

      {/* วางกราฟและการ์ดชั้นปีให้อยู่ระดับเดียวกัน */}
      <div className="flex gap-4 items-center">
        {/* ส่วนกราฟ */}
        <div className="flex-1">
          <GroupBarChart
            data={chartBarData}
            height={300}
            showLegend={false}
            yAxisLabel="จำนวนนิสิต"
            xAxisLabel=""
            colors={[BAR_COLORS.risk, BAR_COLORS.normal]}
            barSize={30}
          />
        </div>

        {/* การ์ดชั้นปี จัดให้อยู่ระดับเดียวกับแท่งกราฟ */}
        <div className="self-center bg-[#102B6A] text-white rounded-md px-4 py-2 w-[180px] h-[350px]">
          <div className="flex items-center space-x-5 mb-10">
            <LegendItem color={BAR_COLORS.normal} label="Normal" />
            <LegendItem color={BAR_COLORS.risk} label="Risk" />
          </div>
          <div className="font-semibold mb-2">ชั้นปี</div>
          {[1, 2, 3, 4].map((y) => (
            <FormControlLabel
              key={y}
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                />
              }
              label={`ชั้นปี ${y}`}
              sx={{
                color: "white",
                marginBottom: "4px",
                "& .MuiFormControlLabel-label": {
                  fontSize: "16px",
                },
              }}
            />
          ))}
        </div>
      </div>
    </CustomCard>
  );
};

export default RiskStatusCard;


