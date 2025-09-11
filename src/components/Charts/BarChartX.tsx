interface BarChartXData {
  label: string;
  count: number;
  total: number;
  color?: string;
  barColor?: string; // For Tailwind CSS classes
}

interface BarChartXProps {
  data: BarChartXData[];
  title: string;
  totalText?: string;
  labelWidth?: string;
  useTailwindColors?: boolean; // Use Tailwind classes instead of hex colors
}

export default function BarChartX({
  data,
  title,
  totalText,
  labelWidth = "w-[100px]",
  useTailwindColors = false
}: BarChartXProps) {
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      {data.map(({ label, count, total, color, barColor }) => {
        const percent = Math.round((count / total) * 100);
        const minWidth = Math.max(percent, 2); // ความยาวขั้นต่ำ 2%
        return (
          <div
            key={label}
            className="flex items-center text-sm gap-4 mb-2"
          >
            {/* label */}
            <span className={labelWidth}>{label}</span>

            {/* progress bar */}
            <div className="flex-grow min-w-0">
              <div className="relative w-full h-2 rounded-full bg-gray-200">
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full ${
                    useTailwindColors ? barColor : ''
                  }`}
                  style={!useTailwindColors ? { 
                    width: `${minWidth}%`, 
                    backgroundColor: color 
                  } : { width: `${minWidth}%` }}
                ></div>
              </div>
            </div>

            {/* count */}
            <span className="whitespace-nowrap font-medium text-black">
              {count} คน ({percent}%)
            </span>
          </div>
        );
      })}
      {totalText && (
        <p className="text-gray-500 text-sm mt-2">{totalText}</p>
      )}
    </div>
  );
}
