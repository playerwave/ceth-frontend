import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";

interface HeaderCardProps {
  activityId: string | undefined;
  activityName?: string;
  activityState?: string;
  onBack: () => void;
}

export default function HeaderCard({ activityName, activityState, onBack }: HeaderCardProps) {
  // กำหนด title ตาม activity_state
  const getTitle = () => {
    if (activityState === "Start Activity") {
      return `QR Code ลงชื่อเข้าร่วม สำหรับกิจกรรม ${activityName}`;
    } else if (activityState === "End Activity") {
      return `QR Code ลงชื่อออก สำหรับกิจกรรม ${activityName}`;
    } else {
      return `QR Code สำหรับกิจกรรม ${activityName}`;
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} width="100px">
            ← กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getTitle()}
            </h1>
          </div>
        </div>
      </div>
    </Card>
  );
}
