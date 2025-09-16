import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "@components/Card";
import BarChartX from "@components/Charts/BarChartX";
import { useActivityReportStore } from "@stores/Teacher/activity-report.store";

export default function StudentDoAssessmentDataCard() {
  const { id } = useParams<{ id: string }>();
  const { 
    studentAssessmentStatusData, 
    studentAssessmentStatusLoading, 
    studentAssessmentStatusError, 
    fetchStudentAssessmentStatus,
    clearStudentAssessmentStatusError 
  } = useActivityReportStore();

  useEffect(() => {
    if (id) {
      fetchStudentAssessmentStatus(id);
    }
  }, [id, fetchStudentAssessmentStatus]);

  // แสดง loading state
  if (studentAssessmentStatusLoading) {
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
          <p className="text-blue-600">กำลังโหลดข้อมูล...</p>
        </div>
      </CustomCard>
    );
  }

  // แสดง error state
  if (studentAssessmentStatusError) {
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
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded">
            {studentAssessmentStatusError}
            <button 
              onClick={clearStudentAssessmentStatusError}
              className="ml-2 text-red-800 underline"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </CustomCard>
    );
  }

  // แสดงข้อมูลจริง
  const evaluationStatusData = studentAssessmentStatusData?.evaluationStatusData || [];
  const totalText = studentAssessmentStatusData?.totalText || "ไม่มีข้อมูล";

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
      {evaluationStatusData.length > 0 ? (
        <BarChartX 
          data={evaluationStatusData}
          title="การทำแบบประเมินของนิสิต"
          totalText={totalText}
          labelWidth="w-[120px]"
          useTailwindColors={true}
        />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">ไม่มีข้อมูลการทำแบบประเมิน</p>
        </div>
      )}
    </CustomCard>
  );
}
