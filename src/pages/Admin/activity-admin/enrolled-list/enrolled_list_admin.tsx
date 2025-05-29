// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useActivityStore } from "../../../../stores/Admin/store_activity_info_admin";
// import { useEnrolledStudentStore } from "../../../../stores/Admin/store_enrolled_student_admin";

// import EnrolledListHeader from "./components/EnrolledListHeader";
// import EnrolledListFilter from "./components/EnrolledListFilter";
// import EnrolledListTable from "./components/EnrolledListTable";
// import EnrolledListFooter from "./components/EnrolledListFooter";
// import SummaryPage from "./components/SummaryPage";

// export default function EnrolledListAdmin() {
//   const { id } = useParams<{ id: string }>();
//   const activityId = Number(id);
//   const navigate = useNavigate();

//   const { activity, fetchActivity, activityLoading } = useActivityStore();
//   const { enrolledStudents, fetchEnrolledStudents } = useEnrolledStudentStore();

//   const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
//   const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

//   useEffect(() => {
//     if (!isNaN(activityId) && activityId > 0) {
//       fetchActivity(activityId);
//     }
//   }, [activityId, fetchActivity]);

//   useEffect(() => {
//     if (activity && parseInt(activity.id) === activityId) {
//       fetchEnrolledStudents(activityId);
//     }
//   }, [activity, activityId, fetchEnrolledStudents]);

//   const filteredStudents = enrolledStudents.filter((student) => {
//     return true; // ใส่เงื่อนไขฟิลเตอร์ถ้าต้องการ
//   });

//   const [activeTab, setActiveTab] = useState("list");

//   return (
//     <div className="p-6 w-340 h-230 mx-auto">
//       <div>
//       <div>
//         {activeTab === "list" && (
//           <div>
//             <h1 className="text-3xl font-bold mb-4">นิสิตที่ลงทะเบียน</h1>
//           </div>
//         )}
//         {activeTab === "summary" && (
//           <div>
//             <h1 className="text-3xl font-bold mb-4">สรุปผลกิจกรรม</h1>
//           </div>
//         )}
//       </div>

//       {/* ปุ่ม tab อยู่ข้างล่าง */}
//       <div className="flex gap-6 text-lg">
//         <button
//           className={`relative pb-2 transition-all ${
//             activeTab === "list" ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full" : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("list")}
//         >
//           ลิสต์
//         </button>

//         <button
//           className={`relative pb-2 transition-all ${
//             activeTab === "summary" ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full" : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("summary")}
//         >
//           สรุปกิจกรรม
//         </button>
//       </div>
//     </div>

//       {/* <div className="p-0 w-full h-[710px] border border-gray-300 shadow-md rounded-lg flex flex-col">
//         <EnrolledListFilter
//           selectedDepartments={selectedDepartments}
//           setSelectedDepartments={setSelectedDepartments}
//           selectedStatus={selectedStatus}
//           setSelectedStatus={setSelectedStatus}
//           activity={activity} // ส่งข้อมูลกิจกรรมไปยัง EnrolledListFilter
//         />

//         <div className="p-0 w-full h-[710px] border border-gray-300 shadow-md rounded-lg flex flex-col">
//           <EnrolledListTable
//             activityLoading={activityLoading}
//             enrolledStudents={filteredStudents}
//             filteredStudents={filteredStudents} // ส่ง filteredStudents ให้ Table
//             activity={activity} // ส่ง activity ให้ Table
//           />

//           <EnrolledListFooter />
//         </div>
//       </div> */}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Admin/store_activity_info_admin";
import { useEnrolledStudentStore } from "../../../../stores/Admin/store_enrolled_student_admin";

import EnrolledListHeader from "./components/EnrolledListHeader";
import EnrolledListFilter from "./components/EnrolledListFilter";
import EnrolledListTable from "./components/EnrolledListTable";
import EnrolledListFooter from "./components/EnrolledListFooter";
import SummaryPage from "../summary/SummaryPage";

export default function EnrolledListAdmin() {
  const { id } = useParams<{ id: string }>();
  const activityId = Number(id);
  const navigate = useNavigate();

  const { activity, fetchActivity, activityLoading } = useActivityStore();
  const { enrolledStudents, fetchEnrolledStudents } = useEnrolledStudentStore();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    if (!isNaN(activityId) && activityId > 0) {
      fetchActivity(activityId);
    }
  }, [activityId, fetchActivity]);

  useEffect(() => {
    if (activity && parseInt(activity.id) === activityId) {
      fetchEnrolledStudents(activityId);
    }
  }, [activity, activityId, fetchEnrolledStudents]);

  const filteredStudents = enrolledStudents.filter((student) => {
    return true; // ใส่เงื่อนไขฟิลเตอร์ถ้าต้องการ
  });
  const [activeTab, setActiveTab] = useState<"list" | "summary">("list");

  return (
    <div className="p-4 mx-auto">
      {/* Header (ชื่อเรื่อง + ปุ่ม Tab) */}
      <EnrolledListHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* แสดงเนื้อหาตาม Tab */}
      <div className="mt-6">
        {activeTab === "list" && (
          <div className="p-0 w-full h-[710px] border border-gray-300 shadow-md rounded-lg flex flex-col">
            <EnrolledListFilter
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              activity={activity}
            />
            <div className="p-0 w-full h-[710px] border border-gray-300 shadow-md rounded-lg flex flex-col">
              <EnrolledListTable
                activityLoading={activityLoading}
                enrolledStudents={filteredStudents}
                filteredStudents={filteredStudents}
                activity={activity}
              />
              <EnrolledListFooter />
            </div>
          </div>
        )}
        {activeTab === "summary" && <SummaryPage />}
      </div>
    </div>
  );
}
