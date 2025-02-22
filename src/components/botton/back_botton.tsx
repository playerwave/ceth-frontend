const BackBotton = () => {
    return (
      <button
        onClick={() => window.history.back()}
        className="flex items-center justify-center gap-2 w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none"
      >
        ← กลับ
      </button>
    );
  };
  
  export default BackBotton;
  
