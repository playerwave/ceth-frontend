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
                max-w-[90vw]         // ✅ ขนาดที่กำหนดเอง สำหรับหน้าจอเล็ก (ต่ำกว่า md)
                sm:max-w-[600px]     // ✅ เมื่อ ≥ 640px (sm)
                md:max-w-[700px]     // ✅ เมื่อ ≥ 768px (md)
                lg:max-w-[35%]
                p-4 sm:p-6 relative
                mx-0 self-start h-[341px]"
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
