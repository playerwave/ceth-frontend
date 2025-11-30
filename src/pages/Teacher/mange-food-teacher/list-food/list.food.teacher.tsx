import { useEffect, useState, useRef } from "react";
import * as React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import FoodTable from "./components/foodtable";
import AddFoodButton from "./components/addfoodbutton";
import { useFoodStore } from "@/stores/Teacher/food.store.teacher";
import Loading from "@/components/Loading";
import Searchbar from "@/components/Searchbar";

const ListFoodAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // ✅ เพิ่ม state เพื่อ force re-render
  const { foods , foodLoading, foodError, refreshData, invalidateCache } = useFoodStore();
  const location = useLocation(); // ✅ ใช้ location เพื่อ detect navigation
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ ใช้ searchParams เพื่อ detect refresh query
  const prevFoodsRef = useRef<string>(''); // ✅ เก็บ hash ของ foods เก่า

  // ✅ Create unique key from foods data เพื่อ force re-render เมื่อข้อมูลเปลี่ยน
  const tableKey = React.useMemo(() => {
    const foodsHash = foods.map(f => `${f.food_id}-${f.food_name || ''}`).join('|');
    return `food-table-${refreshKey}-${foods.length}-${foodsHash}`;
  }, [foods, refreshKey]);

  // ✅ Refresh เมื่อมี query parameter หรือเมื่อ component mount
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    
    console.log("🔄 [ListFood] useEffect triggered", {
      pathname: location.pathname,
      search: location.search,
      refreshParam,
      currentFoodsCount: foods.length
    });
    
    const loadData = async () => {
      try {
        invalidateCache();
        await refreshData();
        
        // ✅ Get latest foods from store after refresh (ใช้ getState() เพื่อให้ได้ข้อมูลล่าสุด)
        await new Promise(resolve => setTimeout(resolve, 100)); // ✅ รอสักครู่เพื่อให้ store update
        const latestFoods = useFoodStore.getState().foods;
        console.log("✅ [ListFood] Data refreshed successfully", {
          count: latestFoods.length,
          foods: latestFoods.map(f => ({ id: f.food_id, name: f.food_name || '' }))
        });
        
        // ✅ Force re-render หลังจาก refresh เสร็จ
        setRefreshKey(prev => prev + 1);
        
        // ✅ Clear refresh query parameter
        if (refreshParam) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('refresh');
          setSearchParams(newSearchParams, { replace: true });
        }
      } catch (error) {
        console.error("❌ [ListFood] Error refreshing data:", error);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]); // ✅ Watch location.search เพื่อ detect query parameter เปลี่ยน
  
  // ✅ Watch foods array เพื่อ detect changes และ force re-render
  useEffect(() => {
    const currentHash = foods.map(f => `${f.food_id}-${f.food_name || ''}`).join('|');
    
    // ✅ เช็คว่าข้อมูลเปลี่ยนจริงหรือไม่
    if (prevFoodsRef.current !== currentHash) {
      console.log("📊 [ListFood] Foods array changed - triggering re-render", {
        oldHash: prevFoodsRef.current.substring(0, 50),
        newHash: currentHash.substring(0, 50),
        count: foods.length,
        foods: foods.map(f => ({ id: f.food_id, name: f.food_name || '' }))
      });
      prevFoodsRef.current = currentHash;
      // ✅ Update refreshKey เพื่อ force FoodTable re-render
      setRefreshKey(prev => prev + 1);
    }
  }, [foods]); // ✅ Watch foods array โดยตรง - Zustand จะ trigger เมื่อ state เปลี่ยน

  // ✅ เพิ่มการ refresh เมื่อกลับมาหน้า (focus event)
  useEffect(() => {
    const handleFocus = () => {
      // เมื่อกลับมาหน้า ให้ refresh ข้อมูล
      invalidateCache();
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ เรียกแค่ครั้งเดียวตอน mount

  const filteredFoods = foods.filter((f) =>
    f.food_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <FoodTable 
            key={tableKey} // ✅ Force re-render เมื่อข้อมูลเปลี่ยน (ใช้ hash ของข้อมูล)
            data={filteredFoods} 
          />
        </div>
      </div>
    </div>
  );

};

export default ListFoodAdmin;
