import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface PieChartData {
  name: string;
  value: number | string;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  height?: number;
  outerRadius?: number;
  showLegend?: boolean;
  legendPosition?: "right" | "bottom";
  totalText?: string;
}

export default function PieChart({
  data,
  height = 250,
  outerRadius = 90,
  showLegend = true,
  legendPosition = "right",
  totalText
}: PieChartProps) {
  // แปลง string values เป็น number สำหรับ recharts
  const chartData = data.map(item => ({
    ...item,
    value: typeof item.value === 'string' ? parseFloat(item.value) : item.value
  }));

  // Debug log
  console.log("🔍 [PieChart] Data received:", data);
  console.log("🔍 [PieChart] Chart data after conversion:", chartData);

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">ไม่มีข้อมูลสำหรับแสดงกราฟ</p>
      </div>
    );
  }

  return (
    <div className={`flex ${legendPosition === "right" ? "flex-col lg:flex-row items-center lg:items-start" : "flex-col items-center"} gap-6`}>
      {/* Pie Chart */}
      <div className={`${legendPosition === "right" ? "w-full lg:w-[60%]" : "w-full"} h-[${height}px]`}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="text-sm text-gray-700">
          {data.map(({ name, value, color }) => (
            <div key={name} className="flex items-center gap-2 mb-5">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span>
                {name} คิดเป็น {value}%
              </span>
            </div>
          ))}
          {totalText && (
            <p className="mt-4 text-sm text-gray-500">
              {totalText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
