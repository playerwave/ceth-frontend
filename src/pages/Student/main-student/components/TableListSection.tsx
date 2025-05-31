import React from "react";
import { Card, Typography } from "@mui/material";
import Table from "../../../../components/Student/table";
import Loading from "../../../../components/Loading";
import { MainActivity } from "../../../../types/Student/type_main_activity_student";
import CustomCard from "../../../../components/Card";

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
          <p className="text-center text-gray-500 p-4">📍 ไม่พบกิจกรรม
          </p>
        ) : (
          <Table title="" data={transformedActivities} />
        )}
    </CustomCard>
  );
};

export default TableActivitySection;
