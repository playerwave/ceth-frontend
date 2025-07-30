// import { useEffect, useCallback } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
// import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
// import Loading from "../../../../components/Loading";
// import ActivityHeader from "./components/ActivityHeader";
// import ActivityImage from "./components/ActivityImage";
// import ActivityDetails from "./components/ActivityDetails";
// import FoodSelector from "./components/FoodSelector";
// import ActivityFooter from "./components/ActivityFooter";

// // 🔐 Import สำหรับการเข้ารหัส
// import { useSecureParams, extractSecureParam, hasSecureParam } from "../../../../routes/secure/SecureRoute";

// export default function ActivityInfoAdmin() {
//   const { id: paramId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // 🔐 ดึงพารามิเตอร์จาก URL ที่เข้ารหัส
//   const secureParams = useSecureParams();

//   // 🔍 ดึง ID จากหลายแหล่ง (เข้ารหัส > state > params)
//   const idFromSecure = extractSecureParam(secureParams, 'id', 0);
//   const idFromState = location.state?.id;
//   const idFromParams = paramId ? Number(paramId) : null;
  
//   const finalActivityId = idFromSecure || idFromState || idFromParams;

//   const {
//     activity,
//     error,
//     fetchActivity,
//     activityLoading,
//   } = useActivityStore();

//   const { foods, fetchFoods } = useFoodStore();

//   const fetchActivityData = useCallback(() => {
//     if (finalActivityId !== null && !isNaN(finalActivityId)) {
//       fetchActivity(finalActivityId);
//     }
//   }, [finalActivityId, fetchActivity]);

//   useEffect(() => {
//     fetchActivityData();
//   }, [fetchActivityData]);

//   useEffect(() => {
//     if (foods.length === 0) {
//       fetchFoods();
//     }
//   }, [foods.length, fetchFoods]);

//   const handleToUpdateActivity = (activity_id: number) => {
//     navigate("/update-activity-admin", { state: { id: activity_id } });
//   };

//   // 🔍 ตรวจสอบแหล่งข้อมูล
//   const dataSource = Object.keys(secureParams).length > 0 ? 'encrypted' : 'normal';

//   if (activityLoading) return <Loading />;
//   if (error)
//     return <p className="text-center text-lg text-red-500">❌ {error}</p>;
//   if (!activity)
//     return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

//   // ✅ แมปรายการอาหารที่เกี่ยวข้องกับกิจกรรม จาก activity.foods (ActivityFood[])
//   const relatedFoods =
//     Array.isArray((activity as any).foods) && (activity as any).foods.length > 0
//       ? foods.filter((food) =>
//           (activity as any).foods.some((af: any) => af.food_id === food.food_id)
//         )
//       : [];

//   return (
//     <div className="justify-items-center">
//       {/* 🔐 แสดงแหล่งข้อมูล (สำหรับ debug) */}
//       {import.meta.env.DEV && (
//         <div className="w-320 mx-auto ml-2xl mt-2 mb-2 bg-blue-50 p-2 border border-blue-200 rounded text-xs">
//           <span className="font-semibold">แหล่งข้อมูล:</span> {dataSource === 'encrypted' ? 'URL ที่เข้ารหัส' : 'URL ปกติ'} 
//           | ID: {finalActivityId}
//         </div>
//       )}

//       <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
//         <ActivityHeader
//           name={activity.activity_name}
//           seat={activity.seat}
//           onClickRegistered={() =>
//             navigate(`/enrolled_list_admin/${activity.activity_id}`)
//           }
//         />

//         <ActivityImage imageUrl={activity.image_url} />

//         <ActivityDetails activity={activity} />

//         <FoodSelector
//           foodList={relatedFoods}
//           locationType={activity.event_format}
//         />

//         <ActivityFooter
//           startTime={activity.start_activity_date}
//           endTime={activity.end_activity_date}
//           state={activity.activity_state}
//           onBack={() =>
//             navigate("/list-activity-admin", { state: { reload: true } })
//           }
//           onEdit={() => handleToUpdateActivity(activity.activity_id)}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import {
  useSecureParams,
  extractSecureParam,
} from "../../../../routes/secure/SecureRoute";

import Loading from "../../../../components/Loading";
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter";

export default function ActivityInfoAdmin() {
  const navigate = useNavigate();
  const params = useSecureParams();

  const finalActivityId = extractSecureParam(params, 'id', 0);

  const {
    activity,
    error,
    fetchActivity,
    activityLoading,
  } = useActivityStore();

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
    navigate("/update-activity-admin", { state: { id: activity_id } });
  };

  if (activityLoading) return <Loading />;
  if (error) return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  const relatedFoods =
    Array.isArray(activity.activityFood) && activity.activityFood.length > 0
      ? foods.filter((food) =>
          activity.activityFood.some((af) => af.food_id === food.food_id)
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
