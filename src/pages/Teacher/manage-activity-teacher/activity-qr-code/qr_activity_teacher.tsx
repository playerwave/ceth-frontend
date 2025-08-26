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
      
      // Mock: จำลองการโหลดข้อมูล
      setTimeout(() => {
        setScannedStudents(mockScannedStudents);
        setLoading(false);
      }, 1000);
    };

    loadActivityData();
  }, [activityId, fetchActivity]);

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
          <QrCodeCard activityId={activityId} />

          {/* Table Section */}
          <ScannedStudentsCard scannedStudents={scannedStudents} />
        </div>
      </div>
    </div>
  );
}
