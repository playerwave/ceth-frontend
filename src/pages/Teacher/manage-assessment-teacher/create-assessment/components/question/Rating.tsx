import React from "react";

const Rating = () => {
  return (
    <div className="flex gap-2 items-center py-2">
      <span className="text-sm text-gray-600">ไม่พอใจ</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="flex flex-col items-center">
          <span className="text-xs mb-1">{n}</span>
          <div className="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
        </div>
      ))}
      <span className="text-sm text-gray-600">พอใจมาก</span>
    </div>
  );
};

export default Rating;
