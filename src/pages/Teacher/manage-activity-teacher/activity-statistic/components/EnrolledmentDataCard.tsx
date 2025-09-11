import CustomCard from "../../../../../components/Card";
import BarChartX from "../../../../../components/Charts/BarChartX";

const activityParticipation = [
  { label: "ผู้ลงทะเบียน", count: 50, total: 50, color: "#6659FF" },
  { label: "เข้าเต็มเวลา", count: 46, total: 50, color: "#34D399" },
  { label: "เข้าไม่เต็มเวลา", count: 2, total: 50, color: "#FADB14" },
  { label: "ไม่ได้เข้าร่วม", count: 2, total: 50, color: "#F87171" },
];

const studentStatus = [
  { label: "Normal", count: 31, total: 46, color: "#34D399" },
  { label: "Risk", count: 15, total: 46, color: "#F87171" },
];

export default function EnrolledmentDataCard() {
  return (
    <CustomCard
      className="w-full
                    max-w-[90vw]
                    sm:max-w-[600px]
                    md:max-w-[700px]
                    lg:max-w-[35%]
                    p-4 sm:p-6 relative mx-0
                    self-start space-y-10 h-[391px]"
    >
      <BarChartX 
        data={activityParticipation}
        title="การเข้าร่วมกิจกรรมของนิสิต"
        totalText="จากที่เปิดรับ 50 คน"
        labelWidth="w-[100px]"
        useTailwindColors={false}
      />

      <BarChartX 
        data={studentStatus}
        title="สถานะนิสิต"
        totalText="จากผู้เข้าร่วมเต็มเวลาทั้งหมด 46 คน (100.0%)"
        labelWidth="w-[100px]"
        useTailwindColors={false}
      />
    </CustomCard>
  );
}
