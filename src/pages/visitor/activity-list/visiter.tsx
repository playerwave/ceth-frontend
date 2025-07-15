// import { useEffect, useState } from "react";
// import { useActivityStore } from "../../stores/Student/activity.store.student";

// import Loading from "../../components/Loading";
// import SearchBar from "../../components/Searchbar";
// import ActivityTablePage from "./ActivityTablePageVIsiter";

// const VisitorActivityList: React.FC = () => {
//   const {
//     //activities,
//     //searchResults,
//     fetchStudentActivities,
//     //searchActivities,
//     activityLoading,
//     activityError,
    
//   } = useActivityStore();

//   const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchActivities();
//   }, [fetchActivities]);

//   // const displayedActivities = searchResults ?? activities;

//   const activitiesForVisiter = mockActivities.filter(
//     (a) => a.status === "Public",
//   );

//   // const handleSearch = (term: string) => {
//   //   if (term.trim() === searchTerm.trim()) return;
//   //   setSearchTerm(term);
//   //   searchActivities(term);
//   // };
//   const displayedActivities = activitiesForVisiter.filter((a) => {
//     const lowerSearch = searchTerm.trim().toLowerCase();

//     return (
//       a.name?.toLowerCase().normalize("NFC").includes(lowerSearch) ||
//       a.id?.toString().includes(lowerSearch)
//     );
//   });

//   const handleSearch = (term: string) => {
//     console.log("searchTerm:", searchTerm);
//     console.log(
//       "filtered:",
//       displayedActivities.map((a) => a.name),
//     );
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

//       {/* Tabs */}
//       <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
//         <div className="flex space-x-4">
//           <button
//             className={`px-4 py-2 text-lg font-semibold flex items-center ${
//               activeTab === "list"
//                 ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActiveTab("list")}
//           >
//             ลิสต์
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
//       ) : displayedActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">
//           📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
//         </p>
//       ) : activeTab === "list" ? (
//         <ActivityTablePage rows1={displayedActivities} />
//       ) : null}
//     </div>
//   );
// };

// export default VisitorActivityList;

import { useEffect, useState } from "react";
import { useActivityStore } from "../../../stores/Student/activity.store.student";
import Loading from "../../../components/Loading";
import SearchBar from "../../../components/Searchbar";
import ActivityTablePage from "./ActivityTablePageVIsiter";

const VisitorActivityList: React.FC = () => {
  const {
    activities,
    fetchStudentActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudentActivities(1); // TODO: เปลี่ยนเป็น userId จริงหากมี
  }, [fetchStudentActivities]);

  const activitiesForVisiter = activities.filter((a) => a.activity_status === "Public");

  const displayedActivities = activitiesForVisiter.filter((a) => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return (
      a.activity_name?.toLowerCase().normalize("NFC").includes(lowerSearch) ||
      a.activity_id?.toString().includes(lowerSearch)
    );
  });

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

      {/* Tabs */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-lg font-semibold flex items-center ${
              activeTab === "list"
                ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("list")}
          >
            ลิสต์
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
      ) : displayedActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "list" ? (
        <ActivityTablePage rows1={displayedActivities} />
      ) : null}
    </div>
  );
};

export default VisitorActivityList;
