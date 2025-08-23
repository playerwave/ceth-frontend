import React from 'react';
import { useSecureParams, extractSecureParam, hasSecureParam } from '../routes/secure/SecureRoute';
import { EncryptedLink } from '../components/SecureLink';

// 📋 Interface สำหรับข้อมูลกิจกรรม
interface ActivityData {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}

// 🔧 คอมโพเนนต์ที่ใช้ secure params แบบ type-safe
export const ActivityInfoComponent: React.FC = () => {
  const params = useSecureParams();
  
  // ใช้ utility functions แบบ type-safe
  const activityId = extractSecureParam(params, 'id', 0);
  const activityName = extractSecureParam(params, 'name', '');
  const activityType = extractSecureParam(params, 'type', '');
  const isActive = extractSecureParam(params, 'isActive', false);
  
  // ตรวจสอบว่ามี parameter หรือไม่
  const hasUserId = hasSecureParam(params, 'userId');
  const userId = hasUserId ? extractSecureParam(params, 'userId', 0) : null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ข้อมูลกิจกรรม</h1>
      
      <div className="space-y-2">
        <p><strong>ID:</strong> {activityId}</p>
        <p><strong>ชื่อ:</strong> {activityName}</p>
        <p><strong>ประเภท:</strong> {activityType}</p>
        <p><strong>สถานะ:</strong> {isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
        {hasUserId && <p><strong>User ID:</strong> {userId}</p>}
      </div>
    </div>
  );
};

// 🔧 คอมโพเนนต์ที่รับ secureParams เป็น prop
interface ActivityDetailProps {
  secureParams: {
    [key: string]: string | number | boolean | null | undefined;
  };
}

export const ActivityDetailComponent: React.FC<ActivityDetailProps> = ({ secureParams }) => {
  // ใช้ utility functions แบบ type-safe
  // const activityId = extractSecureParam(secureParams, 'id', 0);
  const activityName = extractSecureParam(secureParams, 'name', '');
  // const activityId = extractSecureParam(secureParams, 'id', 0);
  // const activityId = extractSecureParam(secureParams, 'id', 0);
  // const activityId = extractSecureParam(secureParams, 'id', 0);
  // const activityId = extractSecureParam(secureParams, 'id', 0);
  
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold">รายละเอียดกิจกรรม</h2>
      {/* <p>ID: {activityId}</p> */}
      <p>ชื่อ: {activityName}</p>
    </div>
  );
};

// 🔧 ตัวอย่างการใช้งานในคอมโพเนนต์อื่น
export const ActivityListComponent: React.FC = () => {
  const activities: ActivityData[] = [
    { id: 1, name: "กิจกรรมสหกิจศึกษา", type: "internship", isActive: true },
    { id: 2, name: "กิจกรรมฝึกงาน", type: "training", isActive: false },
    { id: 3, name: "กิจกรรมวิจัย", type: "research", isActive: true }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">รายการกิจกรรม</h1>
      
      {activities.map((activity) => (
        <div key={activity.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{activity.name}</h3>
          <p className="text-gray-600">ประเภท: {activity.type}</p>
          <p className="text-gray-600">สถานะ: {activity.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
          
          {/* ลิงก์ที่เข้ารหัสแบบ type-safe */}
          <EncryptedLink 
            to="/activity-info-admin" 
            params={{
              id: activity.id,
              name: activity.name,
              type: activity.type,
              isActive: activity.isActive,
              timestamp: Date.now()
            }}
            className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
          >
            ดูรายละเอียด
          </EncryptedLink>
        </div>
      ))}
    </div>
  );
};

// 🔧 ตัวอย่างการใช้งานกับ form
export const ActivityFormComponent: React.FC = () => {
  const params = useSecureParams();
  
  // ดึงข้อมูลจาก URL parameters แบบ type-safe
  const editMode = hasSecureParam(params, 'id');
  // const activityId = editMode ? extractSecureParam(params, 'id', 0) : 0;
  const activityName = editMode ? extractSecureParam(params, 'name', '') : '';
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {editMode ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่'}
      </h1>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม</label>
          <input 
            type="text" 
            defaultValue={activityName}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">ประเภท</label>
          <select className="w-full p-2 border rounded">
            <option value="internship">สหกิจศึกษา</option>
            <option value="training">ฝึกงาน</option>
            <option value="research">วิจัย</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editMode ? 'อัปเดต' : 'สร้าง'}
        </button>
      </form>
    </div>
  );
}; 