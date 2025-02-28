import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-40">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[5px] h-[20px] bg-[#1E3A8A] rounded-full animate-spinner-fade"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-16px)`,
              animationDelay: `${i * 0.083}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
