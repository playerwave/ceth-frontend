import React, { useEffect, useState } from "react";
import Searchbar from "./components/Searchbar";
import FoodTable from "./components/foodtable";
import AddFoodButton from "./components/addfoodbutton";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";

const ListFoodAdmin = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const { foods, fetchFoods, searchResults } = useFoodStore();
  const displayedFoods = searchResults ?? foods;
  useEffect(() => {
    fetchFoods(); // โหลดข้อมูลอาหารจาก API
  }, []);

  const filteredFoods = foods.filter((f) =>
    f.food_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ใน ListFoodAdmin

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการอาหาร</h1>

      <div className="flex justify-center items-center w-full mt-10">
        <Searchbar onSearch={(term) => setSearchTerm(term)} />
      </div>

      <AddFoodButton />
      <div className="bg-white p-4 shadow-2xl rounded-lg mb-6 mt-10 h-120">
        <h2 className="text-left font-semibold text-black p-3 rounded">
          อาหารที่มีอยู่ในระบบ
        </h2>

        {/* ใช้ DataGrid Pagination ใน FoodTable เลย */}

        <FoodTable data={filteredFoods} />
      </div>
    </div>
  );
};

export default ListFoodAdmin;
