import CustomCard from "../../../../../components/Card";
import PieChart from "../../../../../components/Charts/PieChart";

const pieData = [
  { name: "มากที่สุด", value: 60.0, color: "#52C41A" },
  { name: "มาก", value: 26.7, color: "#B7EB8F" },
  { name: "ปานกลาง", value: 10.0, color: "#FADB14" },
  { name: "น้อย", value: 2.0, color: "#FA8C16" },
  { name: "น้อยที่สุด", value: 1.3, color: "#F5222D" },
];

export default function SatisfactionSurveyCard() {
  return (
    <CustomCard
      className="w-full
                max-w-[90vw]       
                sm:max-w-[600px]     
                md:max-w-[700px]    
                lg:max-w-full
                p-4 sm:p-6
                relative
                mx-0
                self-start
                h-full"
    >
      <h3 className="font-bold text-lg mb-4">แบบประเมินความพึงพอใจ</h3>

      <PieChart 
        data={pieData}
        height={250}
        outerRadius={90}
        showLegend={true}
        legendPosition="right"
        totalText="จากผู้ทำแบบประเมินทั้งหมด 40 คน"
      />
    </CustomCard>
  );
}
