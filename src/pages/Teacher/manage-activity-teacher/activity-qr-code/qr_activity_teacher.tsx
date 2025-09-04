import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/Loading";
import HeaderCard from "./components/HeaderCard";
import QrCodeCard from "./components/QrCodeCard";
import ScannedStudentsCard from "./components/ScannedStudentsCard";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

interface ScannedStudent {
  id: string;
  first_name_tha: string;
  last_name_tha: string;
  department_short_name: string;
  username: string;
  fullName: string;
}

interface QrActivityTeacherProps {
  secureParams?: Record<string, any>;
}

export default function QrActivityTeacher({ secureParams }: QrActivityTeacherProps) {
  const navigate = useNavigate();
  const { id } = useParams(); // เปลี่ยนจาก activityId เป็น id
  const [scannedStudents, setScannedStudents] = useState<ScannedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityName, setActivityName] = useState<string>("");
  const [activity, setActivity] = useState<any>(null);

  const { fetchActivity, getEnrolledStudentsForActivity } = useActivityStore();
  const { user, isAuthenticated } = useAuthStore();

  // ✅ ดึง activityId จาก secureParams หรือ useParams
  const activityId = secureParams?.id || id;

  // Debug logs
  console.log("🔍 QrActivityTeacher: Component rendered with activityId:", activityId);
  console.log("🔍 QrActivityTeacher: Secure params:", secureParams);
  console.log("🔍 QrActivityTeacher: URL params:", { id });
  console.log("🔍 QrActivityTeacher: Auth state:", { user, isAuthenticated });

  // // ข้อมูลนักเรียนที่ลงทะเบียน (จะถูกแทนที่ด้วยข้อมูลจริง)
  // const [enrolledStudents, setEnrolledStudents] = useState<ScannedStudent[]>([]);

  useEffect(() => {
    console.log("🔍 QrActivityTeacher: useEffect triggered with activityId:", activityId);
    
    // ✅ ตรวจสอบ authentication ก่อน
    const token = localStorage.getItem('auth-token');
    if (!token || !isAuthenticated || !user) {
      console.log("❌ QrActivityTeacher: Not authenticated - redirecting to login");
      window.location.href = '/login';
      return;
    }

    // ✅ ตรวจสอบ role
    if (user.role !== "Teacher" && user.role !== "Admin") {
      console.log("❌ QrActivityTeacher: Insufficient permissions - redirecting to login");
      window.location.href = '/login';
      return;
    }
    
    const loadActivityData = async () => {
      if (activityId) {
        console.log("🔍 QrActivityTeacher: Loading activity data for activityId:", activityId);
        try {
          // ดึงข้อมูล activity
          const activityData = await fetchActivity(parseInt(activityId));
          if (activityData) {
            setActivity(activityData);
            setActivityName(activityData.activity_name || "");
            console.log("🔍 QrActivityTeacher: Activity loaded:", activityData.activity_name);
          }
        } catch (error) {
          console.error("Error fetching activity:", error);
        }
      } else {
        console.log("🔍 QrActivityTeacher: No activityId provided");
      }
      
      // ดึงข้อมูลนักเรียนที่ลงทะเบียนจริง
      if (activityId) {
        try {
          const students = await getEnrolledStudentsForActivity(parseInt(activityId));
          console.log("🔍 QrActivityTeacher: Raw students data:", students);
          
          // ตรวจสอบและแปลงข้อมูลให้ถูกต้อง
          const validStudents = Array.isArray(students) ? students : [];
          
          // เพิ่ม fullName field ให้กับข้อมูลนักเรียน
          const studentsWithFullName = validStudents.map(student => ({
            ...student,
            fullName: `${student.first_name_tha || ''} ${student.last_name_tha || ''}`.trim()
          }));
          
          setScannedStudents(studentsWithFullName);
          console.log("🔍 QrActivityTeacher: Valid students loaded:", studentsWithFullName);
        } catch (error) {
          console.error("❌ QrActivityTeacher: Error loading enrolled students:", error);
          setScannedStudents([]);
        }
      } else {
        setScannedStudents([]);
      }
      setLoading(false);
      console.log("🔍 QrActivityTeacher: Loading completed");
    };

    loadActivityData();
  }, [activityId, fetchActivity, isAuthenticated, user]);

  const handleBack = () => {
    navigate(-1);
  };

  // Debug logs
  console.log("🔍 QrActivityTeacher: Render state:", {
    loading,
    activityId,
    activityName,
    scannedStudentsCount: scannedStudents.length
  });

  // Debug: ตรวจสอบ activityId ที่จะส่งไปยัง ScannedStudentsCard
  console.log("🔍 QrActivityTeacher: activityId to be sent to ScannedStudentsCard:", activityId);
  console.log("🔍 QrActivityTeacher: activityId type:", typeof activityId);

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
          activityState={activity?.activity_state}
          onBack={handleBack} 
        />

        {/* Main Content - QR Code and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Section */}
          <QrCodeCard activityId={activityId} />

          {/* Table Section */}
          <ScannedStudentsCard 
            scannedStudents={scannedStudents} 
            activityId={activityId}
          />
        </div>
      </div>
    </div>
  );
}
