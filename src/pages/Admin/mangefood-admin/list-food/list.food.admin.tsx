import React, { useState } from "react";
import Searchbar from "../../../../components/Searchbar";
import FoodTable from "./components/foodtable";
import Pagination from "./components/pagination";
import AddFoodButton from "./components/addfoodbutton";
import { useNavigate } from "react-router-dom";

const ListFoodAdmin = () => {


  const foodData = Array.from({ length: 15 }, (_, i) => ({
    name: `เมนูที่ ${i + 1}`,
    price: `50 บาท / กล่อง`,
    phone: `091-234-56${(i + 10).toString().slice(-2)}`,
  }));

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(foodData.length / itemsPerPage);
  const paginatedData = foodData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการอาหาร</h1>

      <div className="flex justify-center items-center w-full mt-10">
        <Searchbar />
      </div>

      <AddFoodButton />

      <div className="bg-white p-4 shadow-2xl rounded-lg mb-6 mt-10 h-120">
        <h2 className="text-left font-semibold text-black p-3 rounded">
          อาหารที่มีอยู่ในระบบ
        </h2>

        <FoodTable data={paginatedData} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListFoodAdmin;
