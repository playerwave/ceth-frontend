import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Searchbar from '../../../../components/Searchbar';
import { CopyPlus } from 'lucide-react';

const ListFoodAdmin = () => {
  const navigate = useNavigate();

  const foodData = Array.from({ length: 15 }, (_, i) => ({
    name: `เมนูที่ ${i + 1}`,
    price: `${50 } บาท / กล่อง`,
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



      <div className="justify-end flex mr-33 mt-7">
        <button
          onClick={() => navigate('/create-food')}
          className="ml-4 px-4 py-2 bg-blue-800 text-white font-medium rounded-xl hover:bg-blue-900 w-39 gap-7 flex"
        >
          เพิ่มอาหาร
          <CopyPlus />
        </button>
      </div>



      <div className="bg-white p-4 shadow-2xl rounded-lg mb-6 mt-10 h-120">
        <h2 className="text-left font-semibold text-black p-3 rounded">
          อาหารที่มีอยู่ในระบบ
        </h2>


        <table className="w-full mt-2 border-collapse table-fixed">
          <thead className="bg-blue-900 text-white h-13">
            <tr className="border-t text-center">
              <th className="p-2 text-center ">ชื่อเมนู</th>
              <th className="p-2 text-center ">ราคา</th> {/* ✅ เพิ่ม pl-4 */}
              <th className="p-2 text-center">เบอร์ติดต่อ</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {paginatedData.map((food, i) => (
              <tr
                key={i}
                className="border-t text-center cursor-pointer hover:bg-gray-200 transition"
                onClick={() => navigate('/edit-food')}
              >
                <td className="p-3  text-center truncate">{food.name}</td>
                <td className="p-3 text-center ">{food.price}</td> {/* ✅ เพิ่ม pl-4 */}
                <td className="p-3 text-center">{food.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>




        {/* ✅ Pagination จริง */}
        <div className="flex justify-center items-center gap-2 p-5 mt-5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded border hover:bg-gray-200"
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-800 text-white' : ''
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded border hover:bg-gray-200"
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListFoodAdmin;
