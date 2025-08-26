import { useEffect } from "react";
import Card from "../../../../../components/Card";
import { useQRCodeStore } from "../../../../../stores/Teacher/qr-code.store";

interface QrCodeCardProps {
  activityId: string | undefined;
}

export default function QrCodeCard({ activityId }: QrCodeCardProps) {
  const {
    qrCodeUrl,
    expiresAt,
    isActive,
    loading,
    error,
    generateQRCode,
    startAutoRefresh,
    stopAutoRefresh,
  } = useQRCodeStore();

  useEffect(() => {
    if (activityId) {
      const activityIdNum = parseInt(activityId);
      
      // Generate initial QR Code
      generateQRCode(activityIdNum);
      
      // Start auto refresh every 15 seconds
      startAutoRefresh(activityIdNum);
      
      // Cleanup on unmount
      return () => {
        stopAutoRefresh();
      };
    }
  }, [activityId, generateQRCode, startAutoRefresh, stopAutoRefresh]);

  const formatTimeRemaining = () => {
    if (!expiresAt) return "";
    
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return "หมดอายุ";
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        QR Code
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex justify-center">
        {loading ? (
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">กำลังสร้าง QR Code...</p>
          </div>
        ) : qrCodeUrl ? (
          <div className="text-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="mx-auto border-2 border-gray-200 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              สแกนเพื่อลงทะเบียนเข้าร่วมกิจกรรม
            </p>
            {expiresAt && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">
                  QR Code จะหมดอายุใน: {formatTimeRemaining()}
                </p>
                <p className="text-xs text-blue-500">
                  จะรีเฟรชอัตโนมัติทุก 15 วินาที
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">ไม่สามารถสร้าง QR Code ได้</p>
          </div>
        )}
      </div>
    </Card>
  );
}
