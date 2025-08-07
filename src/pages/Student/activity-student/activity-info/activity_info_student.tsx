import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";

// Import components
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter"; // เปลี่ยนเป็น ActivityFooter
import Loading from "../../../../components/Loading";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

export default function ActivityInfoStudent() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId;
  const navigate = useNavigate();

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

  const { user } = useAuthStore(); 
  const userId = user?.userId || 8; // ใช้ userId จริงหรือ fallback เป็น 8

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string>("");

  useEffect(() => {
    fetchEnrolledActivities(userId);
  }, [userId]);

  useEffect(() => {
    fetchActivity(id, userId);
  }, [id, userId]);

  useEffect(() => {
    if (enrolledActivities.length === 0) return;
    const isUserEnrolled = enrolledActivities.some(
      (act) => Number(act.activity_id) === Number(id),
    );
    setIsEnrolled(isUserEnrolled);
  }, [enrolledActivities, id]);

  const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFood(e.target.value);
  };

  if (activityLoading) return <Loading />;
  if (activityError)
    return <p className="text-center text-lg text-red-500">❌ {activityError}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  return (
    <div className="justify-items-center">
      <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
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
          activity={activity}
          isEnrolled={isEnrolled}
          enrollActivity={enrollActivity}
          unenrollActivity={unenrollActivity}
          setIsEnrolled={setIsEnrolled}
          navigate={navigate}
          enrolledActivities={enrolledActivities}
          selectedFood={selectedFood}
          userId={userId}
        />
      </div>
    </div>
  );
}