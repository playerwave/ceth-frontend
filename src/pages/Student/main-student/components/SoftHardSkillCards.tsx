// ✅ SoftHardSkillCards.tsx
import { Card } from "@mui/material";

const SoftHardSkillCards = () => {
  return (
    <div className="flex flex-col gap-4 w-[300px]">
      <Card
        sx={{
          p: 8,
          textAlign: "center",
          borderRadius: 3,
          boxShadow: 10,
          width: "300px",
          height: "220px",
        }}
      >
        <h2 className="text-lg font-bold mb-5">Soft Skill ปัจจุบัน</h2>
        <p className="text-4xl font-bold text-blue-600">5</p>
      </Card>

      <Card
        sx={{
          p: 7.5,
          textAlign: "center",
          mt: { xs: 3, md: 4, lg: 5 },
          borderRadius: 3,
          boxShadow: 10,
          width: "300px",
          height: "220px",
        }}
      >
        <h2 className="text-lg font-bold mb-5">Hard Skill ปัจจุบัน</h2>
        <p className="text-4xl font-bold text-orange-500">7</p>
      </Card>
    </div>
  );
};

export default SoftHardSkillCards;
