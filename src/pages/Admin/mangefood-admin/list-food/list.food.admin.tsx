import React, { useState } from "react";
import Searchbar from "../list-food/components/Searchbar";
import FoodTable from "./components/foodtable";
import AddFoodButton from "./components/addfoodbutton";

const ListFoodAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const foodData = Array.from({ length: 15 }, (_, i) => ({
    name: `เมนูที่ ${i + 1}`,
    price: 50 + (i * 5), // ตัวเลขราคา (เช่น 50, 55, 60 ...)
    phone: `091-234-56${(i + 10).toString().slice(-2)}`,
  }));


  // กรองข้อมูลก่อนส่งให้ DataGrid
  const filteredFoods = foodData.filter((food) => {
    const matchName = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMinPrice = minPrice === "" || food.price >= minPrice;
    const matchMaxPrice = maxPrice === "" || food.price <= maxPrice;
    return matchName && matchMinPrice && matchMaxPrice;
  });


  // ใน ListFoodAdmin


  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการอาหาร</h1>

      <div className="flex justify-center items-center w-full mt-10">
        <Searchbar
          onSearch={(term) => {
            setSearchTerm(term);
          }}
        />
      </div>

      <AddFoodButton
        onFilterPrice={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
      />
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