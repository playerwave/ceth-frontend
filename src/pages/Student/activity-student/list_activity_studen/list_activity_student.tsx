// import { useEffect, useState } from "react";
// import { useActivityStore } from "../../../../stores/Student/activity.store.student";
// import { useNavigate } from "react-router-dom";

// import Loading from "../../../../components/Loading";
// import SearchBar from "../../../../components/Searchbar";
// import { AlarmClockPlus, CopyPlus } from "lucide-react";
// import ActivityTablePageStuden from "./ActivityTablePageStuden";
// import CalculateDialog from "./components/CalculateDialog"; // ✅ import dialog
// import { student } from "../../../../stores/Student/studen"; // ✅ import mock student

// const ManageActivityStuden: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     activities,
//     searchResults,
//     fetchStudentActivities,
//     searchActivities,
//     activityLoading,
//     activityError,
//   } = useActivityStore();

//   const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
//     "list"
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openDialog, setOpenDialog] = useState(false); // ✅ state สำหรับ dialog

//   const student_id = "14"

//   useEffect(() => {
//     fetchStudentActivities(student_id);
//   }, [fetchStudentActivities]);

//   const displayedActivities = searchResults ?? activities;

//   const activitiesStuden = displayedActivities.filter(
//     (a) => a.activity_status === "Public"
//   );

//   const activitiesStudenRecommend = mockActivities.filter((a) => {
//     const term = searchTerm.toLowerCase().trim();
//     const name = a.name?.toLowerCase().trim() || "";
//     return (
//       a.status === "Public" && a.recommend === "yes" && name.includes(term)
//     );
//   });

//   const handleTabChange = (tab: "list" | "calendar" | "recommend") => {
//     setActiveTab(tab);
//     setSearchTerm(""); // ✅ เคลียร์ search ทันที
//     if (tab === "list") {
//       fetchStudentActivities(student_id); // ✅ ดึงใหม่จาก backend
//     }
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (activeTab === "list") {
//       searchActivities(term);
//     }
//     // recommend ไม่ search API เพราะใช้ mock filter
//   };

//   return (
//     <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
//       <h1 className="text-center text-3xl font-bold mb-9 mt-4">
//         จัดการกิจกรรม
//       </h1>

//       {/* Search bar */}
//       <div className="flex justify-center w-full mb-4">
//         <SearchBar onSearch={handleSearch} />
//       </div>

//       {/* Tabs + Add/Calculate Button */}
//       <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
//         <div className="flex space-x-4">
//           <button
//             className={`px-4 py-2 text-lg font-semibold flex items-center ${
//               activeTab === "list"
//                 ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => handleTabChange("list")}
//           >
//             ลิสต์
//           </button>
//           <button
//             className={`px-4 py-2 text-lg font-semibold flex items-center ${
//               activeTab === "calendar"
//                 ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => handleTabChange("calendar")}
//           >
//             ปฏิทิน
//           </button>
//           <button
//             className={`px-4 py-2 text-lg font-semibold flex items-center ${
//               activeTab === "recommend"
//                 ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => handleTabChange("recommend")}
//           >
//             กิจกรรมที่แนะนำให้ลงทะเบียน
//           </button>
//         </div>

//         <div className="flex justify-end">
//           <button
//             className="w-full md:w-auto max-w-xs sm:max-w-sm bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center justify-center gap-2 hover:brightness-90 transition"
//             onClick={() =>
//               activeTab === "recommend"
//                 ? setOpenDialog(true) // ✅ เปิด dialog
//                 : navigate("/create-activity-admin", {
//                     state: { reload: true },
//                   })
//             }
//           >
//             {activeTab === "recommend" ? (
//               <>
//                 คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
//               </>
//             ) : (
//               <>
//                 เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       {activityLoading ? (
//         <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
//           <Loading />
//         </div>
//       ) : activityError ? (
//         <p className="text-center text-red-500 p-4">
//           ❌ เกิดข้อผิดพลาด: {activityError}
//         </p>
//       ) : activeTab === "list" && displayedActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "recommend" &&
//         activitiesStudenRecommend.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "list" ? (
//         <ActivityTablePageStuden rows1={activitiesStuden} rows2={[]} />
//       ) : activeTab === "recommend" ? (
//         <ActivityTablePageStuden rows1={[]} rows2={activitiesStudenRecommend} />
//       ) : (
//         <div className="text-center text-gray-500 p-6">
//           <h2 className="text-xl font-semibold">
//             📅 โหมดปฏิทิน (ยังไม่มีข้อมูล)
//           </h2>
//         </div>
//       )}

//       {/* ✅ Dialog */}
//       <CalculateDialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         currentSkillHours={{
//           hard: student.hard_hours,
//           soft: student.soft_hours,
//         }}
//         selectedActivities={student.selectedActivities}
//       />
//     </div>
//   );
// };

// export default ManageActivityStuden;

// import { useEffect, useState } from "react";
// import { useActivityStore } from "../../../../stores/Student/activity.store.student";
// import { useNavigate } from "react-router-dom";

// import Loading from "../../../../components/Loading";
// import SearchBar from "../../../../components/Searchbar";
// import { AlarmClockPlus, CopyPlus } from "lucide-react";
// import ActivityTablePageStudent from "./ActivityTablePageStuden";
// import CalculateDialog from "./components/CalculateDialog";
// // import { useAuth } from "../../../../hooks/useAuth"; // สมมติคุณมี hook ดึง userId

// import { isRecommended } from "./utils.ts/activity";

// const ManageActivityStudent: React.FC = () => {
//   const navigate = useNavigate();
//   const userId = 14; // คืนเป็น string หรือ number
//   const {
//     activities,
//     searchResults,
//     fetchStudentActivities,
//     searchActivities,
//     activityLoading,
//     activityError,
//     enrolledActivities,
//   } = useActivityStore();

//   const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
//     "list",
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);

