import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "@components/Card";
import { Loader2 } from "lucide-react";
import BarChartY from "@components/Charts/BarChartY";
import { useActivityReportStore } from "@stores/Teacher/activity-report.store";

export default function EnrolledByDepartmentCard() {
  const { id: activityId } = useParams<{ id: string }>();
  const { 
    enrollmentData, 
    enrollmentLoading, 
    enrollmentError, 
    fetchEnrollmentByDepartment,
    clearEnrollmentError 
  } = useActivityReportStore();

  useEffect(() => {
    if (activityId) {
      fetchEnrollmentByDepartment(activityId);
    }
  }, [activityId, fetchEnrollmentByDepartment]);

  // แสดง loading state
  if (enrollmentLoading) {
    return (
      <CustomCard
        className="w-full
                  max-w-[90vw]       
                  sm:max-w-[600px]     
                  md:max-w-[700px]    
                  lg:max-w-full
                  p-4 sm:p-6
                  relative
                  mx-0
                  self-start
                  h-full"
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </CustomCard>
    );
  }

  // แสดง error state
  if (enrollmentError) {
    return (
      <CustomCard
        className="w-full
                  max-w-[90vw]       
                  sm:max-w-[600px]     
                  md:max-w-[700px]    
                  lg:max-w-full
                  p-4 sm:p-6
                  relative
                  mx-0
                  self-start
                  h-full"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">เกิดข้อผิดพลาด</div>
            <div className="text-gray-600 mb-4">{enrollmentError}</div>
            <button 
              onClick={() => {
                clearEnrollmentError();
                if (activityId) {
                  fetchEnrollmentByDepartment(activityId);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </CustomCard>
    );
  }

  // ใช้ข้อมูลจริงจาก API หรือ fallback data
  const barData = enrollmentData?.departments || [];
  const barLegend = enrollmentData?.legend || [];
  const totalText = enrollmentData?.totalText || "ไม่มีข้อมูล";

  // ✅ จัดเตรียมสีสำหรับกราฟ (ใช้จาก legend เพื่อให้ตรงกับวงกลม)
  const defaultColors = ["#6659FF", "#404CCC", "#89AFFF", "#D9D9D9"];
  const chartColors = barLegend.length > 0
    ? barLegend.map((item, idx) => item.color || defaultColors[idx] || "#9CA3AF")
    : defaultColors;
  
  return (
    <CustomCard
      className="w-full
                max-w-[90vw]       
                sm:max-w-[600px]     
                md:max-w-[700px]    
                lg:max-w-full
                p-4 sm:p-6
                relative
                mx-0
                self-start
                h-full"
    >
      <div className="relative mb-6">
        <h2 className="font-bold text-xl pr-12 leading-snug">
          จำนวนนิสิตที่ลงทะเบียนแยกตามสาขาและชั้นปี
        </h2>
      </div>

      {barData.length > 0 ? (
        <BarChartY 
          data={barData}
          legend={barLegend}
          stackKeys={["year1", "year2", "year3", "year4"]}
          colors={chartColors}
          height={400}
          barSize={40}
          showLegend={true}
          legendPosition="right"
          totalText={totalText}
        />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">ไม่มีข้อมูลการลงทะเบียน</p>
        </div>
      )}
    </CustomCard>
  );
}
