import React from 'react';
import { useSecureParams, useSecureLink } from '../components/SecureRoute';
import { SecureLink, EncodedLink, EncryptedLink, NormalLink } from '../components/SecureLink';
import { ProtectionLevel } from '../utils/urlEncryption';

// 📝 ตัวอย่างการใช้งานระบบ URL ที่เข้ารหัส
export const SecureURLExample: React.FC = () => {
  // 🔍 ดึงพารามิเตอร์ที่เข้ารหัสจาก URL
  const secureParams = useSecureParams();
  
  // 🔗 สร้างลิงก์ที่เข้ารหัส
  const { createSecureLink, navigateToSecure } = useSecureLink();

  // 📋 ตัวอย่างข้อมูล
  const activityData = {
    id: 123,
    name: "กิจกรรมสหกิจศึกษา",
    type: "internship",
    userId: 456
  };

  const sensitiveData = {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    userId: 789,
    permissions: ["read", "write", "admin"]
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔐 ตัวอย่างการใช้งาน URL ที่เข้ารหัส</h1>
      
      {/* 📊 แสดงพารามิเตอร์ที่ดึงมาจาก URL */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">📊 พารามิเตอร์จาก URL:</h2>
        <pre className="bg-white p-3 rounded text-sm overflow-auto">
          {JSON.stringify(secureParams, null, 2)}
        </pre>
      </div>

      {/* 🔗 ตัวอย่างลิงก์ต่างๆ */}
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🔗 ลิงก์ปกติ (ไม่เข้ารหัส)</h3>
          <NormalLink 
            to="/activity-info-admin" 
            params={{ id: 123 }}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ดูข้อมูลกิจกรรม (ไม่เข้ารหัส)
          </NormalLink>
          <p className="text-sm text-gray-600 mt-2">
            URL: {createSecureLink("/activity-info-admin", { id: 123 }, ProtectionLevel.NONE)}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🔗 ลิงก์ที่เข้ารหัสแบบง่าย</h3>
          <EncodedLink 
            to="/create-activity-admin" 
            params={activityData}
            className="text-yellow-600 hover:text-yellow-800 underline"
          >
            สร้างกิจกรรม (เข้ารหัสแบบง่าย)
          </EncodedLink>
          <p className="text-sm text-gray-600 mt-2">
            URL: {createSecureLink("/create-activity-admin", activityData, ProtectionLevel.ENCODED)}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🔗 ลิงก์ที่เข้ารหัสแบบเต็ม</h3>
          <EncryptedLink 
            to="/update-activity-admin" 
            params={sensitiveData}
            className="text-red-600 hover:text-red-800 underline"
          >
            แก้ไขกิจกรรม (เข้ารหัสแบบเต็ม)
          </EncryptedLink>
          <p className="text-sm text-gray-600 mt-2">
            URL: {createSecureLink("/update-activity-admin", sensitiveData, ProtectionLevel.ENCRYPTED)}
          </p>
        </div>
      </div>

      {/* 🔧 ตัวอย่างการใช้งาน Hook */}
      <div className="bg-green-50 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-3">🔧 การใช้งาน Hook</h3>
        <div className="space-y-2">
          <button 
            onClick={() => navigateToSecure("/activity-info-admin", { id: 123 }, ProtectionLevel.ENCRYPTED)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            ไปยังข้อมูลกิจกรรม (เข้ารหัส)
          </button>
          
          <button 
            onClick={() => navigateToSecure("/create-activity-admin", activityData, ProtectionLevel.ENCODED)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
          >
            สร้างกิจกรรม (เข้ารหัสแบบง่าย)
          </button>
        </div>
      </div>

      {/* 📝 คำอธิบาย */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-3">📝 คำอธิบายระดับการป้องกัน</h3>
        <ul className="space-y-2 text-sm">
          <li><strong>ไม่เข้ารหัส (NONE):</strong> ใช้สำหรับหน้าทั่วไปที่ไม่มีความสำคัญ</li>
          <li><strong>เข้ารหัสแบบง่าย (ENCODED):</strong> ใช้สำหรับข้อมูลที่ไม่สำคัญมาก แต่ต้องการซ่อน</li>
          <li><strong>เข้ารหัสแบบเต็ม (ENCRYPTED):</strong> ใช้สำหรับข้อมูลสำคัญ เช่น token, ID, ข้อมูลส่วนตัว</li>
        </ul>
      </div>
    </div>
  );
};

// 🔧 ตัวอย่างการใช้งานในคอมโพเนนต์อื่น
export const ActivityCard: React.FC<{ activity: any }> = ({ activity }) => {
  const { createSecureLink } = useSecureLink();

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold">{activity.name}</h3>
      <p className="text-gray-600">{activity.description}</p>
      
      {/* ลิงก์ที่เข้ารหัสสำหรับดูรายละเอียด */}
      <EncryptedLink 
        to="/activity-info-admin" 
        params={{ 
          id: activity.id, 
          userId: activity.userId,
          timestamp: Date.now()
        }}
        className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
      >
        ดูรายละเอียด
      </EncryptedLink>
    </div>
  );
}; 