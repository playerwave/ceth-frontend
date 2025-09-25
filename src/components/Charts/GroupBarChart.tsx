import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GroupBarChartData {
  name: string;
  [key: string]: string | number;
}

interface GroupBarChartProps {
  data: GroupBarChartData[];
  height?: number;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom";
  yAxisLabel?: string;
  xAxisLabel?: string;
  colors?: string[];
  barSize?: number;
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

export default function GroupBarChart({
  data,
  height = 300,
  showLegend = true,
  legendPosition = "bottom",
  yAxisLabel = "จำนวนคน",
  xAxisLabel = "กลุ่ม",
  colors = ["#10B981", "#EF4444"], // Green, Red
  barSize = 30
}: GroupBarChartProps) {
  // Debug log
  console.log("🔍 [GroupBarChart] Data received:", data);

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">ไม่มีข้อมูลสำหรับแสดงกราฟ</p>
      </div>
    );
  }

  // สร้าง keys สำหรับ Bar components (ยกเว้น 'name')
  const dataKeys = Object.keys(data[0] || {}).filter(key => key !== 'name');

  // แปลงสี Tailwind เป็น hex
  const convertedColors = colors.map(color => getTailwindColor(color));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [value, name]}
            labelFormatter={(label) => `กลุ่ม ${label}`}
          />
          {showLegend && (
            <Legend 
              verticalAlign={legendPosition === "top" ? "top" : "bottom"}
              height={36}
            />
          )}
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={convertedColors[index % convertedColors.length]}
              name={key}
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
