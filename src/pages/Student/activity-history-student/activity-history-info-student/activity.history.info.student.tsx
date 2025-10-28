// src/pages/Student/activity-history-student/activity-history-info-student/ActivityHistoryInfoStudent.tsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useActivityStore } from "@/stores/Student/activity.store.student";
import { useAuthStore } from "@/stores/Visitor/auth.store";
import { Activity } from "@/types/activity.types";

// Import components
import ActivityHeader from "../../activity-student/activity-info/components/activityHeader";
import ActivityImage from "../../activity-student/activity-info/components/activityImage";
import ActivityDetails from "../../activity-student/activity-info/components/activityDetails";
import Loading from "@/components/Loading";
import Button from "@/components/Button";

interface AssessmentStatus {
  hasSubmitted: boolean;
  assessmentName?: string;
  submittedDate?: Date;
}

export default function ActivityHistoryInfoStudent() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { activity?: Activity } };
  const navigate = useNavigate();
  
  const { 
    activity, 
    activityError, 
    fetchActivity,
    fetchEndedActivities,
    checkAssessmentStatus 
  } = useActivityStore();
  
  const { user } = useAuthStore();
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<Activity>({
    activity_id: 0,
    activity_name: "",
    presenter_company_name: "",
    type: "Soft",
    description: "",
    seat: 0,
    recieve_hours: 0,
    event_format: "Online",
    create_activity_date: "",
    special_start_register_date: null,
    start_register_date: null,
    end_register_date: null,
    start_activity_date: "",
    end_activity_date: "",
    image_url: "",
    activity_status: "Private",
    activity_state: "Not Start",
    status: "Active",
    last_update_activity_date: "",
    url: null,
    room_id: null,
    assessment_id: null,
    assessment_version_id: null,
    start_assessment: null,
    end_assessment: null,
    registered_count: null,
    upload_certificate_description: null,
    certificate_base_id: null,
    certificateBase: null,
    certificate_template_url: null,
    certificate_ocr_data: null,
    certificate_image_analysis: null,
    certificate_id: undefined,
    verification_status: undefined,
    confidence_score: undefined,
    submitted_date: undefined,
    ocr_extracted_data: undefined,
    activityFood: []
  }); // ✅ เพิ่ม local state พร้อม default values

  // ✅ ใช้ students_id จาก auth store
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
      
      // ✅ ตรวจสอบ location.state ก่อน (สำหรับ navigation จาก list)
      if (location.state?.activity) {
        console.log("✅ [ActivityHistoryInfo] Using activity from location.state:", location.state.activity);
        setActivityData(location.state.activity);
        
        // ✅ ตรวจสอบว่าเป็น Certificate Activity หรือไม่
        const isCertificateActivity = !!location.state.activity.certificate_id;
        console.log("🔍 [ActivityHistoryInfo] isCertificateActivity from location.state:", isCertificateActivity);
        
        if (isCertificateActivity) {
          console.log("✅ [ActivityHistoryInfo] Certificate activity from location.state - skipping assessment check");
          setAssessmentStatus(null);
        } else if (studentId) {
          console.log("🔄 [ActivityHistoryInfo] Calling checkAssessmentStatus for location.state activity...");
          const status = await checkAssessmentStatus(parseInt(id), studentId);
          console.log("✅ [ActivityHistoryInfo] Assessment status received:", status);
          setAssessmentStatus(status);
        }
        
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // ✅ ใช้ fetchEndedActivities เพื่อให้ได้ข้อมูล Certificate Activities
        console.log("🔄 [ActivityHistoryInfo] Fetching activity from History API...");
        let targetActivity = null;
        
        if (studentId) {
          await fetchEndedActivities(studentId);
          
          // ✅ หา Activity ที่ต้องการจาก endedActivities
          const { endedActivities } = useActivityStore.getState();
          targetActivity = endedActivities.find(act => act.activity_id === parseInt(id));
          
          if (targetActivity) {
            console.log("✅ [ActivityHistoryInfo] Found activity in history:", targetActivity);
            setActivityData(targetActivity); // ✅ ใช้ setActivityData แทน useActivityStore.setState
          } else {
            console.log("⚠️ [ActivityHistoryInfo] Activity not found in history, using regular fetchActivity");
            await fetchActivity(id);
            const fallbackActivity = useActivityStore.getState().activity;
            if (fallbackActivity) {
              setActivityData(fallbackActivity);
            }
          }
        } else {
          console.log("⚠️ [ActivityHistoryInfo] No studentId, using regular fetchActivity");
          await fetchActivity(id);
          const fallbackActivity = useActivityStore.getState().activity;
          if (fallbackActivity) {
            setActivityData(fallbackActivity);
          }
        }
        
        // ✅ ตรวจสอบว่าเป็น Certificate Activity หรือไม่ (ใช้ข้อมูลจาก targetActivity หรือ activityData)
        const currentActivity = targetActivity || useActivityStore.getState().activity;
        const isCertificateActivity = !!currentActivity?.certificate_id;
        const isCourseActivity = currentActivity?.event_format === "Course";
        
        console.log("🔍 [ActivityHistoryInfo] Activity type check:", {
          isCertificateActivity,
          isCourseActivity,
          event_format: currentActivity?.event_format,
          certificate_id: currentActivity?.certificate_id,
          activity_source: targetActivity ? "endedActivities" : "fetchActivity"
        });
        
        // ✅ Fetch assessment status เฉพาะกิจกรรมที่ไม่ใช่ Certificate
        if (studentId && !isCertificateActivity) {
          console.log("🔄 [ActivityHistoryInfo] Calling checkAssessmentStatus...");
          const status = await checkAssessmentStatus(parseInt(id), studentId);
          console.log("✅ [ActivityHistoryInfo] Assessment status received:", status);
          setAssessmentStatus(status);
        } else if (isCertificateActivity) {
          console.log("✅ [ActivityHistoryInfo] Skipping assessment check for certificate activity");
          setAssessmentStatus(null); // ✅ Clear assessment status สำหรับ Certificate Activity
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

  const activityDataToDisplay = activityData || activity; // ✅ ใช้ activityData ก่อน แล้วค่อยใช้ activity
  
  // Debug logging for activity data
  console.log("🔍 [ActivityHistoryInfo] Final activity data:", activityDataToDisplay);
  console.log("🔍 [ActivityHistoryInfo] Activity room_id:", activityDataToDisplay?.room_id);
  console.log("🔍 [ActivityHistoryInfo] Activity end_register_date:", activityDataToDisplay?.end_register_date);
  console.log("🔍 [ActivityHistoryInfo] Certificate fields:", {
    certificate_id: activityDataToDisplay?.certificate_id,
    verification_status: activityDataToDisplay?.verification_status,
    confidence_score: activityDataToDisplay?.confidence_score,
    submitted_date: activityDataToDisplay?.submitted_date,
    ocr_extracted_data: activityDataToDisplay?.ocr_extracted_data
  });
  
  if (!activityDataToDisplay) {
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
        
        {/* ✅ แสดงสถานะการทำแบบประเมิน (เฉพาะกิจกรรมที่ไม่ใช่ Certificate) */}
        {assessmentStatus && !activityData?.certificate_id && (
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
        
        {/* ✅ แสดงข้อมูล Certificate (เฉพาะกิจกรรม Certificate) */}
        {activityData?.certificate_id && (
          <div className="mt-6 p-4 rounded-lg border-2 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">📜</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">
                  ใบรับรองผ่านการตรวจสอบ
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">สถานะ:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      activityData.verification_status === 'Pass' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activityData.verification_status || 'ไม่ระบุ'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">คะแนนความมั่นใจ:</span> {activityData.confidence_score || 0}%
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">วันที่ยื่นใบรับรอง:</span> {
                      activityData.submitted_date 
                        ? new Date(activityData.submitted_date).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        : 'ไม่ระบุ'
                    }
                  </p>
                </div>
                
                {/* ✅ แสดงข้อมูล OCR ที่สกัดได้ */}
                {activityData.ocr_extracted_data && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      ข้อมูลที่สกัดจากใบรับรอง:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                      {activityData.ocr_extracted_data.studentName && (
                        <div>
                          <span className="font-medium">ชื่อนิสิต:</span> {activityData.ocr_extracted_data.studentName}
                        </div>
                      )}
                      {activityData.ocr_extracted_data.courseName && (
                        <div>
                          <span className="font-medium">ชื่อคอร์ส:</span> {activityData.ocr_extracted_data.courseName}
                        </div>
                      )}
                      {activityData.ocr_extracted_data.issuerName && (
                        <div>
                          <span className="font-medium">ผู้ออกใบรับรอง:</span> {activityData.ocr_extracted_data.issuerName}
                        </div>
                      )}
                      {activityData.ocr_extracted_data.completionDate && (
                        <div>
                          <span className="font-medium">วันที่สำเร็จ:</span> {activityData.ocr_extracted_data.completionDate}
                        </div>
                      )}
                      {activityData.ocr_extracted_data.certificateId && 
                       activityData.ocr_extracted_data.certificateId !== "-" && (
                        <div>
                          <span className="font-medium">รหัสใบรับรอง:</span> {activityData.ocr_extracted_data.certificateId}
                        </div>
                      )}
                    </div>
                  </div>
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
