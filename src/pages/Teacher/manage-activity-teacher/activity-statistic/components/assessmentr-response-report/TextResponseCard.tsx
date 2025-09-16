import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AssessmentTopicCard from "./FixSingleAnswerResponse";
import CustomCard from "@components/Card";
import { useActivityReportStore } from "@stores/Teacher/activity-report.store";
import { Loader2 } from "lucide-react";
import { FeedbackItem } from "@/types/activity-report.type";

// ข้อมูลข้อเสนอแนะ (ยังคงใช้ mock data)
const feedbackData: FeedbackItem[] = [
  { comment: "ข้าวอร่อยมากครับ", department: "CS" },
  { comment: "ควรหน้าขอไข่ดาวด้วยครับ", department: "SE" },
  { comment: "พิธีกรหล่อมากค่ะ :)", department: "AI" },
];

export default function AssessmentDataContainer() {
  const { id: activityId } = useParams<{ id: string }>();
  const { 
    assessmentData, 
    assessmentLoading, 
    assessmentError, 
    fetchAssessmentData,
    clearAssessmentError 
  } = useActivityReportStore();

  useEffect(() => {
    if (activityId) {
      fetchAssessmentData(activityId);
    }
  }, [activityId, fetchAssessmentData]);
  // แสดง loading state
  if (assessmentLoading) {
    return (
      <div className="space-y-8 mt-15 mb-15">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-gray-600">กำลังโหลดข้อมูลแบบประเมิน...</span>
          </div>
        </div>
      </div>
    );
  }

  // แสดง error state
  if (assessmentError) {
    return (
      <div className="space-y-8 mt-15 mb-15">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">เกิดข้อผิดพลาด</div>
            <div className="text-gray-600 mb-4">{assessmentError}</div>
            <button 
              onClick={() => {
                clearAssessmentError();
                if (activityId) {
                  fetchAssessmentData(activityId);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  // แปลงข้อมูลจาก API เป็นรูปแบบที่ component ต้องการ
  const transformAssessmentData = (topic: any) => {
    const questions = topic.questions.map((question: any) => {
      // แปลง choiceStats เป็นรูปแบบตาราง
      const choiceStats = question.choiceStats || [];
      const most = choiceStats.find((stat: any) => stat.choiceText === 'มากที่สุด')?.count || 0;
      const much = choiceStats.find((stat: any) => stat.choiceText === 'มาก')?.count || 0;
      const medium = choiceStats.find((stat: any) => stat.choiceText === 'ปานกลาง')?.count || 0;
      const less = choiceStats.find((stat: any) => stat.choiceText === 'น้อย')?.count || 0;
      const least = choiceStats.find((stat: any) => stat.choiceText === 'น้อยที่สุด')?.count || 0;

      return {
        question: question.questionText,
        most,
        much,
        medium,
        less,
        least,
        average: question.average || 0,
      };
    });

    return {
      title: `หัวข้อ: ${topic.topicName}`,
      questions,
      pieData: topic.pieData,
      totalRespondents: topic.totalRespondents,
    };
  };

  return (
    <div className="space-y-8 mt-15 mb-15">
      {/* แสดงข้อมูลแบบประเมินจาก API */}
      {assessmentData && assessmentData.length > 0 ? (
        assessmentData.map((topic) => {
          const transformedData = transformAssessmentData(topic);
          return (
            <AssessmentTopicCard
              key={topic.topicId}
              topicTitle={transformedData.title}
              questions={transformedData.questions}
              pieData={transformedData.pieData}
              totalRespondents={transformedData.totalRespondents}
            />
          );
        })
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">ไม่มีข้อมูลแบบประเมิน</div>
        </div>
      )}

      {/* ตารางข้อเสนอแนะ */}
      <CustomCard
        className="w-full
                max-w-[90vw]         
                sm:max-w-[600px]     
                md:max-w-[700px]     
                lg:max-w-[100%]
                p-4 sm:p-6 relative
                mx-0 self-start
                shadow-lg"
      >
        <h3 className="font-bold text-lg mb-4">ข้อเสนอแนะจากนิสิต</h3>
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left text-[#A0AEC0] font-semibold">
              <th className="p-2 w-3/4">ข้อเสนอแนะ</th>
              <th className="p-2 w-1/4 text-center">สาขา</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((item) => (
              <tr key={item.department} className="hover:bg-gray-50">
                <td className="p-2 font-semibold">{item.comment}</td>
                <td className="p-2 text-center font-semibold">
                  {item.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CustomCard>
    </div>
  );
}
