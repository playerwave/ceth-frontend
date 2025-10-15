import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AssessmentTopicCard from "./FixSingleAnswerResponse";
import { AssessmentQuestionData } from "@/types/activity-report.type";

// ===== Types =====
type Question = AssessmentQuestionData;

// ===== Text Answer Renderer =====
const TextAnswerRenderer = ({ questions, startIndex = 0 }: { questions: Question[]; startIndex?: number }) => (
  <div className="space-y-6">
    {questions.map((question, index) => (
      <div key={question.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
        <div className="mb-4">
          <h4 className="font-semibold text-base text-gray-800 leading-relaxed">
            {startIndex + index + 1}. {question.questionText}
          </h4>
        </div>

        <div className="space-y-2">
          {question.answers?.map((answer: any, answerIdx: number) => (
            <div key={answerIdx} className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-800">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// import CustomCard from "@components/Card"; // ไม่ได้ใช้แล้วเพราะซ่อนตารางข้อเสนอแนะ
import { useActivityReportStore } from "@stores/Teacher/activity-report.store";
import { Loader2 } from "lucide-react";
// import { FeedbackItem } from "@/types/activity-report.type"; // ไม่ได้ใช้แล้วเพราะซ่อนตารางข้อเสนอแนะ

// ===== ข้อมูล Mock สำหรับข้อเสนอแนะ (ถูกซ่อนไว้) =====
// ข้อมูล Mock นี้ถูกสร้างขึ้นเพื่อทดสอบการแสดงผลของตารางข้อเสนอแนะ
// ประกอบด้วยข้อมูลตัวอย่างข้อเสนอแนะจากนิสิตในสาขาต่างๆ
// หมายเหตุ: ในสภาพแวดล้อมจริง ควรใช้ข้อมูลจาก API แทน
/*
const feedbackData: FeedbackItem[] = [
  { comment: "ข้าวอร่อยมากครับ", department: "CS" },        // ข้อเสนอแนะจากสาขา Computer Science
  { comment: "ควรหน้าขอไข่ดาวด้วยครับ", department: "SE" },    // ข้อเสนอแนะจากสาขา Software Engineering  
  { comment: "พิธีกรหล่อมากค่ะ :)", department: "AI" },      // ข้อเสนอแนะจากสาขา Artificial Intelligence
];
*/

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
    // แยกคำถามตามประเภท
    const fixSingleQuestions: any[] = [];
    const textQuestions: Question[] = [];

    topic.questions.forEach((question: any, index: number) => {
      if (question.questionType === "Text answer") {
        textQuestions.push({
          questionId: question.questionId,
          questionText: question.questionText,
          questionType: question.questionType,
          questionNumber: question.questionNumber,
          answers: question.answers || []
        });
      } else {
        // แปลง choiceStats เป็นรูปแบบตารางสำหรับ Fix Single answer
        const choiceStats = question.choiceStats || [];
        const most = choiceStats.find((stat: any) => stat.choiceText === 'มากที่สุด')?.count || 0;
        const much = choiceStats.find((stat: any) => stat.choiceText === 'มาก')?.count || 0;
        const medium = choiceStats.find((stat: any) => stat.choiceText === 'ปานกลาง')?.count || 0;
        const less = choiceStats.find((stat: any) => stat.choiceText === 'น้อย')?.count || 0;
        const least = choiceStats.find((stat: any) => stat.choiceText === 'น้อยที่สุด')?.count || 0;

        fixSingleQuestions.push({
          question: question.questionText,
          most,
          much,
          medium,
          less,
          least,
          average: question.average || 0,
        });
      }
    });

    return {
      title: `หัวข้อ: ${topic.topicName}`,
      fixSingleQuestions,
      textQuestions,
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
            <div key={topic.topicId} className="space-y-6">
              {/* แสดง Fix Single Answer Questions */}
              {transformedData.fixSingleQuestions.length > 0 && (
                <AssessmentTopicCard
                  topicTitle={transformedData.title}
                  questions={transformedData.fixSingleQuestions}
                  pieData={transformedData.pieData}
                  totalRespondents={transformedData.totalRespondents}
                />
              )}
              
              {/* แสดง Text Answer Questions */}
              {transformedData.textQuestions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                  <h3 className="font-bold text-xl text-blue-800 mb-6">
                    {transformedData.title} - ข้อเสนอแนะ
                  </h3>
                  <TextAnswerRenderer 
                    questions={transformedData.textQuestions} 
                    startIndex={transformedData.fixSingleQuestions.length}
                  />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">ไม่มีข้อมูลแบบประเมิน</div>
        </div>
      )}

      {/* ตารางข้อเสนอแนะ - ใช้ข้อมูล Mock สำหรับการทดสอบ (ถูกซ่อนไว้) */}
      {/* 
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
      */}
    </div>
  );
}
