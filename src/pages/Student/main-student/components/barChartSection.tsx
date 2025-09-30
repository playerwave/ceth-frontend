// components/Student/Main/BarChartSection.tsx
// import { Card } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomCard from "../../../../components/Card";

const BarChartSection = () => {
  // 🔧 หากคุณมี data จริงให้รับผ่าน props แล้วแทนที่ dummyData ด้านล่าง
  const dummyData = [
    { month: "ม.ค.", softSkill: 2, hardSkill: 3 },
    { month: "ก.พ.", softSkill: 3, hardSkill: 2 },
    { month: "มี.ค.", softSkill: 4, hardSkill: 3 },
  ];

  return (
    <div className="flex-grow flex justify-start">
      <CustomCard
        height="auto"
        width="100%"
        className="w-full max-w-full md:max-w-[900px] lg:max-w-[1050px] p-2 shadow-xl"
      >
        <h2 className="text-lg font-bold text-center mb-4">
          กราฟแสดงจำนวน Soft Skill และ Hard Skill ในแต่ละเดือน
        </h2>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dummyData}
              margin={{ top: 10, right: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="softSkill"
                fill="#4169E1"
                name="Soft Skill"
                barSize={30}
              />
              <Bar
                dataKey="hardSkill"
                fill="#FFC107"
                name="Hard Skill"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CustomCard>
    </div>
  );
};

export default BarChartSection;
