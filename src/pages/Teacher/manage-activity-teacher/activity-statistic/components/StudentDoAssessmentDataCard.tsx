import CustomCard from "../../../../../components/Card";
import BarChartX from "../../../../../components/Charts/BarChartX";

const evaluationStatusData = [
  {
    label: "ทำแบบประเมินแล้ว",
    count: 40,
    total: 46,
    barColor: "bg-green-400",
  },
  {
    label: "ยังไม่ทำแบบประเมิน",
    count: 6,
    total: 46,
    barColor: "bg-red-400",
  },
];

export default function StudentDoAssessmentDataCard() {
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
      <BarChartX 
        data={evaluationStatusData}
        title="การทำแบบประเมินของนิสิต"
        totalText="จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)"
        labelWidth="w-[120px]"
        useTailwindColors={true}
      />
    </CustomCard>
  );
}
