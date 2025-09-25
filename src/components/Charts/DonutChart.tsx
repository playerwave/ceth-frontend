import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface DonutChartData {
  name: string;
  value: number | string;
  color: string;
}

// Helper function to convert Tailwind color to hex
const getTailwindColor = (colorClass: string): string => {
  const colorMap: { [key: string]: string } = {
    'bg-emerald-400': '#34D399',
    'bg-emerald-500': '#10B981',
    'bg-green-400': '#4ADE80',
    'bg-green-500': '#22C55E',
    'bg-red-400': '#F87171',
    'bg-red-500': '#EF4444',
    'bg-red-600': '#DC2626',
    'bg-blue-400': '#60A5FA',
    'bg-blue-500': '#3B82F6',
    'bg-yellow-400': '#FACC15',
    'bg-yellow-500': '#EAB308',
    'bg-purple-400': '#C084FC',
    'bg-purple-500': '#A855F7',
    'bg-pink-400': '#F472B6',
    'bg-pink-500': '#EC4899',
  };
  
  return colorMap[colorClass] || colorClass;
};

interface DonutChartProps {
  data: DonutChartData[];
  height?: number;
  outerRadius?: number;
  innerRadius?: number;
  showLegend?: boolean;
  legendPosition?: "right" | "bottom";
  totalText?: string;
  showTotal?: boolean;
}

export default function DonutChart({
  data,
  height = 250,
  outerRadius = 90,
  innerRadius = 50,
  showLegend = true,
  legendPosition = "right",
  totalText,
  showTotal = true
}: DonutChartProps) {
  // แปลง string values เป็น number และแปลงสี Tailwind เป็น hex
  const chartData = data.map(item => ({
    ...item,
    value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
    color: getTailwindColor(item.color)
  }));

  // คำนวณ total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Debug log
  console.log("🔍 [DonutChart] Data received:", data);
  console.log("🔍 [DonutChart] Chart data after conversion:", chartData);
  console.log("🔍 [DonutChart] Total:", total);

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
      {/* Donut Chart */}
      <div className={`${legendPosition === "right" ? "w-full lg:w-[60%]" : "w-full"} h-[${height}px] relative`}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        {showTotal && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">คน</div>
            </div>
          </div>
        )}
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
