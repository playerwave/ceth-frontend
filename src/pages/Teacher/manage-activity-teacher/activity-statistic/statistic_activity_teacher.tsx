
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
         <div className="flex mb-6 ml-20">
            <div className="ml-20">
                <Button onClick={() => window.history.back()}>← กลับ</Button>
            </div>
            <div className="ml-25">
                <h1 className="text-4xl font-bold text-gray-800 flex-1 text-center">สรุปผลกิจกรรม</h1>
            </div>
            <div className="ml-220">
                <Button onClick={() => {console.log("export data")}} bgColor="green"> export data</Button>
            </div>
        </div>
      <div className="max-w-7xl mx-auto px-8">
        {/* Header with Title and Back Button */}
        
        <div className="space-y-6 overflow-x-hidden">
          {/* กราฟแท่ง + การเข้าร่วมกิจกรรม */}
          <div className="flex flex-col lg:flex-row w-full gap-6 items-stretch">
            <EnrolledByDepartmentCard />
            <EnrolledmentDataCard />
          </div>

          {/* 🔽 สรุปผลแบบประเมิน (วางไว้ด้านล่างหลัง 2 การ์ดด้านบน) */}
          <div className="mt-10">
            <div className="flex flex-col lg:flex-row gap-6">
              <SatisfactionSurveyCard />
              <StudentDoAssessmentDataCard />
            </div>

            <SetNumberAssessmentDataCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticActivityTeacher;