import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import CustomCard from "../../../../../components/Card";
import Button from "../../../../../components/Button";

const barData = [
  { name: "SE", year1: 5, year2: 3, year3: 9, year4: 3 },
  { name: "AI", year1: 1, year2: 2, year3: 2, year4: 0 },
  { name: "CS", year1: 6, year2: 5, year3: 11, year4: 4 },
  { name: "IT", year1: 3, year2: 8, year3: 4, year4: 1 },
];

const barColors = ["#6659FF", "#404CCC", "#89AFFF", "#D9D9D9"];

const activityParticipation = [
  { label: "ผู้ลงทะเบียน", count: 50, total: 50, color: "#6659FF" },
  { label: "เข้าเต็มเวลา", count: 46, total: 50, color: "#52C41A" },
  { label: "เข้าไม่เต็มเวลา", count: 2, total: 50, color: "#FADB14" },
  { label: "ไม่ได้เข้าร่วม", count: 2, total: 50, color: "#F5222D" },
];

const studentStatus = [
  { label: "Normal", count: 31, total: 46, color: "#52C41A" },
  { label: "Risk", count: 15, total: 46, color: "#F5222D" },
];

const pieData = [
  { name: "มากที่สุด", value: 60.0, color: "#52C41A" },
  { name: "มาก", value: 26.7, color: "#B7EB8F" },
  { name: "ปานกลาง", value: 10.0, color: "#FADB14" },
  { name: "น้อย", value: 2.0, color: "#FA8C16" },
  { name: "น้อยที่สุด", value: 1.3, color: "#F5222D" },
];

const summaryTableData = [
  {
    question: "1.1 ความรู้ความเข้าใจในเรื่องเนื้อหาการอบรม",
    most: 47,
    much: 31,
    medium: 20,
    less: 3,
    least: 0,
    average: 4.21,
  },
  {
    question: "1.2 ความรู้ความเข้าใจในเรื่องที่บรรยาย/กิจกรรม",
    most: 63,
    much: 34,
    medium: 3,
    less: 1,
    least: 0,
    average: 4.57,
  },
  {
    question: "1.3 ท่านได้รับความรู้แนวคิด ประสบการณ์ใหม่ๆจากโครงการ",
    most: 64,
    much: 30,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.55,
  },
  {
    question:
      "1.4 ท่านสามารถนำสิ่งที่ได้รับจากโครงการนี้ไปใช้ประโยชน์ในการปฏิบัติงานในอนาคต",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
  {
    question: "1.5 รูปแบบและวิธีอบรมมีความเหมาะสมกับสถานการณ์ปัจจุบัน",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
];

const summaryTableData2 = [
  {
    question: "2.1 สมมติว่าเป็นคำถามข้อ2.1",
    most: 47,
    much: 31,
    medium: 20,
    less: 3,
    least: 0,
    average: 4.21,
  },
  {
    question: "2.2 สมมติว่าเป็นคำถามข้อ2.2",
    most: 63,
    much: 34,
    medium: 3,
    less: 1,
    least: 0,
    average: 4.57,
  },
  {
    question: "2.3 สมมติว่าเป็นคำถามข้อ2.3",
    most: 64,
    much: 30,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.55,
  },
  {
    question: "2.4 สมมติว่าเป็นคำถามข้อ2.4",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
  {
    question: "2.5 สมมติว่าเป็นคำถามข้อ2.5",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
];

const feedbackData = [
  { comment: "ข้าวอร่อยมากครับ", department: "CS" },
  { comment: "ควรหน้าขอไข่ดาวด้วยครับ", department: "SE" },
  { comment: "พิธีกรหล่อมากค่ะ :)", department: "AI" },
];

const ProgressBarRow = ({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) => {
  const percent = Math.round((count / total) * 100);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-gray-700 text-sm font-medium">
          {count} คน ({percent}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 mt-1">
        <div
          className="h-2 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

export default function SummaryPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* กราฟแท่ง + การเข้าร่วมกิจกรรม */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* กราฟแท่ง */}
        <CustomCard className="w-full p-6">
          <h2 className="font-bold text-lg mb-4">
            จำนวนนิสิตที่ลงทะเบียนแยกตามสาขาและชั้นปี
          </h2>

          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="w-full lg:w-2/3 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="year1" stackId="a" fill={barColors[0]} />
                  <Bar dataKey="year2" stackId="a" fill={barColors[1]} />
                  <Bar dataKey="year3" stackId="a" fill={barColors[2]} />
                  <Bar dataKey="year4" stackId="a" fill={barColors[3]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:w-1/3 text-sm text-gray-700 space-y-1">
              <p className="font-semibold">ชั้นปี</p>
              <ul className="space-y-1">
                <li>
                  <span className="inline-block w-3 h-3 rounded-full bg-[#6659FF] mr-2" />
                  ชั้นปี 1 : 5 คน (10.9%)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 rounded-full bg-[#404CCC] mr-2" />
                  ชั้นปี 2 : 11 คน (23.9%)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 rounded-full bg-[#89AFFF] mr-2" />
                  ชั้นปี 3 : 26 คน (56.5%)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 rounded-full bg-[#D9D9D9] mr-2" />
                  ชั้นปี 4 : 4 คน (8.7%)
                </li>
              </ul>
              <p className="mt-4 text-gray-500">
                จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)
              </p>
            </div>
          </div>
        </CustomCard>

        {/* การเข้าร่วม + สถานะนิสิต */}
        <CustomCard className="p-6 w-full lg:max-w-[380px] space-y-6">
          {/* การเข้าร่วมกิจกรรมของนิสิต */}
          <div>
            <h2 className="font-bold text-lg mb-2">
              การเข้าร่วมกิจกรรมของนิสิต
            </h2>
            {activityParticipation.map(({ label, count, total, color }) => {
              const percent = Math.round((count / total) * 100);
              return (
                <div key={label} className="space-y-1 mb-2">
                  <div className="flex justify-between">
                    <span>{label}</span>
                    <span className="text-sm text-gray-800">
                      {count} คน ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
            <p className="text-gray-500 text-sm mt-2">จากที่เปิดรับ 50 คน</p>
          </div>

          {/* สถานะนิสิต */}
          <div>
            <h2 className="font-bold text-lg mb-2">สถานะนิสิต</h2>
            {studentStatus.map(({ label, count, total, color }) => {
              const percent = Math.round((count / total) * 100);
              return (
                <div key={label} className="space-y-1 mb-2">
                  <div className="flex justify-between">
                    <span>{label}</span>
                    <span className="text-sm text-gray-800">
                      {count} คน ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
            <p className="text-gray-500 text-sm mt-2">
              จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)
            </p>
          </div>
        </CustomCard>
      </div>

      {/* 🔽 สรุปผลแบบประเมิน (วางไว้ด้านล่างหลัง 2 การ์ดด้านบน) */}
      <div className="space-y-8 mt-10">
        <h2 className="text-2xl font-bold">สรุปผลแบบประเมิน</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Pie Chart */}
          <CustomCard className="w-full lg:w-3/5">
            <h3 className="font-bold text-lg mb-4">แบบประเมินความพึงพอใจ</h3>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Pie Chart */}
              <div className="w-full lg:w-[60%] h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
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
              </div>

              {/* Legend */}
              <div className="text-sm text-gray-700 space-y-2">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span>
                      {name} คิดเป็น {value}%
                    </span>
                  </div>
                ))}
                <p className="mt-2 text-sm text-gray-500">
                  จากผู้ทำแบบประเมินทั้งหมด 40 คน
                </p>
              </div>
            </div>
          </CustomCard>

          {/* การทำแบบประเมิน */}
          <CustomCard className="w-full lg:w-2/5">
            <h3 className="font-bold text-lg mb-4">การทำแบบประเมินของนิสิต</h3>
            <div className="space-y-4 text-sm">
              {/* ทำแบบประเมินแล้ว */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>ทำแบบประเมินแล้ว</span>
                  <span className="text-green-600 font-medium">
                    40 คน (87.0%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-400"
                    style={{ width: "87%" }}
                  ></div>
                </div>
              </div>

              {/* ยังไม่ทำแบบประเมิน */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>ยังไม่ทำแบบประเมิน</span>
                  <span className="text-red-500 font-medium">6 คน (13.0%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-400"
                    style={{ width: "13%" }}
                  ></div>
                </div>
              </div>

              {/* สรุปจำนวนผู้เข้าร่วม */}
              <p className="mt-2 text-sm text-gray-500">
                จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)
              </p>
            </div>
          </CustomCard>
        </div>

        {/* ตารางผลการประเมิน */}
        <CustomCard>
          <h3 className="font-bold text-lg mb-4">
            หัวข้อ: 1. ประเมินผลเนื้อหาการอบรม
          </h3>
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left text-[#A0AEC0]">
                <th className="p-2">คำถาม</th>
                <th className="p-2 text-center">มากที่สุด</th>
                <th className="p-2 text-center">มาก</th>
                <th className="p-2 text-center">ปานกลาง</th>
                <th className="p-2 text-center">น้อย</th>
                <th className="p-2 text-center">น้อยที่สุด</th>
                <th className="p-2 text-right">ค่าเฉลี่ย</th>
              </tr>
            </thead>
            <tbody>
              {summaryTableData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{item.question}</td>
                  <td className="p-2 text-center">{item.most}</td>
                  <td className="p-2 text-center">{item.much}</td>
                  <td className="p-2 text-center">{item.medium}</td>
                  <td className="p-2 text-center">{item.less}</td>
                  <td className="p-2 text-center">{item.least}</td>
                  <td className="p-2 text-right font-semibold">
                    {item.average.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CustomCard>

        <CustomCard>
          <h3 className="font-bold text-lg mb-4">หัวข้อ: 2. ประเมินวิทยากร</h3>
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left text-[#A0AEC0] font-semibold">
                <th className="p-2">คำถาม</th>
                <th className="p-2 text-center w-[80px]">มากที่สุด</th>
                <th className="p-2 text-center w-[80px]">มาก</th>
                <th className="p-2 text-center w-[80px]">ปานกลาง</th>
                <th className="p-2 text-center w-[80px]">น้อย</th>
                <th className="p-2 text-center w-[80px]">น้อยที่สุด</th>
                <th className="p-2 text-right w-[80px]">ค่าเฉลี่ย</th>
              </tr>
            </thead>
            <tbody>
              {summaryTableData2.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{item.question}</td>
                  <td className="p-2 text-center">{item.most}</td>
                  <td className="p-2 text-center">{item.much}</td>
                  <td className="p-2 text-center">{item.medium}</td>
                  <td className="p-2 text-center">{item.less}</td>
                  <td className="p-2 text-center">{item.least}</td>
                  <td className="p-2 text-right font-semibold">
                    {item.average.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CustomCard>

        <CustomCard>
          <h3 className="font-bold text-lg mb-4">ข้อเสนอแนะจากนิสิต</h3>
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left text-[#A0AEC0] font-semibold">
                <th className="p-2 w-3/4">ข้อเสนอแนะ</th>
                <th className="p-2 w-1/4 text-center">สาขา</th>
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 font-semibold">{item.comment}</td>
                  <td className="p-2 text-center font-semibold">
                    {item.department}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CustomCard>
        <Button  onClick={() => window.history.back()}>
        ← กลับ
      </Button>
      </div>
    </div>
  );
}
