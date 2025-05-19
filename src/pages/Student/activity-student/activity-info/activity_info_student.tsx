import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Student/store_activity_info";

// Import components
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter"; // เปลี่ยนเป็น ActivityFooter
import Loading from "../../../../components/Loading";

export default function ActivityInfoStudent() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId;
  const navigate = useNavigate();

  const {
    activity,
    activityLoading,
    error,
    fetchActivity,
    enrollActivity,
    enrolledActivities,
    fetchEnrolledActivities,
    unenrollActivity,
  } = useActivityStore();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string>("");

  // Fetch data
  useEffect(() => {
    const userId = 8;
    fetchEnrolledActivities(userId);
  }, []);

  useEffect(() => {
    fetchActivity(id);
  }, [fetchEnrolledActivities]);

  useEffect(() => {
    if (enrolledActivities.length === 0) return;

    const isUserEnrolled = enrolledActivities.some(
      (act) => Number(act.ac_id) === Number(id)
    );

    setIsEnrolled(isUserEnrolled);
  }, [enrolledActivities, id]);

  const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFood(e.target.value);
  };

  if (activityLoading) return <Loading />;
  if (error)
    return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  return (
    <div className="justify-items-center">
      <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader activity={activity} />
        <ActivityImage imageUrl={activity.image_url} />
        <ActivityDetails activity={activity} />
        <FoodSelector
          activity={activity}
          selectedFood={selectedFood} // ส่ง selectedFood ไปให้ FoodSelector
          setSelectedFood={setSelectedFood} // ฟังก์ชันตั้งค่า selectedFood
          isEnrolled={isEnrolled} // ส่ง isEnrolled ไปด้วย
        />
        <ActivityFooter
          activity={activity}
          isEnrolled={isEnrolled}
          enrollActivity={enrollActivity}
          unenrollActivity={unenrollActivity}
          setIsEnrolled={setIsEnrolled}
          navigate={navigate}
          enrolledActivities={enrolledActivities}
          selectedFood={selectedFood}  // ส่ง selectedFood ไปที่ ActivityFooter
        />
      </div>
    </div>
  );
}
