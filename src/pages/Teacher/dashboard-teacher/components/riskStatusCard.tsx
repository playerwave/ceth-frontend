import React, { useState } from "react";
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
  dataByGrade?: Record<number, Record<DepartmentKey, { normal: number; risk: number }>>;
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

const RiskStatusCard: React.FC<RiskStatusCardProps> = ({ data, dataByGrade }) => {
  const departments: DepartmentKey[] = ["AAI", "SE", "CS", "IT"];
  
  // State สำหรับเก็บว่าชั้นปีไหนถูกเลือกบ้าง
  const [selectedGrades, setSelectedGrades] = useState<Set<number>>(new Set([1, 2, 3, 4]));

  // ฟังก์ชันสำหรับ toggle checkbox
  const handleGradeToggle = (grade: number) => {
    setSelectedGrades((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(grade)) {
        newSet.delete(grade);
      } else {
        newSet.add(grade);
      }
      return newSet;
    });
  };

  // คำนวณข้อมูลที่จะแสดงตามชั้นปีที่เลือก
  const chartData = React.useMemo(() => {
    console.log("🔄 [RiskStatusCard] Recalculating chartData...");
    console.log("   - selectedGrades:", Array.from(selectedGrades));
    console.log("   - dataByGrade:", dataByGrade);
    
    if (!dataByGrade) {
      console.log("   ⚠️ No dataByGrade, using default data");
      return data || defaultData;
    }

    // รวมข้อมูลจากชั้นปีที่เลือก
    const aggregated: Record<DepartmentKey, { normal: number; risk: number }> = {
      AAI: { normal: 0, risk: 0 },
      SE: { normal: 0, risk: 0 },
      CS: { normal: 0, risk: 0 },
      IT: { normal: 0, risk: 0 },
    };

    selectedGrades.forEach((grade) => {
      const gradeData = dataByGrade[grade];
      console.log(`   - Processing grade ${grade}:`, gradeData);
      if (gradeData) {
        departments.forEach((dept) => {
          aggregated[dept].normal += gradeData[dept]?.normal || 0;
          aggregated[dept].risk += gradeData[dept]?.risk || 0;
        });
      }
    });

    console.log("   ✅ Aggregated result:", aggregated);
    return aggregated;
  }, [dataByGrade, selectedGrades, data]);

  // แปลงข้อมูลให้เป็นรูปแบบที่ GroupBarChart ต้องการ
  const chartBarData = React.useMemo(() => {
    const result = departments.map((dept) => ({
      name: dept,
      Risk: chartData[dept].risk,
      Normal: chartData[dept].normal,
    }));
    console.log("📊 [RiskStatusCard] chartBarData:", result);
    return result;
  }, [chartData, departments]);

  return (
    <CustomCard className="w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">กราฟแสดงสถานะความเสี่ยงของแต่ละสาขา</h3>
      </div>

      {/* วางกราฟและการ์ดชั้นปีให้อยู่ระดับเดียวกัน */}
      <div className="flex gap-4 items-center">
        {/* ส่วนกราฟ */}
        <div className="flex-1">
          {selectedGrades.size === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500 text-lg">กรุณาเลือกชั้นปีอย่างน้อย 1 ชั้นปี</p>
            </div>
          ) : (
            <GroupBarChart
              data={chartBarData}
              height={300}
              showLegend={false}
              yAxisLabel="จำนวนนิสิต"
              xAxisLabel=""
              colors={[BAR_COLORS.risk, BAR_COLORS.normal]}
              barSize={40}
            />
          )}
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
                  checked={selectedGrades.has(y)}
                  onChange={() => handleGradeToggle(y)}
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


