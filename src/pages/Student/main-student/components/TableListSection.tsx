// import React from "react";
// import { Card, Typography } from "@mui/material";
// import Table from "../../../../components/Student/table";
// import Loading from "../../../../components/Loading";
// import { MainActivity } from "../../../../types/Student/type_main_activity_student";
// import CustomCard from "../../../../components/Card";

// interface TableActivitySectionProps {
//   activityLoading: boolean;
//   activityError: string | null;
//   enrolledActivities: MainActivity[];
//   transformedActivities: any[];
// }

// const TableActivitySection: React.FC<TableActivitySectionProps> = ({
//   activityLoading,
//   activityError,
//   enrolledActivities,
//   transformedActivities,
// }) => {
//   return (
//     <CustomCard className="mt-6 mx-auto" width="100%">
//       <Typography variant="h6" fontWeight="bold" gutterBottom>
//         ลิสต์กิจกรรมของฉัน
//       </Typography>
//         {activityLoading ? (
//           <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
//             <Loading />
//           </div>
//         ) : activityError ? (
//           <p className="text-center text-red-500 p-4">
//             ❌ เกิดข้อผิดพลาด: {activityError}
//           </p>
//         ) : enrolledActivities.length === 0 ? (
//           <p className="text-center text-gray-500 p-4">📍 ไม่พบกิจกรรม
//           </p>
//         ) : (
//           <Table title="" data={transformedActivities} />
//         )}
//     </CustomCard>
//   );
// };

// export default TableActivitySection;

// import React from "react";
// import { Typography } from "@mui/material";
// import Loading from "../../../../components/Loading";
// import CustomCard from "../../../../components/Card";
// import TableListRow from "./table_redesign"; // ✅ import ใหม่
// import { getActivityColumns } from "./activity_column"; // ✅ ปรับ path ให้ถูก
// import { MainActivity } from "../../../../types/Student/type_main_activity_student";

// interface TableActivitySectionProps {
//   activityLoading: boolean;
//   activityError: string | null;
//   enrolledActivities: MainActivity[];
//   transformedActivities: any[];
// }

// const TableActivitySection: React.FC<TableActivitySectionProps> = ({
//   activityLoading,
//   activityError,
//   enrolledActivities,
//   transformedActivities,
// }) => {
//   console.log("ตัวอย่างข้อมูล activity:", transformedActivities[0]);
//   const columns = getActivityColumns({
//     includeStatus: false,
//   }); // ✅ ปรับ options ได้ตามต้องการ

//   return (
//     <CustomCard className="mt-6 mx-auto" width="100%">
//       <Typography variant="h6" fontWeight="bold" gutterBottom>
//         ลิสต์กิจกรรมของฉัน
//       </Typography>

//       {activityLoading ? (
//         <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
//           <Loading />
//         </div>
//       ) : activityError ? (
//         <p className="text-center text-red-500 p-4">
//           ❌ เกิดข้อผิดพลาด: {activityError}
//         </p>
//       ) : enrolledActivities.length === 0 ? (
//         <p className="text-center text-gray-500 p-4">📍 ไม่พบกิจกรรม</p>
//       ) : (
//         <TableListRow
//           columns={columns}
//           rows={transformedActivities}
//           height={500}
//           width="100%"
//         />
//       )}
//     </CustomCard>
//   );
// };

// export default TableActivitySection;

import React, { useState } from "react";
import { Typography } from "@mui/material";
import Loading from "../../../../components/Loading";
import CustomCard from "../../../../components/Card";
import TableListRow from "./TableListRow";
import { getTableListColumn } from "./TableListColumn";
import { mapTransformedActivity } from "../util/mapTransformedActivity";
import { MainActivity } from "../../../../types/Student/type_main_activity_student";

interface TableActivitySectionProps {
  activityLoading: boolean;
  activityError: string | null;
  enrolledActivities: MainActivity[];
  transformedActivities: any[];
}

const TableActivitySection: React.FC<TableActivitySectionProps> = ({
  activityLoading,
  activityError,
  enrolledActivities,
}) => {
  // ✅ 1. กรองประเภทด้วย useState
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // ✅ 2. กรองกิจกรรมที่ยังไม่จบ + ตามประเภท
  const rows = enrolledActivities
    .filter((a) => a.ac_state === "Enrolled" || a.ac_state === "Not Start")
    .filter(
      (a) => selectedTypes.length === 0 || selectedTypes.includes(a.ac_type),
    )
    .map(mapTransformedActivity);

  // ✅ 3. เพิ่ม props เข้า columns
  const columns = getTableListColumn({
    enableTypeFilter: true,
    selectedTypes,
    handleTypeChange,
  });

  return (
    <CustomCard className="mt-6 mx-auto" width="100%">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ลิสต์กิจกรรมของฉัน
      </Typography>

      {activityLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
          <Loading />
        </div>
      ) : activityError ? (
        <p className="text-center text-red-500 p-4">
          ❌ เกิดข้อผิดพลาด: {activityError}
        </p>
      ) : enrolledActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">📍 ไม่พบกิจกรรม</p>
      ) : (
        <TableListRow columns={columns} rows={rows} />
      )}
    </CustomCard>
  );
};

export default TableActivitySection;
