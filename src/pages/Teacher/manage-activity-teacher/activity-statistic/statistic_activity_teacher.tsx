
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import EnrolledByDepartmentCard from "./components/EnrolledByDepartmentCard";
import EnrolledmentDataCard from "./components/EnrolledmentDataCard";
import SatisfactionSurveyCard from "./components/SatisfactionSurveyCard";
import StudentDoAssessmentDataCard from "./components/StudentDoAssessmentDataCard";
import SetNumberAssessmentDataCard from "./components/SetNumberAssessmentDataCard";


const StatisticActivityTeacher = () => {
  const { id } = useParams();
  
  console.log("🔍 StatisticActivityTeacher: activityId from URL:", id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Button className="ml-40" onClick={() => window.history.back()}>← กลับ</Button>

<div className="max-w-7xl mx-auto px-8">
  {/* Header row with title and export button */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-4xl font-bold text-gray-800">สรุปผลกิจกรรม</h1>
    <Button onClick={() => { console.log("export data") }} bgColor="green">export data</Button>
  </div>
  </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="space-y-6 overflow-x-hidden">
          {/* Layout แบบ figma - การ์ดซ้ายกว้างกว่าขวา */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* แถวบนซ้าย: จำนวนนิสิตที่ลงทะเบียนแยกตามสาขาและชั้นปี (กว้าง 2/3) */}
            <div className="lg:col-span-2">
              <EnrolledByDepartmentCard />
            </div>

            {/* แถวบนขวา: การเข้าร่วมกิจกรรมของนิสิต (กว้าง 1/3) */}
            <div className="lg:col-span-1">
              <EnrolledmentDataCard />
            </div>
          </div>

          <div className="mb-6 mt-15">
            <h1 className="text-4xl font-bold text-gray-800">สรุปผลแบบประเมิน</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* แถวล่างซ้าย: แบบประเมินความพึงพอใจ (กว้าง 2/3) */}
            <div className="lg:col-span-2">
              <SatisfactionSurveyCard />
            </div>
            
            {/* แถวล่างขวา: การทำแบบประเมินของนิสิต (กว้าง 1/3) */}
            <div className="lg:col-span-1">
              <StudentDoAssessmentDataCard />
            </div>
          </div>

          {/* SetNumberAssessmentDataCard วางแยกต่างหาก */}
          <div className="mt-6">
            <SetNumberAssessmentDataCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticActivityTeacher;