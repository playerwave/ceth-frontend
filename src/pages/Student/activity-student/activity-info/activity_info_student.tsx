// import { useEffect, useState, useMemo, useRef } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useActivityStore } from "../../../../stores/Student/activity.store.student";

// // Import components
// import ActivityHeader from "./components/ActivityHeader";
// import ActivityImage from "./components/ActivityImage";
// import ActivityDetails from "./components/ActivityDetails";
// import FoodSelector from "./components/FoodSelector";
// import ActivityFooter from "./components/ActivityFooter"; // เปลี่ยนเป็น ActivityFooter
// import Loading from "../../../../components/Loading";
// import { useAuthStore } from "../../../../stores/Visitor/auth.store";
// import ActivityUrl from "./components/ActivityUrl";

// export default function ActivityInfoStudent() {
//   const { id: paramId } = useParams();
//   const location = useLocation();
//   const id = location.state?.id || paramId;
//   const navigate = useNavigate();

//   const {
//     activity,
//     activityLoading,
//     activityError,
//     fetchActivity,
//     enrolledActivities,
//     fetchEnrolledActivities,
//     enrollActivity,
//     unenrollActivity,
//   } = useActivityStore();

//   const { user, fetchMe } = useAuthStore();
//   const lastStudentIdRef = useRef<number | null>(null);
  
//   // ใช้ students_id จาก auth store หรือ fallback เป็น 3
//   const studentId = useMemo(() => {
//     return user?.student?.students_id || 3;
//   }, [user?.student?.students_id]);

//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [selectedFood, setSelectedFood] = useState<string>("");

//   // Fetch user data on mount only if user is not authenticated
//   useEffect(() => {
//     if (!user || user.role === "Visitor") {
//       fetchMe();
//     }
//   }, []); // ลบ fetchMe ออกจาก dependency array

//   useEffect(() => {
//     const studentIdValue = user?.student?.students_id;
//     const isValidId = typeof studentIdValue === "number" && studentIdValue > 0;
  
//     if (isValidId && studentIdValue !== lastStudentIdRef.current) {
//       lastStudentIdRef.current = studentIdValue;
//       fetchEnrolledActivities(studentIdValue);
//       fetchActivity(id, studentIdValue);
//     }
//   }, [user?.student?.students_id, id]);

//   useEffect(() => {
//     if (enrolledActivities.length === 0) return;
//     const isUserEnrolled = enrolledActivities.some(
//       (act) => Number(act.activity_id) === Number(id)
//     );
//     setIsEnrolled(isUserEnrolled);
//   }, [enrolledActivities, id]);

//   const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedFood(e.target.value);
//   };

//   if (activityLoading) return <Loading />;
//   if (activityError)
//     return (
//       <p className="text-center text-lg text-red-500">❌ {activityError}</p>
//     );
//   if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

//   return (
//     <div className="justify-items-center">
//       <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
//         <ActivityHeader activity={activity} />
//         <ActivityImage imageUrl={typeof activity.image_url === "string" ? activity.image_url : null} />
//         <ActivityDetails activity={activity} />
//         <FoodSelector
//           activity={activity}
//           selectedFood={selectedFood}
//           setSelectedFood={setSelectedFood}
//           isEnrolled={isEnrolled}
//         />
//         <ActivityFooter
//           activity={activity}
//           isEnrolled={isEnrolled}
//           enrollActivity={enrollActivity}
//           unenrollActivity={unenrollActivity}
//           setIsEnrolled={setIsEnrolled}
//           navigate={navigate}
//           enrolledActivities={enrolledActivities}
//           selectedFood={selectedFood}
//           userId={studentId}
//         />
//       </div>
//     </div>
//   );
// }



import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation, useMatch } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";

// Components
import ActivityHeader from "./components/ActivityHeader";
import ActivityImage from "./components/ActivityImage";
import ActivityDetails from "./components/ActivityDetails";
import FoodSelector from "./components/FoodSelector";
import ActivityFooter from "./components/ActivityFooter";
import Loading from "../../../../components/Loading";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

type Mode = "catalog" | "history";
type LocationState = { id?: number | string; mode?: Mode };

export default function ActivityInfoStudent() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const state = (location.state as LocationState | undefined) ?? {};
  const navigate = useNavigate();

  // ใช้ path เพื่อตัดสินโหมดเมื่อ refresh
  const hitHistoryPath = useMatch("/activity-history-info-student/:id");
  const mode: Mode = state.mode ?? (hitHistoryPath ? "history" : "catalog");

  // ✅ ใช้ activityId แบบ number เดียว
  const rawId = state.id ?? paramId;
  const activityId = Number(rawId);

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

  const { user, isAuthenticated, authLoading, fetchMe } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) fetchMe();
  }, [isAuthenticated, authLoading, fetchMe]);

  // ✅ ดึง students_id จาก auth เท่านั้น
  const studentId = useMemo(() => {
    const sid = user?.student?.students_id;
    return typeof sid === "number" && sid > 0 ? sid : null;
  }, [user?.student?.students_id]);

  // === Local UI state ===
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string>("");

  // ✅ ยิงโหลดเมื่อมี studentId และ activityId ที่เป็นตัวเลข
  useEffect(() => {
    if (!studentId || !Number.isFinite(activityId)) return;
    fetchEnrolledActivities(studentId);
    fetchActivity(activityId, studentId);
  }, [studentId, activityId, fetchEnrolledActivities, fetchActivity]);

  // sync isEnrolled
  useEffect(() => {
    if (!Number.isFinite(activityId) || !Array.isArray(enrolledActivities)) return;
    const enrolled = enrolledActivities.some(
      (act) => Number(act.activity_id) === activityId
    );
    setIsEnrolled(enrolled);
  }, [enrolledActivities, activityId]);

  // ===== Render guards =====
  if (authLoading || !studentId) return <Loading />;
  if (activityLoading) return <Loading />;
  if (activityError)
    return <p className="text-center text-lg text-red-500">❌ {activityError}</p>;
  if (!Number.isFinite(activityId)) {
  return <p className="text-center text-lg">⚠️ ไม่พบรหัสกิจกรรม</p>;
}
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  const evaluationDone = Boolean((activity as any)?.evaluation_done);

  return (
    <div className="justify-items-center">
      <div className="w-320 h-auto min-h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <ActivityHeader activity={activity} />
        <ActivityImage
          imageUrl={typeof activity.image_url === "string" ? activity.image_url : null}
        />
        <ActivityDetails activity={activity} />
        <FoodSelector
          activity={activity}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          isEnrolled={isEnrolled}
        />
        <ActivityFooter
          mode={mode}
          evaluationDone={evaluationDone}
          activity={activity}
          isEnrolled={isEnrolled}
          enrollActivity={enrollActivity}
          unenrollActivity={unenrollActivity}
          setIsEnrolled={setIsEnrolled}
          navigate={navigate}
          enrolledActivities={enrolledActivities}
          selectedFood={selectedFood}
          userId={studentId}
        />
      </div>
    </div>
  );
}
