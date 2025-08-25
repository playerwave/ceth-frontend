import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/Loading";
import HeaderCard from "./components/HeaderCard";
import QrCodeCard from "./components/QrCodeCard";
import ScannedStudentsCard from "./components/ScannedStudentsCard";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";

interface ScannedStudent {
  id: string;
  student_name: string;
  department: string;
  student_code: string;
}

export default function QrActivityTeacher() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [scannedStudents, setScannedStudents] = useState<ScannedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityName, setActivityName] = useState<string>("");

  const { fetchActivity } = useActivityStore();

  // Mock data สำหรับทดสอบ
  const mockScannedStudents: ScannedStudent[] = [
    {
      id: "1",
      student_name: "สมชาย ใจดี",
      department: "วิศวกรรมคอมพิวเตอร์",
      student_code: "6500000001"
    },
    {
      id: "2", 
      student_name: "สมหญิง รักเรียน",
      department: "วิศวกรรมไฟฟ้า",
      student_code: "6500000002"
    },
    {
      id: "3",
      student_name: "สมศักดิ์ มุ่งมั่น",
      department: "วิศวกรรมเครื่องกล",
      student_code: "6500000003"
    }
  ];

  useEffect(() => {
    const loadActivityData = async () => {
      if (activityId) {
        try {
          // ดึงข้อมูล activity
          const activity = await fetchActivity(parseInt(activityId));
          if (activity) {
            setActivityName(activity.activity_name || "");
          }
        } catch (error) {
          console.error("Error fetching activity:", error);
        }
      }
      
      generateQRCode();
      // Mock: จำลองการโหลดข้อมูล
      setTimeout(() => {
        setScannedStudents(mockScannedStudents);
        setLoading(false);
      }, 1000);
    };

    loadActivityData();
  }, [activityId, fetchActivity]);

  const generateQRCode = async () => {
    try {
      // สร้าง QR Code URL สำหรับ activity
      const qrData = `https://your-domain.com/scan/${activityId}`;
      
      // ใช้ Canvas API แทน qrcode library
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // สร้าง QR Code แบบง่าย (placeholder)
        ctx.fillStyle = '#000000';
        ctx.fillRect(50, 50, 200, 200);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(60, 60, 180, 180);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', 150, 150);
        ctx.fillText(`Activity: ${activityId}`, 150, 170);
      }
      
      const dataUrl = canvas.toDataURL();
      setQrCodeUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <HeaderCard 
          activityId={activityId} 
          activityName={activityName}
          onBack={handleBack} 
        />

        {/* Main Content - QR Code and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Section */}
          <QrCodeCard qrCodeUrl={qrCodeUrl} activityId={activityId} />

          {/* Table Section */}
          <ScannedStudentsCard scannedStudents={scannedStudents} />
        </div>
      </div>
    </div>
  );
}
