import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Activity } from "../../../../types/model";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Building, FileText } from "lucide-react";
import CustomCard from "../../../../components/Card";

const ActivityHistoryInfoTeacher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, fetchRooms } = useRoomStore();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // รับข้อมูล activity จาก state ที่ส่งมาจากการ navigate
    if (location.state?.activity) {
      setActivity(location.state.activity);
    } else {
      // ถ้าไม่มี state ให้กลับไปหน้าลิสต์
      navigate("/list-activity-history-teacher");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (rooms.length === 0) {
      fetchRooms();
    }
  }, [rooms.length, fetchRooms]);

  const room = rooms.find((r: any) => r.room_id === activity?.room_id);

  const formatDate = (dateInput?: string | Date | null) => {
    if (!dateInput) return "ไม่ระบุ";
    const date = new Date(dateInput);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateInput?: string | Date | null) => {
    if (!dateInput) return "ไม่ระบุ";
    const date = new Date(dateInput);
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hours}:${minutes}`;
  };

  const formatRoomDisplay = (room?: { room_name?: string; floor?: string }) => {
    if (!room) return "ไม่ระบุห้อง";
    return `ชั้น ${room.floor ?? "-"} ห้อง ${room.room_name}`;
  };

  const getEventFormatIcon = (format: string) => {
    switch (format) {
      case "Onsite":
        return <Building className="w-5 h-5" />;
      case "Online":
        return <Users className="w-5 h-5" />;
      case "Course":
        return <FileText className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getEventFormatLabel = (format: string) => {
    switch (format) {
      case "Onsite":
        return "กิจกรรมในสถานที่";
      case "Online":
        return "กิจกรรมออนไลน์";
      case "Course":
        return "หลักสูตร";
      default:
        return format;
    }
  };

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-10 mt-10">
      <div className="w-full max-w-screen-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/list-activity-history-teacher")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับ
          </button>
          <h1 className="text-3xl font-bold text-gray-800">รายละเอียดกิจกรรม</h1>
        </div>

        {/* Activity Image */}
        {activity.image_url && (
          <CustomCard height={300} width="100%" className="mb-6">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={typeof activity.image_url === 'string' ? activity.image_url : undefined}
                alt={activity.activity_name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </CustomCard>
        )}

        {/* Activity Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <CustomCard height="auto" width="100%">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">ข้อมูลพื้นฐาน</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-700">{activity.activity_name}</h3>
                    <p className="text-gray-600 mt-1">{activity.presenter_company_name}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: activity.type === "Hard" ? "rgba(255, 174, 0, 0.2)" : "rgba(9, 0, 255, 0.2)",
                        color: activity.type === "Hard" ? "#FFAE00" : "#0900FF",
                      }}
                    >
                      {activity.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600">
                      {getEventFormatIcon(activity.event_format)}
                      <span className="text-sm">{getEventFormatLabel(activity.event_format)}</span>
                    </div>
                  </div>

                  {activity.description && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">คำอธิบาย</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </CustomCard>

            {/* Time Information */}
            <CustomCard height="auto" width="100%">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">ข้อมูลเวลา</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-700">วันที่จัดกิจกรรม</p>
                      <p className="text-gray-600">{formatDate(activity.start_activity_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-700">เวลาเริ่มต้น</p>
                      <p className="text-gray-600">{formatTime(activity.start_activity_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-700">เวลาสิ้นสุด</p>
                      <p className="text-gray-600">{formatTime(activity.end_activity_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CustomCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Location Information */}
            <CustomCard height="auto" width="100%">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">ข้อมูลสถานที่</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-700">สถานที่</p>
                      <p className="text-gray-600">
                        {activity.event_format === "Onsite" 
                          ? formatRoomDisplay(room)
                          : "ไม่มีห้องสำหรับกิจกรรมนี้"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-700">รูปแบบกิจกรรม</p>
                      <p className="text-gray-600">{getEventFormatLabel(activity.event_format)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CustomCard>

            {/* Registration Information */}
            <CustomCard height="auto" width="100%">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">ข้อมูลการลงทะเบียน</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-700">เปิดลงทะเบียน</p>
                      <p className="text-gray-600">{formatDate(activity.start_register_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-700">ปิดลงทะเบียน</p>
                      <p className="text-gray-600">{formatDate(activity.end_register_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CustomCard>

            {/* Activity Status */}
            <CustomCard height="auto" width="100%">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">สถานะกิจกรรม</h2>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">กิจกรรมสิ้นสุดแล้ว</span>
                </div>
              </div>
            </CustomCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryInfoTeacher;
