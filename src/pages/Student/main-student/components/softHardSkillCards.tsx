// ✅ SoftHardSkillCards.tsx
import { useState, useEffect } from "react";
import CustomCard from "@/components/Card";
import { useAuthStore } from "@/stores/Visitor/auth.store";

const SoftHardSkillCards = () => {
  const { user } = useAuthStore();
  const [softHours, setSoftHours] = useState(0);
  const [hardHours, setHardHours] = useState(0);
  
  // อัพเดทชั่วโมงเมื่อ user.student เปลี่ยนแปลง
  useEffect(() => {
    console.log("🔍 [SoftHardSkillCards] User data changed, updating hours:", {
      students_id: user?.student?.students_id,
      soft_hours: user?.student?.soft_hours,
      hard_hours: user?.student?.hard_hours
    });
    setSoftHours(user?.student?.soft_hours || 0);
    setHardHours(user?.student?.hard_hours || 0);
  }, [user?.student]); // ใช้ user?.student แทนเพื่อให้ react เมื่อ student object เปลี่ยนแปลง

  return (
    <div className="max-w-6xl mx-auto px-1 w-full">
      {/* ซ้าย: Soft / Hard (วางแนวตั้งเฉพาะจอใหญ่) */}
      <div className="flex flex-row lg:flex-col gap-4 w-full justify-center">
        <CustomCard
          height="205px"
          className="w-full max-w-[300px] p-6 text-center rounded-[12px] shadow-xl"
        >
          <h2 className="text-base font-bold mb-4">Soft Skill ปัจจุบัน</h2>
          <p className="text-[50px] font-bold text-blue-600">{softHours}</p>
        </CustomCard>

        <CustomCard
          height="205px"
          className="w-full max-w-[300px] p-6 text-center rounded-[12px] shadow-xl"
        >
          <h2 className="text-base font-bold mb-4">Hard Skill ปัจจุบัน</h2>
          <p className="text-[50px] font-bold text-orange-600">{hardHours}</p>
        </CustomCard>
      </div>
    </div>
  );
};

export default SoftHardSkillCards;