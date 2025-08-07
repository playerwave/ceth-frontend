import React, { useEffect, useState } from "react";
import Searchbar from "./components/Searchbar";
import FoodTable from "./components/foodtable";
import AddFoodButton from "./components/addfoodbutton";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import Loading from "../../../../components/Loading";

const ListFoodAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { foods, fetchFoods, searchResults, foodLoading, foodError, refreshData } = useFoodStore();
  
  const displayedFoods = searchResults ?? foods;

  useEffect(() => {
    // ✅ ดึงข้อมูลมาใหม่ทุกครั้ง
    refreshData();
  }, [refreshData]);

  // ✅ เพิ่มการ refresh เมื่อกลับมาหน้า
  useEffect(() => {
    const handleFocus = () => {
      // เมื่อกลับมาหน้า ให้ refresh ข้อมูล
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshData]);

  const filteredFoods = foods.filter((f) =>
    f.food_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Loading component
  if (foodLoading) {
    return <Loading />;
  }

  // ✅ Error component
  if (foodError) {
    return (
      <div className="max-w-screen-xl w-full mx-auto px-6 mt-5 relative">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">เกิดข้อผิดพลาด</p>
            <p>{foodError}</p>
            <button 
              onClick={refreshData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการอาหาร</h1>

      <div className="flex justify-center items-center w-full mt-10">
        <Searchbar onSearch={(term) => setSearchTerm(term)} />
      </div>

      <AddFoodButton />

      <div className="bg-white p-6 shadow-2xl rounded-lg my-10 overflow-x-auto">
        <h2 className="text-left font-semibold text-black mb-4">
          อาหารที่มีอยู่ในระบบ
        </h2>
        <div style={{ height: 400 }}>
          <FoodTable data={filteredFoods} />
        </div>
      </div>
    </div>
  );

};

export default ListFoodAdmin;
