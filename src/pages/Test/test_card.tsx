import React from "react";
import CustomCard from "../../components/Card";

const TestCardPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4">ทดสอบ CustomCard</h1>

      <CustomCard width="400px" height="200px">
        <p>การ์ดนี้กว้าง 400px สูง 200px</p>
      </CustomCard>

      <CustomCard width="100%" height="250px" className="bg-blue-50">
        <p>การ์ดนี้กว้างเต็มจอ สูง 250px พร้อมพื้นหลังฟ้าอ่อน</p>
      </CustomCard>

      <CustomCard width="60%" height="300px" className="shadow-lg">
        <p>การ์ดนี้กว้าง 60% สูง 300px พร้อมเงา</p>
      </CustomCard>
    </div>
  );
};

export default TestCardPage;
