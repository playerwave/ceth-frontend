import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "../../../../../components/Card";
import { Loader2 } from "lucide-react";
import { useActivityReportStore } from "../../../../../stores/Teacher/activity-report.store";

export default function EnrolledmentDataCard() {
  const { id: activityId } = useParams<{ id: string }>();
  const { 
    participationData, 
    participationLoading, 
    participationError, 
    fetchParticipationStatus,
    clearParticipationError 
  } = useActivityReportStore();

  useEffect(() => {
    if (activityId) {
      fetchParticipationStatus(activityId);
    }
  }, [activityId, fetchParticipationStatus]);

  // แสดง loading state
  if (participationLoading) {
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
  if (participationError) {
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
            <div className="text-gray-600 mb-4">{participationError}</div>
            <button 
              onClick={() => {
                clearParticipationError();
                if (activityId) {
                  fetchParticipationStatus(activityId);
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
  const participationItems = participationData?.participationData || [];
  const studentStatusItems = participationData?.studentStatusData || [];
  const totalRegistered = participationData?.totalRegistered || 0;
  const registeredInfo = participationData?.registeredInfo;

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
      {/* การเข้าร่วมกิจกรรมของนิสิต */}
      <div className="mb-6">
        <div className="relative mb-4">
          <h2 className="font-bold text-lg pr-12 leading-snug">
            การเข้าร่วมกิจกรรมของนิสิต
          </h2>
        </div>

        {/* แสดงข้อมูลผู้ลงทะเบียน */}
        {registeredInfo && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{registeredInfo.label}</span>
              <span className="text-sm font-bold text-gray-900">
                {registeredInfo.count} คน ({registeredInfo.percent})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300 bg-purple-400"
                style={{
                  width: registeredInfo.percent,
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {participationItems.map((item, index) => {
            let bgColor = "bg-gray-400";
            if (item.label === "เข้าเต็มเวลา") {
              bgColor = "bg-green-400";
            } else if (item.label === "เข้าไม่เต็มเวลา") {
              bgColor = "bg-yellow-200";
            } else if (item.label === "ไม่ได้เข้าร่วม") {
              bgColor = "bg-red-400";
            }
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.count} คน ({item.percent})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
                    style={{
                      width: item.percent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          จากที่เปิดรับ {totalRegistered} คน
        </div>
      </div>

      {/* สถานะนิสิต */}
      <div>
        <div className="relative mb-4">
          <h2 className="font-bold text-lg pr-12 leading-snug">
            สถานะนิสิต
          </h2>
        </div>

        <div className="space-y-4">
          {studentStatusItems.map((item, index) => {
            let bgColor = "bg-gray-400";
            if (item.label === "Normal") {
              bgColor = "bg-green-400";
            } else if (item.label === "Risk") {
              bgColor = "bg-red-400";
            }
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.count} คน ({item.percent})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
                    style={{
                      width: item.percent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          จากผู้เข้าร่วมเต็มเวลาทั้งหมด {participationData?.fullTimeAttendance || 0} คน (100.0%)
        </div>
      </div>
    </CustomCard>
  );
}