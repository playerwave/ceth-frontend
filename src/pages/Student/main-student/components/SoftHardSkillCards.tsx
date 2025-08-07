// ✅ SoftHardSkillCards.tsx
import CustomCard from "../../../../components/Card";

const SoftHardSkillCards = () => {
  return (
    <div className="max-w-6xl mx-auto px-1 w-full">
      {/* ซ้าย: Soft / Hard (วางแนวตั้งเฉพาะจอใหญ่) */}
      <div className="flex flex-row lg:flex-col gap-4 w-full justify-center">
        <CustomCard
          height="205px"
          className="w-full max-w-[300px] p-6 text-center rounded-[12px] shadow-xl"
        >
          <h2 className="text-base font-bold mb-4">Soft Skill ปัจจุบัน</h2>
          <p className="text-[50px] font-bold text-blue-600">9</p>
        </CustomCard>

        <CustomCard
          height="205px"
          className="w-full max-w-[300px] p-6 text-center rounded-[12px] shadow-xl"
        >
          <h2 className="text-base font-bold mb-4">Hard Skill ปัจจุบัน</h2>
          <p className="text-[50px] font-bold text-orange-600">8</p>
        </CustomCard>
      </div>
    </div>
  );
};

export default SoftHardSkillCards;
