// import { useEffect, useCallback } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
// import Loading from "../../../../components/Loading";
// import ActivityHeader from "./components/ActivityHeader";
// import ActivityImage from "./components/ActivityImage";
// import ActivityDetails from "./components/ActivityDetails";
// import FoodSelector from "./components/FoodSelector";
// import ActivityFooter from "./components/ActivityFooter";

// export default function ActivityInfoAdmin() {
//   const { id: paramId } = useParams();
//   const location = useLocation();
//   const id = location.state?.id || paramId;
//   const finalActivityId = id ? Number(id) : null;
//   const navigate = useNavigate();

//   const { activity, error, fetchActivity, activityLoading } =
//     useActivityStore();

//   const fetchActivityData = useCallback(() => {
//     if (finalActivityId !== null && !isNaN(finalActivityId)) {
//       fetchActivity(finalActivityId);
//     }
//   }, [finalActivityId, fetchActivity]);

//   useEffect(() => {
//     fetchActivityData();
//   }, [fetchActivityData]);

//   const handleToUpdateActivity = (id: string) => {
//     navigate("/update-activity-admin", { state: { id } });
//   };

//   if (activityLoading) return <Loading />;
//   if (error)
//     return <p className="text-center text-lg text-red-500">❌ {error}</p>;
//   if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

//   return (
//     <div className="justify-items-center">
//       <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
//         <ActivityHeader
//           name={activity.name}
//           registeredCount={activity.registered_count}
//           seat={activity.seat}
//           onClickRegistered={() =>
//             navigate(`/enrolled_list_admin/${activity.id}`)
//           }
//         />

//         <ActivityImage imageUrl={activity.image_url} />

//         <ActivityDetails activity={activity} />

//         <FoodSelector
//           foodList={activity.food}
//           locationType={activity.location_type}
//         />

//         <ActivityFooter
//           startTime={activity.start_time}
//           endTime={activity.end_time}
//           state={activity.state}
//           onBack={() =>
//             navigate("/list-activity-admin", { state: { reload: true } })
//           }
//           onEdit={() => handleToUpdateActivity(activity.id)}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import Loading from "../../../../components/Loading";
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter";

export default function ActivityInfoAdmin() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const idFromState = location.state?.id;
  const finalActivityId = idFromState
    ? Number(idFromState)
    : paramId
    ? Number(paramId)
    : null;

  const {
    activity,
    error,
    fetchActivity,
    activityLoading,
  } = useActivityStore();

  const { foods, fetchFoods } = useFoodStore();

  const fetchActivityData = useCallback(() => {
    if (finalActivityId !== null && !isNaN(finalActivityId)) {
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
    navigate("/update-activity-admin", { state: { id: activity_id } });
  };

  if (activityLoading) return <Loading />;
  if (error)
    return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity)
    return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  // ✅ แมปรายการอาหารที่เกี่ยวข้องกับกิจกรรม จาก activity.foods (ActivityFood[])
  const relatedFoods =
    Array.isArray(activity.foods) && activity.foods.length > 0
      ? foods.filter((food) =>
          activity.foods.some((af) => af.food_id === food.food_id)
        )
      : [];

  return (
    <div className="justify-items-center">
      <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader
          name={activity.activity_name}
          seat={activity.seat}
          onClickRegistered={() =>
            navigate(`/enrolled_list_admin/${activity.activity_id}`)
          }
        />

        <ActivityImage imageUrl={activity.image_url} />

        <ActivityDetails activity={activity} />

        <FoodSelector
          foodList={relatedFoods}
          locationType={activity.event_format}
        />

        <ActivityFooter
          startTime={activity.start_activity_date}
          endTime={activity.end_activity_date}
          state={activity.activity_state}
          onBack={() =>
            navigate("/list-activity-admin", { state: { reload: true } })
          }
          onEdit={() => handleToUpdateActivity(activity.activity_id)}
        />
      </div>
    </div>
  );
}

