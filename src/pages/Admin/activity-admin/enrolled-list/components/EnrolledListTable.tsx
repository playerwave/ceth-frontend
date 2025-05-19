interface Props {
  activityLoading: boolean;
  enrolledStudents: any[];
  filteredStudents: any[]; // เพิ่ม filteredStudents มาจากคอมโพเนนต์หลัก
  activity: any; // ข้อมูลกิจกรรมที่ส่งมาเพื่อเช็คประเภท location
}

export default function EnrolledListTable({
  activityLoading,
  enrolledStudents,
  filteredStudents,
  activity,
}: Props) {
  return (
    <div className="overflow-x-auto max-h-[400px] rounded-lg">
      <table className="w-full border-spacing-0 table-auto">
        <thead className="bg-blue-900 text-white sticky top-0 z-10 rounded-lg">
          <tr>
            <th className="p-3 text-left w-[120px] rounded-tl-lg rounded-bl-lg">
              รหัสนิสิต
            </th>
            <th className="p-3 text-left w-[200px]">ชื่อ-นามสกุล</th>
            <th className="p-3 text-left w-[120px]">สาขา</th>
            <th className="p-3 text-center w-[120px]">สถานะ</th>
            <th className="p-3 text-center w-[120px]">อาหาร</th>
            <th className="p-3 text-center w-[120px]">ลงชื่อเข้า</th>
            <th className="p-3 text-center w-[120px]">ลงชื่อออก</th>
            <th className="p-3 text-center w-[120px] rounded-tr-lg rounded-br-lg">
              ทำแบบประเมิน
            </th>
          </tr>
        </thead>

        {/* เนื้อหาตาราง */}
        <tbody className="bg-white">
          {activityLoading ? (
            <tr>
              <td colSpan={8} className="text-center p-4">
                กำลังโหลดข้อมูล...
              </td>
            </tr>
          ) : enrolledStudents.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">
                ไม่มีข้อมูลนิสิตที่ลงทะเบียน
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-300 hover:bg-gray-100"
              >
                <td className="p-3 text-left">{student.id}</td>
                <td className="p-3 text-left">{student.name}</td>
                <td className="p-3 text-left">{student.department}</td>
                <td className="p-3 text-center">
                  <span
                    className={`w-[110px] h-[30px] flex items-center justify-center rounded-md text-sm font-semibold border ${
                      student.status === "normal"
                        ? "text-green-700 bg-green-100 border-green-400"
                        : "text-red-700 bg-red-100 border-red-400"
                    }`}
                  >
                    {student.status === "normal" ? "ปกติ" : "เสี่ยง"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {activity?.location_type !== "Onsite"
                    ? "-"
                    : student.selectedfood}
                </td>
                <td className="p-3 text-center">{student.checkIn}</td>
                <td className="p-3 text-center">{student.checkOut}</td>
                <td className="p-3 text-center">{student.evaluated}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
