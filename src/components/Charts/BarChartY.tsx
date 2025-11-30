import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface BarChartYData {
  name: string;
  [key: string]: any; // Allow dynamic keys for different year levels
  total: number;
  percent: string;
}

interface BarChartYLegend {
  label: string;
  count: number;
  percent: string;
  color: string;
}

interface BarChartYProps {
  data: BarChartYData[];
  legend: BarChartYLegend[];
  stackKeys: string[]; // e.g., ["year1", "year2", "year3", "year4"]
  colors: string[]; // e.g., ["#7a5fff", "#365eff", "#8fd6ff", "#d9d9d9"]
  height?: number;
  barSize?: number;
  showLegend?: boolean;
  legendPosition?: "right" | "bottom";
  totalText?: string;
}

export default function BarChartY({
  data,
  legend,
  stackKeys,
  colors,
  height = 300,
  barSize = 30,
  showLegend = true,
  legendPosition = "right",
  totalText
}: BarChartYProps) {
  return (
    <div className={`flex ${legendPosition === "right" ? "flex-col lg:flex-row justify-between" : "flex-col items-center"} gap-6`}>
      {/* Bar Chart */}
      <div className={`${legendPosition === "right" ? "w-full lg:w-2/3" : "w-full"} h-[${height}px]`}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            barSize={barSize}
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#000000", fontSize: 16 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip />

            {stackKeys.map((key, index) => {
              const isLastBar = index === stackKeys.length - 1;
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="stack"
                  fill={colors[index]}
                  radius={isLastBar ? [10, 10, 0, 0] : undefined}
                >
                  {isLastBar && (
                    <LabelList
                      dataKey="total"
                      content={({ x, y, value, index }) => {
                        if (index === undefined || x === undefined || y === undefined) {
                          return null;
                        }
                        const percent = data[index]?.percent || "";
                        return (
                          <text
                            x={Number(x) + 20}
                            y={Number(y) - 10}
                            textAnchor="middle"
                            fill="#000000"
                            fontSize={12}
                          >
                            {value} ({percent})
                          </text>
                        );
                      }}
                    />
                  )}
                </Bar>
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className={`${legendPosition === "right" ? "lg:w-1/3" : "w-full"} text-sm text-gray-700 space-y-1`}>
          <ul className="space-y-6">
            {legend.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[idx] || '#9CA3AF' }}
                />
                {item.label} : {item.count} คน ({item.percent})
              </li>
            ))}
          </ul>

          {totalText && (
            <p className="mt-4 text-gray-500">
              {totalText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
