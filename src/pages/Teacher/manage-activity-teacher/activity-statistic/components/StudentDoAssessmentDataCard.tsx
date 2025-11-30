import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "@components/Card";
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
        <div>
          {/* ✅ แสดง totalText ด้านบน */}
          {totalText && (
            <div className="mb-4 text-sm text-gray-500">
              {totalText}
            </div>
          )}

          {/* ✅ Title */}
          <div className="relative mb-4">
            <h2 className="font-bold text-lg pr-12 leading-snug">
              การทำแบบประเมินของนิสิต
            </h2>
          </div>

          {/* ✅ Progress bars */}
          <div className="space-y-4">
            {evaluationStatusData.map((item, index) => {
              let bgColor = "bg-gray-400";
              // ✅ กำหนดสีตาม label
              if (item.label === "ทำแบบประเมินแล้ว") {
                bgColor = "bg-green-400";
              } else if (item.label === "ยังไม่ทำแบบประเมิน") {
                bgColor = "bg-red-400";
              }
              
              // ✅ คำนวณเปอร์เซ็นต์
              const percent = item.total > 0 
                ? `${Math.round((item.count / item.total) * 100)}%`
                : "0%";
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.count} คน ({percent})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
                      style={{
                        width: percent,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">ไม่มีข้อมูลการทำแบบประเมิน</p>
        </div>
      )}
    </CustomCard>
  );
}
