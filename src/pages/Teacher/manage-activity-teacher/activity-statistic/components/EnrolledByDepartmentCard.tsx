import CustomCard from "../../../../../components/Card";
import { BarChart3 } from "lucide-react";
import BarChartY from "../../../../../components/Charts/BarChartY";

const barData = [
  {
    name: "SE",
    year1: 5,
    year2: 3,
    year3: 9,
    year4: 3,
    total: 17,
    percent: "37.0%",
  },
  {
    name: "AI",
    year1: 1,
    year2: 2,
    year3: 2,
    year4: 1,
    total: 5,
    percent: "10.9%",
  },
  {
    name: "CS",
    year1: 6,
    year2: 5,
    year3: 11,
    year4: 4,
    total: 18,
    percent: "39.1%",
  },
  {
    name: "IT",
    year1: 3,
    year2: 8,
    year3: 4,
    year4: 4,
    total: 6,
    percent: "13.0%",
  },
];

const barLegend = [
  { label: "ชั้นปี 1", count: 15, percent: "10.9%", color: "#6659FF" },
  { label: "ชั้นปี 2", count: 11, percent: "23.9%", color: "#404CCC" },
  { label: "ชั้นปี 3", count: 26, percent: "56.5%", color: "#89AFFF" },
  { label: "ชั้นปี 4", count: 4, percent: "8.7%", color: "#D9D9D9" },
];

export default function EnrolledByDepartmentCard() {
  return (
    <CustomCard
      className="w-full
                max-w-[90vw]       
                sm:max-w-[600px]     
                md:max-w-[700px]    
                lg:max-w-[65%]
                p-4 sm:p-6
                relative
                mx-0
                self-start"
    >
      <div className="relative mb-4">
        <h2 className="font-bold text-lg pr-12 leading-snug">
          จำนวนนิสิตที่ลงทะเบียนแยกตามสาขาและชั้นปี
        </h2>

        <button className="absolute top-0 right-0 p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
          <BarChart3 className="w-5 h-5 text-[#7a5fff]" />
        </button>
      </div>

      <BarChartY 
        data={barData}
        legend={barLegend}
        stackKeys={["year1", "year2", "year3", "year4"]}
        colors={["#7a5fff", "#365eff", "#8fd6ff", "#d9d9d9"]}
        height={300}
        barSize={30}
        showLegend={true}
        legendPosition="right"
        totalText="จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)"
      />
    </CustomCard>
  );
}
