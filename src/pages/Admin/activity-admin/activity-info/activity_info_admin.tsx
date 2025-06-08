import { useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Admin/store_activity_info_admin";
import Loading from "../../../../components/Loading";
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter";

export default function ActivityInfoAdmin() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId;
  const finalActivityId = id ? Number(id) : null;
  const navigate = useNavigate();

  const { activity, error, fetchActivity, activityLoading } =
    useActivityStore();

  const fetchActivityData = useCallback(() => {
    if (finalActivityId !== null && !isNaN(finalActivityId)) {
      fetchActivity(finalActivityId);
    }
  }, [finalActivityId, fetchActivity]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const handleToUpdateActivity = (id: string) => {
    navigate("/update-activity-admin", { state: { id } });
  };

  if (activityLoading) return <Loading />;
  if (error)
    return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  return (
    <div className="justify-items-center">
      <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader
          name={activity.name}
          registeredCount={activity.registered_count}
          seat={activity.seat}
          onClickRegistered={() =>
            navigate(`/enrolled_list_admin/${activity.id}`)
          }
        />

        <ActivityImage imageUrl={activity.image_url} />

        <ActivityDetails activity={activity} />

        <FoodSelector
          foodList={activity.food}
          locationType={activity.location_type}
        />

        <ActivityFooter
          startTime={activity.start_time}
          endTime={activity.end_time}
          state={activity.state}
          onBack={() =>
            navigate("/list-activity-admin", { state: { reload: true } })
          }
          onEdit={() => handleToUpdateActivity(activity.id)}
        />
      </div>
    </div>
  );
}
