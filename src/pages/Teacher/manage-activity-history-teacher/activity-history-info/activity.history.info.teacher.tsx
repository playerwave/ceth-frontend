import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Activity } from "../../../../types/activity.types";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import ActivityHeader from "../../manage-activity-teacher/activity-info/components/activityHeader";
import ActivityImage from "../../manage-activity-teacher/activity-info/components/activityImage";
import ActivityDetails from "../../manage-activity-teacher/activity-info/components/activityDetails";
import FoodSelector from "../../manage-activity-teacher/activity-info/components/foodSelector";
import ActivityUrl from "../../manage-activity-teacher/activity-info/components/activityUrl";

const ActivityHistoryInfoTeacher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { foods, fetchFoods } = useFoodStore();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // รับข้อมูล activity จาก state ที่ส่งมาจากการ navigate
    if (location.state?.activity) {
      setActivity(location.state.activity);
    } else {
      // ถ้าไม่มี state ให้กลับไปหน้าลิสต์
      navigate("/list-activity-history-teacher");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (foods.length === 0) {
      fetchFoods();
    }
  }, [foods.length, fetchFoods]);

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const relatedFoods =
    Array.isArray(activity.activityFood) && activity.activityFood.length > 0
      ? foods.filter((food) =>
          activity.activityFood.some((af) => af.food_id === food.food_id)
        )
      : Array.isArray((activity as any).foods) &&
          (activity as any).foods.length > 0
        ? foods.filter((food) =>
            (activity as any).foods.some(
              (af: any) => af.food_id === food.food_id
            )
          )
        : [];

  return (
    <div className="justify-items-center">
      <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader
          name={activity.activity_name}
          seat={activity.seat}
          registeredCount={activity.registered_count}
          onClickRegistered={() =>
            navigate(`/enrolled_list_admin/${activity.activity_id}`)
          }
        />

        <ActivityImage imageUrl={activity.image_url} />

        <div className="mt-10">
          <ActivityDetails activity={activity} />
        </div>

        <div className="mt-8">
          <FoodSelector
            foodList={relatedFoods}
            locationType={activity.event_format}
          />
        </div>

        <div className="mt-8">
          <ActivityUrl url={activity.url || ""} label={activity.url || "-"} />
        </div>


      </div>
    </div>
  );
};

export default ActivityHistoryInfoTeacher;