//   // โหลดกิจกรรมเมื่อ mount หรือ userId เปลี่ยน
//   useEffect(() => {
//     if (userId) {
//       fetchStudentActivities(userId);
//     }
//   }, [fetchStudentActivities, userId]);

//   // ผลลัพธ์จาก search (ถ้ามี) หรือดึงจาก store
//   const displayed = searchResults ?? activities;

//   // กรองเฉพาะกิจกรรม public
//   const publicActivities = displayed.filter(
//     (a) => a.activity_status === "Public",
//   );

//   // กรองกิจกรรมแนะนำ (recommend === 'yes')
//   const recommendedActivities = publicActivities
//     .filter(isRecommended)
//     .filter((a) =>
//       a.activity_name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
//     );

//   const handleTabChange = (tab: "list" | "calendar" | "recommend") => {
//     setActiveTab(tab);
//     setSearchTerm("");
//     if (tab === "list" && userId) {
//       fetchStudentActivities(userId);
//     }
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (activeTab === "list") {
//       searchActivities(term);
//     }
//   };

//   return (
//     <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
//       <h1 className="text-center text-3xl font-bold mb-9 mt-4">
//         จัดการกิจกรรม
//       </h1>

//       {/* Search bar */}
//       <div className="flex justify-center w-full mb-4">
//         <SearchBar onSearch={handleSearch} />
//       </div>

//       {/* Tabs + Action Button */}
//       <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
//         <div className="flex space-x-4">
//           {(["list", "calendar", "recommend"] as const).map((tab) => (
//             <button
//               key={tab}
//               className={`px-4 py-2 text-lg font-semibold flex items-center ${
//                 activeTab === tab
//                   ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
//                   : "text-gray-500"
//               }`}
//               onClick={() => handleTabChange(tab)}
//             >
//               {
//                 {
//                   list: "ลิสต์",
//                   calendar: "ปฏิทิน",
//                   recommend: "กิจกรรมที่แนะนำ",
//                 }[tab]
//               }
//             </button>
//           ))}
//         </div>

//         <div className="flex justify-end">
//           <button
//             className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90 transition"
//             onClick={() =>
//               activeTab === "recommend"
//                 ? setOpenDialog(true)
//                 : navigate("/create-activity-admin", {
//                     state: { reload: true },
//                   })
//             }
//           >
//             {activeTab === "recommend" ? (
//               <>
//                 คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
//               </>
//             ) : (
//               <>
//                 เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       {activityLoading ? (
//         <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
//           <Loading />
//         </div>
//       ) : activityError ? (
//         <p className="text-center text-red-500 p-4">
//           ❌ เกิดข้อผิดพลาด: {activityError}
//         </p>
//       ) : activeTab === "list" && publicActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "recommend" && recommendedActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "list" ? (
//         <ActivityTablePageStudent rows1={publicActivities} rows2={[]} />
//       ) : activeTab === "recommend" ? (
//         <ActivityTablePageStudent rows1={[]} rows2={recommendedActivities} />
//       ) : (
//         <div className="text-center text-gray-500 p-6">
//           <h2 className="text-xl font-semibold">
//             📅 โหมดปฏิทิน (ยังไม่รองรับ)
//           </h2>
//         </div>
//       )}

//       {/* Calculate Dialog */}
//       <CalculateDialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         currentSkillHours={{
//           hard: enrolledActivities.reduce((sum, a) => sum + a.recieve_hours, 0),
//           soft: 0, // หรือคำนวณจาก a.type === 'Soft'
//         }}
//         selectedActivities={enrolledActivities}
//       />
//     </div>
//   );
// };

// export default ManageActivityStudent;

// src/pages/ManageActivityStudent.tsx

// src/pages/ManageActivityStudent.tsx

// import { useEffect, useState, useMemo } from "react";
// import { useActivityVisitorStore } from "../../../../stores/Visitor/activity.store.visitor";
// import { useNavigate } from "react-router-dom";

// import Loading from "../../../../components/Loading";
// import SearchBar from "../../../../components/Searchbar";
// import { AlarmClockPlus, CopyPlus } from "lucide-react";
// import ActivityTablePageStudent from "./ActivityTablePageStuden"; // ตรวจสอบชื่อไฟล์ให้ตรง ActivityTablePageStudent.tsx
// import CalculateDialog from "./components/CalculateDialog";
// // import { useAuth } from "../../../../hooks/useAuth";
// import { isRecommended } from "./utils.ts/activity";
// import { Activity } from "../../../../types/model";

// const ManageActivityStudent: React.FC = () => {
//   const navigate = useNavigate();
//   const userId = 14;

//   const {
//     activities: allPublicActivities,
//     fetchPublicActivities,
//     activityLoading,
//     activityError,
//   } = useActivityVisitorStore();

//   const [enrolledActivities, setEnrolledActivities] = useState<Activity[]>([]);

//   const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
//     "list"
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);

