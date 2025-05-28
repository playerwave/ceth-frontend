import React from "react";
import { Card } from "@mui/material";
import Table from "../../../../components/Student/table";
import Loading from "../../../../components/Loading";
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
  transformedActivities,
}) => {
  return (
    <div className="flex justify-center mt-4 lg:mt-6">
      <Card
        sx={{
          p: 5,
          width: "95%",
          maxWidth: "1310px",
          height: "auto",
          minHeight: "500px",
          boxShadow: 10,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
        className="ml-4 mt-5"
      >
        <h1 className="text-xl font-semibold">ลิสต์กิจกรรมของฉัน</h1>

        {activityLoading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
            <Loading />
          </div>
        ) : activityError ? (
          <p className="text-center text-red-500 p-4">
            ❌ เกิดข้อผิดพลาด: {activityError}
          </p>
        ) : enrolledActivities.length === 0 ? (
          <p className="text-center text-gray-500 p-4">📍 ไม่พบกิจกรรม
          </p>
        ) : (
          <Table title="" data={transformedActivities} />
        )}
      </Card>
    </div>
  );
};

export default TableActivitySection;
