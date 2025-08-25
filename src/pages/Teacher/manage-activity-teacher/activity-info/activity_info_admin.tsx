import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import {
  useSecureParams,
  extractSecureParam,
  useSecureLink,
} from "../../../../routes/secure/SecureRoute";

import Loading from "../../../../components/Loading";
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter";
import ActivityUrl from "./components/ActivityUrl";

export default function ActivityInfoAdmin() {
  const navigate = useNavigate();
  const params = useSecureParams();
  const { createSecureLink } = useSecureLink();

  const finalActivityId = extractSecureParam(params, "id", 0);

  const { activity, error, fetchActivity, activityLoading } =
    useActivityStore();

  const { foods, fetchFoods } = useFoodStore();

  const fetchActivityData = useCallback(() => {
    if (finalActivityId) {
      fetchActivity(finalActivityId);
    }
  }, [finalActivityId, fetchActivity]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  useEffect(() => {
    if (foods.length === 0) {
      fetchFoods();
    }
  }, [foods.length, fetchFoods]);

  const handleToUpdateActivity = (activity_id: number) => {
    // สร้าง URL ที่เข้ารหัสสำหรับหน้า update
    const encryptedUrl = createSecureLink("/update-activity-admin", {
      id: activity_id,
      name: "Update Activity",
      type: "update",
      isActive: true,
      timestamp: Date.now(),
    });

    console.log("🔄 Navigating to update activity:", activity_id);
    console.log("🔐 Generated update URL:", encryptedUrl);

    window.location.href = encryptedUrl;
  };

  if (activityLoading) return <Loading />;
  if (error)
    return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  // Debug: Log activity data to see the structure
  console.log("🔍 Activity data:", activity);
  console.log("🔍 Foods data:", foods);
  console.log("🔍 Activity foods:", activity.activityFood);
  console.log("🔍 Activity foods (alternative):", (activity as any).foods);
  console.log("🔍 Image URL:", activity.image_url);
  console.log("🔍 Image URL type:", typeof activity.image_url);

  // ✅ Debug: Log time data from backend
  console.log("🕐 Start time from backend:", activity.start_activity_date);
  console.log("🕐 End time from backend:", activity.end_activity_date);
  console.log("🕐 Start time type:", typeof activity.start_activity_date);
  console.log("🕐 End time type:", typeof activity.end_activity_date);

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

        {/* Debug: Show food data info */}
        {/* {import.meta.env.DEV && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p>🔍 Debug Food Info:</p>
            <p>Activity Foods: {JSON.stringify(activity.activityFood)}</p>
            <p>Alternative Foods: {JSON.stringify((activity as any).foods)}</p>
            <p>Related Foods Count: {relatedFoods.length}</p>
            <p>All Foods Count: {foods.length}</p>
          </div>
        )} */}

        <div className="mt-8">
          <FoodSelector
            foodList={relatedFoods}
            locationType={activity.event_format}
          />
        </div>

        <div className="mt-8">
          <ActivityUrl url={activity.url || ""} label={activity.url || "-"} />
        </div>

        <div className="mt-8">
          <ActivityFooter
            startTime={activity.start_activity_date}
            endTime={activity.end_activity_date}
            state={activity.activity_state}
            eventFormat={activity.event_format}
            onBack={() =>
              navigate("/list-activity-admin", { state: { reload: true } })
            }
            onEdit={() => handleToUpdateActivity(activity.activity_id)}
          />
        </div>
      </div>
    </div>
  );
}