//   useEffect(() => {
//     fetchPublicActivities();
//   }, [fetchPublicActivities]);

//   // กรองกิจกรรมตาม searchTerm เท่านั้น
//   const publicActivities = useMemo(() => {
//     let filtered = allPublicActivities;

//     if (searchTerm.trim()) {
//       filtered = filtered.filter((a) =>
//         a.activity_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
//       );
//     }

//     return filtered; // ✅ ลบ .filter((a) => a.activity_status === "Public") ออก
//   }, [allPublicActivities, searchTerm]);

//   const recommendedActivities = useMemo(() => {
//     return publicActivities.filter(isRecommended);
//   }, [publicActivities]);

//   const handleTabChange = (tab: "list" | "calendar" | "recommend") => {
//     setActiveTab(tab);
//     setSearchTerm("");
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//   };

//   return (
//     <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
//       <h1 className="text-center text-3xl font-bold mb-9 mt-4">
//         จัดการกิจกรรม
//       </h1>

//       {/* Search bar */}
//       <div className="flex justify-center w-full mb-4">
//         <SearchBar onSearch={handleSearch} />
//       </div>

//       {/* Tabs + Action Button */}
//       <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
//         <div className="flex space-x-4">
//           {(["list", "calendar", "recommend"] as const).map((tab) => (
//             <button
//               key={tab}
//               className={`px-4 py-2 text-lg font-semibold flex items-center ${
//                 activeTab === tab
//                   ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
//                   : "text-gray-500"
//               }`}
//               onClick={() => handleTabChange(tab)}
//             >
//               {
//                 {
//                   list: "ลิสต์",
//                   calendar: "ปฏิทิน",
//                   recommend: "กิจกรรมที่แนะนำ",
//                 }[tab]
//               }
//             </button>
//           ))}
//         </div>

//         <div className="flex justify-end">
//           <button
//             className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90 transition"
//             onClick={() =>
//               activeTab === "recommend"
//                 ? setOpenDialog(true)
//                 : navigate("/create-activity-admin", {
//                     state: { reload: true },
//                   })
//             }
//           >
//             {activeTab === "recommend" ? (
//               <>
//                 คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
//               </>
//             ) : (
//               <>
//                 เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       {activityLoading ? (
//         <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
//           <Loading />
//         </div>
//       ) : activityError ? (
//         <p className="text-center text-red-500 p-4">
//           ❌ เกิดข้อผิดพลาด: {activityError}
//         </p>
//       ) : activeTab === "list" && publicActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "recommend" && recommendedActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "list" ? (
//         <ActivityTablePageStudent rows1={publicActivities} rows2={[]} />
//       ) : activeTab === "recommend" ? (
//         <ActivityTablePageStudent rows1={[]} rows2={recommendedActivities} />
//       ) : (
//         <div className="text-center text-gray-500 p-6">
//           <h2 className="text-xl font-semibold">
//             📅 โหมดปฏิทิน (ยังไม่รองรับ)
//           </h2>
//         </div>
//       )}

