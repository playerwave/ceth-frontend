import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";

// Import components
import ActivityHeader from "./components/activityHeader";
import ActivityImage from "./components/activityImage";
import ActivityDetails from "./components/activityDetails";
import FoodSelector from "./components/foodSelector";
import ActivityFooter from "./components/activityFooter";
import Loading from "../../../../components/Loading";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

export default function ActivityInfoStudent() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId;
  const navigate = useNavigate();

  console.log("🔍 [DEBUG] ActivityInfoStudent - paramId:", paramId);
  console.log("🔍 [DEBUG] ActivityInfoStudent - location.state:", location.state);
  console.log("🔍 [DEBUG] ActivityInfoStudent - final id:", id);

  const {
    activity,
    activityLoading,
    activityError,
    fetchActivity,
    enrolledActivities,
    fetchEnrolledActivities,
    enrollActivity,
    unenrollActivity,
  } = useActivityStore();

  const { user, fetchMe } = useAuthStore();
  const lastStudentIdRef = useRef<number | null>(null);
  
  // ใช้ students_id จาก auth store เท่านั้น
  const studentId = useMemo(() => {
    return user?.student?.students_id;
  }, [user?.student?.students_id]);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string>("");

  // Fetch user data on mount only if user is not authenticated
  // ลบการเรียก fetchMe ออก เพราะ main.student.tsx เรียกแล้ว
  // useEffect(() => {
  //   if (!user || user.role === "Visitor") {
  //     fetchMe();
  //   }
  // }, []);

  useEffect(() => {
    const studentIdValue = user?.student?.students_id;
    const isValidId = typeof studentIdValue === "number" && studentIdValue > 0;
  
    if (isValidId && studentIdValue !== lastStudentIdRef.current) {
      lastStudentIdRef.current = studentIdValue;
      fetchEnrolledActivities(studentIdValue);
    }
    
    // ✅ เรียก fetchActivity ทุกครั้งที่มี id โดยไม่ต้องรอ studentId
    if (id) {
      console.log("🔍 [DEBUG] Fetching activity with ID:", id);
      fetchActivity(id);
    }
  }, [user?.student?.students_id, id, fetchActivity, fetchEnrolledActivities]);

  useEffect(() => {
    if (enrolledActivities.length === 0) return;
    const isUserEnrolled = enrolledActivities.some(
      (act) => Number(act.activity_id) === Number(id)
    );
    setIsEnrolled(isUserEnrolled);
  }, [enrolledActivities, id]);

  // const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedFood(e.target.value);
  // };

  if (activityLoading) return <Loading />;
  if (activityError)
    return (
      <p className="text-center text-lg text-red-500">❌ {activityError}</p>
    );
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  return (
    <div className="justify-items-center">
      <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader activity={activity} />
        <ActivityImage imageUrl={typeof activity.image_url === "string" ? activity.image_url : null} />
        <ActivityDetails activity={activity} />
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
          enrollActivity={enrollActivity}
          unenrollActivity={unenrollActivity}
          setIsEnrolled={setIsEnrolled}
          navigate={navigate}
          enrolledActivities={enrolledActivities}
          selectedFood={selectedFood}
          userId={studentId || null}
        />
      </div>
    </div>
  );
}
