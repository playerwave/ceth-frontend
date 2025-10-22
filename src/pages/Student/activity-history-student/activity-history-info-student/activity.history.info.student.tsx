// src/pages/Student/activity-history-student/activity-history-info-student/ActivityHistoryInfoStudent.tsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

// Import components
import ActivityHeader from "../../activity-student/activity-info/components/activityHeader";
import ActivityImage from "../../activity-student/activity-info/components/activityImage";
import ActivityDetails from "../../activity-student/activity-info/components/activityDetails";
import Loading from "../../../../components/Loading";
import Button from "../../../../components/Button";

interface AssessmentStatus {
  hasSubmitted: boolean;
  assessmentName?: string;
  submittedDate?: Date;
}

export default function ActivityHistoryInfoStudent() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { activity?: any } };
  const navigate = useNavigate();
  
  const { 
    activity, 
    activityError, 
    fetchActivity,
    checkAssessmentStatus 
  } = useActivityStore();
  
  const { user } = useAuthStore();
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // ใช้ students_id จาก auth store
  const studentId = useMemo(() => {
    return user?.student?.students_id;
  }, [user?.student?.students_id]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔍 [ActivityHistoryInfo] Starting fetchData...");
      console.log("🔍 [ActivityHistoryInfo] Activity ID:", id);
      console.log("🔍 [ActivityHistoryInfo] Student ID:", studentId);
      console.log("🔍 [ActivityHistoryInfo] Location state:", location.state);
      
      if (!id) {
        console.log("❌ [ActivityHistoryInfo] Missing activity ID");
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch activity data - บังคับ fetch จาก API เสมอเพื่อให้ได้ข้อมูลครบ
        console.log("🔄 [ActivityHistoryInfo] Fetching activity from API...");
        await fetchActivity(id);
        
        // Fetch assessment status
        if (studentId) {
          console.log("🔄 [ActivityHistoryInfo] Calling checkAssessmentStatus...");
          const status = await checkAssessmentStatus(parseInt(id), studentId);
          console.log("✅ [ActivityHistoryInfo] Assessment status received:", status);
          setAssessmentStatus(status);
        }
      } catch (error) {
        console.error("❌ [ActivityHistoryInfo] Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, studentId, fetchActivity, checkAssessmentStatus, location.state]);

  const handleGoBack = () => {
    navigate("/list-activity-history-student");
  };

  if (loading) {
    return <Loading />;
  }

  if (activityError) {
    return (
      <div className="justify-items-center">
        <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-center text-lg text-red-500">❌ {activityError}</p>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={handleGoBack}
              bgColor="#3B82F6"
              textColor="#FFFFFF"
              width="120px"
            >
              กลับ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activityData = activity; // ใช้ข้อมูลจาก API เสมอ
  
  // Debug logging for activity data
  console.log("🔍 [ActivityHistoryInfo] Final activity data:", activityData);
  console.log("🔍 [ActivityHistoryInfo] Activity room_id:", activityData?.room_id);
  console.log("🔍 [ActivityHistoryInfo] Activity end_register_date:", activityData?.end_register_date);
  
  if (!activityData) {
    return (
      <div className="justify-items-center">
        <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={handleGoBack}
              bgColor="#3B82F6"
              textColor="#FFFFFF"
              width="120px"
            >
              กลับ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-items-center">
      <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader activity={activityData} />
        <ActivityImage imageUrl={typeof activityData.image_url === "string" ? activityData.image_url : null} />
        <ActivityDetails activity={activityData} />
        
        {/* ✅ แสดงสถานะการทำแบบประเมิน */}
        {assessmentStatus && (
          <div className="mt-6 p-4 rounded-lg border-2" style={{
            background: assessmentStatus.hasSubmitted ? "#d1fae5" : "#fef3c7",
            borderColor: assessmentStatus.hasSubmitted ? "#10b981" : "#f59e0b"
          }}>
            <div className="flex items-center gap-3">
              <div>
                <h3 className={`text-lg font-semibold ${assessmentStatus.hasSubmitted ? "text-green-800" : "text-yellow-800"}`}>
                  {assessmentStatus.hasSubmitted ? "ทำแบบประเมินแล้ว" : "ยังไม่ได้ทำแบบประเมิน"}
                </h3>
                {assessmentStatus.assessmentName && (
                  <p className="text-sm text-gray-600 mt-1">
                    แบบประเมิน: {assessmentStatus.assessmentName}
                  </p>
                )}
                {assessmentStatus.submittedDate && (
                  <p className="text-sm text-gray-600">
                    วันที่ส่ง: {new Date(assessmentStatus.submittedDate).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* ปุ่มกลับ */}
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleGoBack}
            textColor="#FFFFFF"
            width="280px"
          >
            กลับไปยังรายการประวัติกิจกรรม
          </Button>
        </div>
      </div>
    </div>
  );
};