//       {/* Calculate Dialog */}
//       <CalculateDialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         currentSkillHours={{
//           hard: enrolledActivities.reduce(
//             (sum, a) => sum + (a.type === "Hard" ? a.recieve_hours : 0),
//             0
//           ),
//           soft: enrolledActivities.reduce(
//             (sum, a) => sum + (a.type === "Soft" ? a.recieve_hours : 0),
//             0
//           ),
//         }}
//         selectedActivities={enrolledActivities}
//       />
//     </div>
//   );
// };

// export default ManageActivityStudent;

import { useEffect, useState, useMemo } from "react";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import { AlarmClockPlus, CopyPlus } from "lucide-react";
import ActivityTablePageStudent from "./ActivityTablePageStuden"; // ตรวจสอบชื่อไฟล์ให้ตรง ActivityTablePageStudent.tsx
import CalculateDialog from "./components/CalculateDialog";
// import { useAuth } from "../../../../hooks/useAuth";
import { isRecommended } from "./utils.ts/activity";
import { Activity } from "../../../../types/model";

const ManageActivityStudent: React.FC = () => {
  const navigate = useNavigate();
  const userId = 14;

  const {
    activities: allPublicActivities,
    fetchActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const [enrolledActivities, setEnrolledActivities] = useState<Activity[]>([]);

  const [activeTab, setActiveTab] = useState<"list" | "calendar" | "recommend">(
    "list"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // กรองกิจกรรมตาม searchTerm เท่านั้น
  const publicActivities = useMemo(() => {
    let filtered = allPublicActivities;

    if (searchTerm.trim()) {
      filtered = filtered.filter((a) =>
        a.activity_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    return filtered; // ✅ ลบ .filter((a) => a.activity_status === "Public") ออก
  }, [allPublicActivities, searchTerm]);

  const recommendedActivities = useMemo(() => {
    return publicActivities.filter(isRecommended);
  }, [publicActivities]);

  const handleTabChange = (tab: "list" | "calendar" | "recommend") => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
      <h1 className="text-center text-3xl font-bold mb-9 mt-4">
        จัดการกิจกรรม
      </h1>

      {/* Search bar */}
      <div className="flex justify-center w-full mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Tabs + Action Button */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex space-x-4">
          {(["list", "calendar", "recommend"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-lg font-semibold flex items-center ${
                activeTab === tab
                  ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {
                {
                  list: "ลิสต์",
                  calendar: "ปฏิทิน",
                  recommend: "กิจกรรมที่แนะนำ",
                }[tab]
              }
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90 transition"
            onClick={() =>
              activeTab === "recommend"
                ? setOpenDialog(true)
                : navigate("/create-activity-admin", {
                    state: { reload: true },
                  })
            }
          >
            {activeTab === "recommend" ? (
              <>
                คำนวณชั่วโมง <AlarmClockPlus className="w-4 h-4" />
              </>
            ) : (
              <>
                เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activityLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
          <Loading />
        </div>
      ) : activityError ? (
        <p className="text-center text-red-500 p-4">
          ❌ เกิดข้อผิดพลาด: {activityError}
        </p>
      ) : activeTab === "list" && publicActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "recommend" && recommendedActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "list" ? (
        <ActivityTablePageStudent rows1={publicActivities} rows2={[]} />
      ) : activeTab === "recommend" ? (
        <ActivityTablePageStudent rows1={[]} rows2={recommendedActivities} />
      ) : (
        <div className="text-center text-gray-500 p-6">
          <h2 className="text-xl font-semibold">
            📅 โหมดปฏิทิน (ยังไม่รองรับ)
          </h2>
        </div>
      )}

      {/* Calculate Dialog */}
      <CalculateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        currentSkillHours={{
          hard: enrolledActivities.reduce(
            (sum, a) => sum + (a.type === "Hard" ? a.recieve_hours : 0),
            0
          ),
          soft: enrolledActivities.reduce(
            (sum, a) => sum + (a.type === "Soft" ? a.recieve_hours : 0),
            0
          ),
        }}
        selectedActivities={enrolledActivities}
      />
    </div>
  );
};

export default ManageActivityStudent;
