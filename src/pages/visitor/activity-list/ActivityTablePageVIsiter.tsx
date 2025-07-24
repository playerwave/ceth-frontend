// src/pages/ActivityTablePageVisitor.tsx

import { useMemo } from "react";
import TableRedesign from "../../../components/Table_re";
import CustomCard from "../../../components/Card";
import { Activity } from "../../../types/model"; // นำเข้า Activity Type ที่ถูกต้องของคุณ
import { GridColDef } from "@mui/x-data-grid";
import { getActivityColumns } from "../../../components/activity_column"; // <<< ตรวจสอบเส้นทางให้ถูกต้อง

type Props = {
  rows1: Activity[]; // ต้องเป็น Activity[]
};

const ActivityTablePageVisitor = ({ rows1 }: Props) => {
  const activityColumns: GridColDef<Activity>[] = useMemo(
    () =>
      getActivityColumns({
        // คุณสามารถส่ง options ที่นี่ได้ เช่น
        // includeStatus: true, // หากต้องการให้คอลัมน์สถานะแสดง
        // enableTypeFilter: true, // หากต้องการให้มี checkbox ใน header ของประเภท
      }),
    [] // dependency array (สามารถเพิ่ม state ที่เกี่ยวข้องกับการกรอง/คอลัมน์ได้)
  );

  return (
    <div style={{ padding: 24 }}>
      <CustomCard height={1250} width="100%">
        <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจ</h2>
        <TableRedesign
          initialPageSize={20}
          columns={activityColumns} // ใช้ columns ที่ได้จาก getActivityColumns
          rows={rows1 ?? []}
          height={1170}
          width="100%"
          borderRadius={14}
          // getRowId={(row) => row.activity_id} // row ตอนนี้คือ Activity type
        />
      </CustomCard>
    </div>
  );
};

export default ActivityTablePageVisitor;
