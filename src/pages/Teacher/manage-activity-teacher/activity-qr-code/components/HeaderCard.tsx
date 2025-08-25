import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";

interface HeaderCardProps {
  activityId: string | undefined;
  activityName?: string;
  onBack: () => void;
}

export default function HeaderCard({ activityId, activityName, onBack }: HeaderCardProps) {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} width="100px">
            ← กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              QR Code สำหรับกิจกรรม {activityName}
            </h1>
          </div>
        </div>
      </div>
    </Card>
  );
}
