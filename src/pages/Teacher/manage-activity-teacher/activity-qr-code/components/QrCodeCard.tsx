import Card from "../../../../../components/Card";

interface QrCodeCardProps {
  qrCodeUrl: string;
  activityId: string | undefined;
}

export default function QrCodeCard({ qrCodeUrl, activityId }: QrCodeCardProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        QR Code
      </h2>
      <div className="flex justify-center">
        {qrCodeUrl ? (
          <div className="text-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="mx-auto border-2 border-gray-200 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              สแกนเพื่อลงทะเบียนเข้าร่วมกิจกรรม
            </p>
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">กำลังสร้าง QR Code...</p>
          </div>
        )}
      </div>
    </Card>
  );
}
