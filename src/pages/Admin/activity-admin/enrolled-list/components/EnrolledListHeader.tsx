interface EnrolledListHeaderProps {
  activeTab: "list" | "summary";
  setActiveTab: React.Dispatch<React.SetStateAction<"list" | "summary">>;
}

export default function EnrolledListHeader({ activeTab, setActiveTab }: EnrolledListHeaderProps) {
  return (
    <div className="flex flex-col justify-between items-start p-4">
      {/* ชื่อหัวข้อ */}
      {activeTab === "list" && (
        <h1 className="text-3xl font-bold mb-4">นิสิตที่ลงทะเบียน</h1>
      )}
      {activeTab === "summary" && (
        <h1 className="text-3xl font-bold mb-4">สรุปผลกิจกรรม</h1>
      )}

      {/* ปุ่ม tab */}
      <div className="flex gap-6 text-lg">
        <button
          className={`relative pb-2 transition-all ${
            activeTab === "list"
              ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("list")}
        >
          ลิสต์
        </button>

        <button
          className={`relative pb-2 transition-all ${
            activeTab === "summary"
              ? "text-blue-900 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-blue-900 after:rounded-full"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          สรุปกิจกรรม
        </button>
      </div>
    </div>
  );
}
