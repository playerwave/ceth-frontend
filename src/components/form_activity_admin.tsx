import React, { useState } from "react";
import { FormData } from "./Form/formdata";
import ActivityDetails from "./Form/activity_details";
import EventSchedule from "./Form/date";
import RoomSelection from "./Form/room_selection";
import StatusAndSeats from "./Form/status_and_seats";
import FoodSelection from "./Form/food_selection";
import EvaluationSelection from "./Form/evaluation_seletion";
import FileUpload from "./Form/file_upload";
import FormButtons from "./Form/form_button";
import CategorySelection from "./Form/category_selection"; 


const FormActivityAdmin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    activityName: "",
    companyOrSpeaker: "",
    description: "",
    category: "Soft Skill",
    roomFloor: "",
    roomNumber: "",
    status: "Private",
    seats: "0",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    foodOptions: ["เมนู 1", "เมนู 2"],
    selectedFoods: [],
    evaluationType: "แบบประเมิน 1",
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ แยกฟังก์ชันเลือก/ยกเลิกเมนูอาหาร
  const toggleFoodSelection = (food: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFoods: prev.selectedFoods.includes(food)
        ? prev.selectedFoods.filter(item => item !== food) // เอาออกถ้าซ้ำ
        : [...prev.selectedFoods, food], // เพิ่มเข้าไปถ้ายังไม่ได้เลือก
    }));
  };

  const addFoodOption = () => {
    setFormData(prev => ({
      ...prev,
      foodOptions: [...prev.foodOptions, `เมนู ${prev.foodOptions.length + 1}`],
    }));
  };

  const updateFoodOption = (index: number, newValue: string) => {
    const updatedFoodOptions = [...formData.foodOptions];
    updatedFoodOptions[index] = newValue;
    setFormData(prev => ({ ...prev, foodOptions: updatedFoodOptions }));
  };

  const removeFoodOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foodOptions: formData.foodOptions.filter((_, i) => i !== index),
    }));
  };
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // แปลงค่า seats เป็น number ก่อนใช้งาน
    const numericSeats = formData.seats === "" ? 0 : parseInt(formData.seats, 10);

    console.log("Form Submitted", { ...formData, seats: numericSeats });
  };
  return (
    <div className="w-350 mx-auto ml-2xl mt-5 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-4xl font-bold mb-11">สร้างกิจกรรมสหกิจ</h1>
      <form onSubmit={handleSubmit} className="space-y-4 ">


        {/* ✅ แยกเป็น Component */}  
        <div className="flex space-x-6">
          <ActivityDetails formData={formData} handleChange={handleChange} />
          <EventSchedule formData={formData} handleChange={handleChange} />
        </div>
        <CategorySelection formData={formData} handleChange={handleChange} />
        <RoomSelection formData={formData} handleChange={handleChange} />
        <StatusAndSeats formData={formData} handleChange={handleChange} />

        <FoodSelection
          formData={formData}
          handleChange={toggleFoodSelection} // ✅ ส่ง toggleFoodSelection ที่แก้ไขแล้ว
          addFoodOption={addFoodOption}
          updateFoodOption={updateFoodOption}
          removeFoodOption={removeFoodOption}
        />

        <EvaluationSelection formData={formData} handleChange={handleChange} />
        <FileUpload formData={formData} setFormData={setFormData} />
        <FormButtons />

      </form>
    </div>
  );
};

export default FormActivityAdmin;
