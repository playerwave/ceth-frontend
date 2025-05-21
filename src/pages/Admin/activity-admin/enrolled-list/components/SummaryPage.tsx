import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const barData = [
  { name: "SE", year1: 5, year2: 3, year3: 9, year4: 3 },
  { name: "AI", year1: 1, year2: 2, year3: 2, year4: 0 },
  { name: "CS", year1: 6, year2: 5, year3: 11, year4: 4 },
  { name: "IT", year1: 3, year2: 8, year3: 4, year4: 1 },
];

// สีตามชั้นปี (ตามภาพ)
const barColors = ["#6659FF", "#404CCC", "#89AFFF", "#D9D9D9"];

const pieData = [
  { name: "มากที่สุด (5 คะแนน)", value: 60.0, color: "#52C41A" },
  { name: "มาก (4 คะแนน)", value: 26.7, color: "#B7EB8F" },
  { name: "ปานกลาง (3 คะแนน)", value: 10.0, color: "#FADB14" },
  { name: "น้อย (2 คะแนน)", value: 2.0, color: "#FA8C16" },
  { name: "น้อยที่สุด (1 คะแนน)", value: 1.3, color: "#F5222D" },
];

// ข้อมูล progress bars
const activityParticipation = [
  {
    label: "ผู้ลงทะเบียน",
    count: 50,
    total: 50,
    color: "#6659FF",
  },
  {
    label: "เข้าเต็มเวลา",
    count: 46,
    total: 50,
    color: "#52C41A",
  },
  {
    label: "เข้าไม่เต็มเวลา",
    count: 2,
    total: 50,
    color: "#FADB14",
  },
  {
    label: "ไม่ได้เข้าร่วม",
    count: 2,
    total: 50,
    color: "#F5222D",
  },
];

const studentStatus = [
  { label: "Normal", count: 31, total: 46, color: "#52C41A" },
  { label: "Risk", count: 15, total: 46, color: "#F5222D" },
];

const evaluationStatus = [
  { label: "ทำแบบประเมินแล้ว", count: 40, total: 46, color: "#52C41A" },
  { label: "ยังไม่ทำแบบประเมิน", count: 6, total: 46, color: "#F5222D" },
];

// Helper progress bar component
const ProgressBar = ({ count, total, color }: { count: number; total: number; color: string }) => {
  const percent = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 rounded-full flex-shrink-0"
        style={{ width: "80px", backgroundColor: color }}
      />
      <div className="flex-grow h-2 rounded-full bg-gray-200 relative">
        <div
          className="h-2 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color, opacity: 0.3 }}
        />
      </div>
      <div className="text-sm text-gray-600 min-w-[60px] text-right">{count} คน ({percent}%)</div>
    </div>
  );
};

export default function SummaryPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Section: แท่งจำนวน นิสิตแยกตามสาขาและชั้นปี */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:justify-between gap-6">
        <div className="md:flex-1">
          <h2 className="font-bold text-lg mb-4">จำนวนนิสิตที่ลงทะเบียนแยกตามสาขาและชั้นปี</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend
                formatter={(value) => {
                  switch (value) {
                    case "year1":
                      return "ชั้นปี 1";
                    case "year2":
                      return "ชั้นปี 2";
                    case "year3":
                      return "ชั้นปี 3";
                    case "year4":
                      return "ชั้นปี 4";
                    default:
                      return value;
                  }
                }}
              />
              <Bar dataKey="year1" stackId="a" fill={barColors[0]} />
              <Bar dataKey="year2" stackId="a" fill={barColors[1]} />
              <Bar dataKey="year3" stackId="a" fill={barColors[2]} />
              <Bar dataKey="year4" stackId="a" fill={barColors[3]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="md:w-80">
          <h3 className="font-semibold mb-2">ชั้นปี</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><span className="inline-block w-4 h-4 rounded-full bg-[#6659FF] mr-2"></span> ชั้นปี 1</li>
            <li><span className="inline-block w-4 h-4 rounded-full bg-[#404CCC] mr-2"></span> ชั้นปี 2</li>
            <li><span className="inline-block w-4 h-4 rounded-full bg-[#89AFFF] mr-2"></span> ชั้นปี 3</li>
            <li><span className="inline-block w-4 h-4 rounded-full bg-[#D9D9D9] mr-2"></span> ชั้นปี 4</li>
          </ul>
          <p className="mt-6 text-gray-500 text-sm">
            จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)
          </p>
        </div>
      </div>

      {/* Section: การเข้าร่วมกิจกรรมของนิสิต และ สถานะนิสิต */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
        {/* การเข้าร่วมกิจกรรม */}
        <div className="md:flex-1">
          <h2 className="font-bold text-lg mb-4">การเข้าร่วมกิจกรรมของนิสิต</h2>
          {activityParticipation.map(({ label, count, total, color }) => (
            <div key={label} className="mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              <ProgressBar count={count} total={total} color={color} />
            </div>
          ))}
          <p className="mt-4 text-gray-500 text-sm">จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)</p>
        </div>

        {/* สถานะนิสิต */}
        <div className="md:flex-1">
          <h2 className="font-bold text-lg mb-4">สถานะนิสิต</h2>
          {studentStatus.map(({ label, count, total, color }) => (
            <div key={label} className="mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              <ProgressBar count={count} total={total} color={color} />
            </div>
          ))}
          <p className="mt-4 text-gray-500 text-sm">จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)</p>
        </div>
      </div>

      {/* Section: สรุปผลแบบประเมิน */}
      <h2 className="font-bold text-2xl mb-4">สรุปผลแบบประเมิน</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* แบบประเมินความพึงพอใจ */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h3 className="font-semibold mb-4">แบบประเมินความพึงพอใจ</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {pieData.map(({ name, value, color }) => (
              <li key={name} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
                <span>{name} คิดเป็น {value}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* การทำแบบประเมิน */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">การทำแบบประเมินของนิสิต</h3>
          {evaluationStatus.map(({ label, count, total, color }) => (
            <div key={label} className="mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              <ProgressBar count={count} total={total} color={color} />
            </div>
          ))}
          <p className="mt-4 text-gray-500 text-sm">จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)</p>
        </div>
      </div>
    </div>
  );
}

