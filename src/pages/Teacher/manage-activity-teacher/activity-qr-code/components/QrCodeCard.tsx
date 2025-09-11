import { useEffect, useState } from "react";
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
    resetQRCode,
  } = useQRCodeStore();

  // State สำหรับ realtime countdown
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isResetting, setIsResetting] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!expiresAt) {
      setTimeRemaining("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const timeLeft = expiresAt.getTime() - now.getTime();
      
      if (timeLeft <= 0) {
        setTimeRemaining("หมดอายุ");
        return;
      }
      
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    console.log("🔍 QrCodeCard: useEffect triggered with activityId:", activityId);
    
    // ✅ ตรวจสอบ token ก่อน
    const token = localStorage.getItem('auth-token');
    if (!token) {
      console.log("❌ QrCodeCard: No auth token found");
      return;
    }
    
    if (activityId) {
      const activityIdNum = parseInt(activityId);
      console.log("🔍 QrCodeCard: Parsed activityIdNum:", activityIdNum);
      
      // Generate initial QR Code
      console.log("🔍 QrCodeCard: Calling generateQRCode...");
      generateQRCode(activityIdNum);
      
      // Start auto refresh every 15 seconds
      console.log("🔍 QrCodeCard: Starting auto refresh...");
      startAutoRefresh(activityIdNum);
      
      // Cleanup on unmount
      return () => {
        console.log("🔍 QrCodeCard: Cleanup - stopping auto refresh");
        stopAutoRefresh();
      };
    } else {
      console.log("🔍 QrCodeCard: No activityId provided");
    }
  }, [activityId, generateQRCode, startAutoRefresh, stopAutoRefresh]);

  // Handle reset QR code
  const handleResetQRCode = async () => {
    if (!activityId) return;
    
    setIsResetting(true);
    console.log("🔄 QrCodeCard: Resetting QR Code...");
    
    try {
      const activityIdNum = parseInt(activityId);
      await resetQRCode(activityIdNum);
      console.log("✅ QrCodeCard: QR Code reset successfully");
    } catch (error) {
      console.error("❌ QrCodeCard: Error resetting QR Code:", error);
    } finally {
      setIsResetting(false);
    }
  };

  // Debug logs
  console.log("🔍 QrCodeCard: Render state:", {
    loading,
    error,
    qrCodeUrl,
    expiresAt,
    isActive,
    activityId,
    timeRemaining,
    isResetting
  });

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        QR Code
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-1">Debug: Check browser console for details</p>
        </div>
      )}
      
      <div className="text-center">
        {/* QR Code Display Area */}
        <div className="flex justify-center mb-4">
          {loading || isResetting ? (
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">
                  {isResetting ? "กำลังรีเซ็ต QR Code..." : "กำลังสร้าง QR Code..."}
                </p>
              </div>
            </div>
          ) : qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="mx-auto border-2 border-gray-200 rounded-lg w-64 h-64"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">ไม่สามารถสร้าง QR Code ได้</p>
            </div>
          )}
        </div>
        
        {/* Instructions - แสดงตลอดเวลา */}
        <p className="text-sm text-gray-500 mb-2">
          สแกนเพื่อลงทะเบียนเข้าร่วมกิจกรรม
        </p>
        
        {/* Token Info - แสดงตลอดเวลา */}
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Scan URL: {qrCodeUrl && qrCodeUrl.split('data=')[1] ? 
              decodeURIComponent(qrCodeUrl.split('data=')[1]).split('/scan/')[1]?.substring(0, 8) + '...' : 
              'undefined...'
            }
          </p>
        </div>
        
        {/* Realtime Countdown - แสดงตลอดเวลา */}
        {expiresAt && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-blue-800">
                QR Code จะหมดอายุใน: <span className="text-red-600 font-bold">{timeRemaining}</span>
              </p>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              จะรีเฟรชอัตโนมัติทุก 15 วินาที
            </p>
          </div>
        )}
        
        {/* Reset Button - แสดงตลอดเวลา */}
        <div>
          <button
            onClick={handleResetQRCode}
            disabled={isResetting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
          >
            {isResetting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังรีเซ็ต...
              </span>
            ) : (
              "รีเซ็ต QR Code"
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
