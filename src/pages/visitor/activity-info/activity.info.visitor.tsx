 import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useActivityVisitorStore } from "@/stores/Visitor/activity.store.visitor";

import ActivityHeader from "@pages/Student/activity-student/activity-info/components/activityHeader";
import ActivityImage from "@pages/Student/activity-student/activity-info/components/activityImage";
import ActivityDetails from "@pages/Student/activity-student/activity-info/components/activityDetails";
import FoodSelector from "@pages/Student/activity-student/activity-info/components/foodSelector";
import ActivityFooter from "@pages/Student/activity-student/activity-info/components/activityFooter";
import Loading from "@/components/Loading";
import Dialog2 from "@/components/Dialog/Dialog2";
import { Activity } from "@/types/activity.types";

export default function ActivityInfoVisitor() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId;
  const navigate = useNavigate();

  // ✅ Debug: ตรวจสอบค่า id (สามารถลบได้หลังทดสอบเสร็จ)
  console.log("🔍 ActivityInfoVisitor - final id:", id);

  const {
    activities,
    activityLoading,
    activityError,
    fetchPublicActivities,
  } = useActivityVisitorStore();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  // ✅ Find specific activity from activities array หรือใช้ mock data
  const activity = activities.find((act: Activity) => Number(act.activity_id) === Number(id)) || {
    activity_id: Number(id),
    activity_name: "Mock Activity",
    presenter_company_name: "Mock Company",
    type: "Soft",
    description: "Mock Description",
    seat: 100,
    recieve_hours: 4,
    event_format: "Onsite",
    activity_status: "Public",
    activity_state: "Open Register",
    image_url: undefined,
    url: undefined,
    assessment_id: 1,
    room_id: 1,
    start_assessment: undefined,
    end_assessment: undefined,
    activityFood: [],
    registered_count: 0,
    create_activity_date: "2025-01-01",
    special_start_register_date: "2025-01-01",
    start_register_date: "2025-01-01",
    end_register_date: "2025-01-02",
    start_activity_date: "2025-01-03",
    end_activity_date: "2025-01-03",
    last_update_activity_date: "2025-01-01",
    status: "Active"
  };

  // Fetch data
  useEffect(() => {
    console.log("🔄 [ActivityInfoVisitor] About to fetch public activities");
    fetchPublicActivities();
  }, [fetchPublicActivities]);

  if (activityLoading) return <Loading />;
  if (activityError)
    return <p className="text-center text-lg text-red-500">❌ {activityError}</p>;
  if (!activity) {
    return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;
  }

  // ✅ ฟังก์ชันสำหรับจัดการการลงทะเบียน (Visitor)
  const handleEnrollClick = () => {
    setShowRegistrationDialog(true);
  };

  const handleDialogConfirm = () => {
    setShowRegistrationDialog(false);
    navigate("/visitor");
  };

  const handleDialogClose = () => {
    setShowRegistrationDialog(false);
  };

  return (
    <div className="justify-items-center">
      <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader activity={activity} />
        <ActivityImage imageUrl={typeof activity.image_url === "string" ? activity.image_url : null} />
        <ActivityDetails activity={activity} isVisitor={true} />
        <FoodSelector
          activity={activity}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          isEnrolled={isEnrolled}
        />
        <ActivityFooter
          mode="catalog"
          evaluationDone={false}
          activity={activity}
          isEnrolled={isEnrolled}
          enrollActivity={handleEnrollClick} // ✅ ใช้ custom function
          unenrollActivity={() => {}} // ✅ ไม่ต้องใช้
          setIsEnrolled={setIsEnrolled}
          navigate={navigate}
          enrolledActivities={[]} // ✅ Visitor ไม่มี enrolled activities
          selectedFood={selectedFood}
          userId={null} // ✅ Visitor ไม่มี userId
        />
      </div>

      {/* ✅ Registration Dialog */}
      <Dialog2
        open={showRegistrationDialog}
        title="ต้องการลงทะเบียนกิจกรรม"
        message={
          <div>
            <p className="mb-2">ท่านยังไม่ได้ลงทะเบียน</p>
            <p>กรุณาเข้าสู่ระบบก่อนเพื่อลงทะเบียนกิจกรรม</p>
          </div>
        }
        icon={
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        }
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </div>
  );
}
