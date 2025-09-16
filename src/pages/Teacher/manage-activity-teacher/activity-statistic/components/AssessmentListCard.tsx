import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "@components/Card";
import { useActivityReportStore } from "@stores/Teacher/activity-report.store";
import { Loader2 } from "lucide-react";
import { 
  AssessmentQuestionData
} from "@/types/activity-report.type";

// ===== Types =====
type Question = AssessmentQuestionData;

interface SetNumberGroup {
  setNumberId: number;
  setName?: string;
  questions: Question[];
}

// ===== Question Type Renderers =====

// Fix Single Answer Renderer (ตารางแบบคงที่)
const FixSingleAnswerRenderer = ({ questions }: { questions: Question[] }) => (
  <div className="w-full overflow-x-auto">
    <table className="w-full text-sm table-fixed min-w-[600px]">
      <thead>
        <tr className="text-left text-[#A0AEC0]">
          <th className="p-2 w-[300px]">คำถาม</th>
          <th className="p-2 text-center w-[80px]">มากที่สุด</th>
          <th className="p-2 text-center w-[60px]">มาก</th>
          <th className="p-2 text-center w-[80px]">ปานกลาง</th>
          <th className="p-2 text-center w-[60px]">น้อย</th>
          <th className="p-2 text-center w-[80px]">น้อยที่สุด</th>
          <th className="p-2 text-right w-[80px]">ค่าเฉลี่ย</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question.questionId} className="hover:bg-gray-50">
            <td className="p-2 w-[300px] break-words leading-relaxed">
              {question.questionText.length > 75 ? (
                <span className="whitespace-pre-line">
                  {question.questionText.replace(/(.{75}[^\s]*)\s/g, '$1\n')}
                </span>
              ) : (
                question.questionText
              )}
            </td>
            <td className="p-2 text-center w-[80px]">{question.most || 0}</td>
            <td className="p-2 text-center w-[60px]">{question.much || 0}</td>
            <td className="p-2 text-center w-[80px]">{question.medium || 0}</td>
            <td className="p-2 text-center w-[60px]">{question.less || 0}</td>
            <td className="p-2 text-center w-[80px]">{question.least || 0}</td>
            <td className="p-2 text-right w-[80px] font-semibold">
              {(question.average || 0).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Single Answer Renderer (Radio button style)
const SingleAnswerRenderer = ({ questions }: { questions: Question[] }) => {
  const pct = (count: number, total: number): string =>
    total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0.0%";

  const barClass = (percentage: number): string => {
    if (percentage >= 80) return "bg-green-400";
    if (percentage >= 60) return "bg-blue-600";
    if (percentage >= 40) return "bg-yellow-400";
    if (percentage >= 20) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="mb-4">
            <h4 className="font-semibold text-base text-gray-800 leading-relaxed">
              {question.questionNumber}. {question.questionText}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              จากผู้ตอบ {question.totalRespondents || 0} คน
            </p>
          </div>

          <div className="space-y-3">
            {question.choices?.map((choice: any) => {
              const percentageNumber = question.totalRespondents ? 
                (choice.count || 0) / question.totalRespondents * 100 : 0;
              return (
                <div
                  key={choice.choiceId}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      <span className="text-gray-800 font-medium">{choice.choiceText}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{choice.count || 0}</div>
                        <div className="text-gray-500 text-xs">คน</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {pct(choice.count || 0, question.totalRespondents || 0)}
                        </div>
                        <div className="text-gray-500 text-xs">เปอร์เซ็นต์</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${barClass(percentageNumber)}`}
                        style={{ width: `${percentageNumber.toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Multiple Answer Renderer (Checkbox style)
const MultipleAnswerRenderer = ({ questions }: { questions: Question[] }) => (
  <div className="space-y-6">
    {questions.map((question) => (
      <div key={question.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
        <div className="mb-4">
          <h4 className="font-semibold text-base text-gray-800 leading-relaxed">
            {question.questionNumber}. {question.questionText}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            จากผู้ตอบ {question.totalRespondents || 0} คน
          </p>
        </div>

        <div className="space-y-3">
          {question.choices?.map((choice: any) => (
            <div
              key={choice.choiceId}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-800 font-medium">{choice.choiceText}</span>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{choice.count || 0}</div>
                    <div className="text-gray-500 text-xs">คน</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{choice.percentage || "0.0%"}</div>
                    <div className="text-gray-500 text-xs">เปอร์เซ็นต์</div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      parseFloat(choice.percentage || "0") >= 80
                        ? 'bg-green-400'
                        : parseFloat(choice.percentage || "0") >= 60
                        ? 'bg-blue-600'
                        : parseFloat(choice.percentage || "0") >= 40
                        ? 'bg-yellow-400'
                        : parseFloat(choice.percentage || "0") >= 20
                        ? 'bg-orange-400'
                        : 'bg-red-400'
                    }`}
                    style={{ width: choice.percentage || "0%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Text Answer Renderer (ข้อเสนอแนะ)
const TextAnswerRenderer = ({ questions }: { questions: Question[] }) => (
  <div className="space-y-6">
    {questions.map((question) => (
      <div key={question.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
        <div className="mb-4">
          <h4 className="font-semibold text-base text-gray-800 leading-relaxed">
            {question.questionNumber}. {question.questionText}
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

// ===== Main Component =====
export default function AssessmentListCard() {
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

  // จัดกลุ่มคำถามตาม setNumber และเรียงตาม questionNumber
  const groupedQuestions = useMemo(() => {
    // ===== ข้อมูล Mock สำหรับการทดสอบ =====
    const mockData = [
      {
        setNumberId: 1,
        setName: "หัวข้อ 1: ความพึงพอใจ",
        questions: [
          {
            questionId: 1,
            questionText: "คุณพึงพอใจกับการจัดกิจกรรมครั้งนี้มากน้อยเพียงใด?",
            questionType: "Fix Single answer",
            questionNumber: 1,
            most: 25,
            much: 30,
            medium: 20,
            less: 15,
            least: 10,
            average: 3.45
          },
          {
            questionId: 2,
            questionText: "คุณคิดว่าการใช้เวลาของกิจกรรมเหมาะสมหรือไม่?",
            questionType: "Single answer",
            questionNumber: 2,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "เหมาะสมมาก", count: 40 },
              { choiceId: 2, choiceText: "เหมาะสม", count: 35 },
              { choiceId: 3, choiceText: "ปานกลาง", count: 20 },
              { choiceId: 4, choiceText: "ไม่เหมาะสม", count: 5 }
            ]
          },
          {
            questionId: 3,
            questionText: "คุณชอบกิจกรรมแบบไหนบ้าง? (เลือกได้มากกว่า 1 ข้อ)",
            questionType: "Multiple answer",
            questionNumber: 3,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "การบรรยาย", count: 60, percentage: "60.0%" },
              { choiceId: 2, choiceText: "การสาธิต", count: 45, percentage: "45.0%" },
              { choiceId: 3, choiceText: "การทำกิจกรรม", count: 70, percentage: "70.0%" },
              { choiceId: 4, choiceText: "การอภิปราย", count: 30, percentage: "30.0%" }
            ]
          },
          {
            questionId: 4,
            questionText: "คุณมีความคิดเห็นเพิ่มเติมเกี่ยวกับความพึงพอใจหรือไม่?",
            questionType: "Text answer",
            questionNumber: 4,
            answers: [
              "กิจกรรมน่าสนใจมาก ได้ความรู้เยอะ",
              "อยากให้จัดบ่อยๆ",
              "วิทยากรสอนดีมาก",
              "เวลาจัดเหมาะสม"
            ]
          }
        ]
      },
      {
        setNumberId: 2,
        setName: "หัวข้อ 2: ประเมินวิทยากร",
        questions: [
          {
            questionId: 5,
            questionText: "คุณประเมินความสามารถในการนำเสนอของวิทยากรอย่างไร?",
            questionType: "Fix Single answer",
            questionNumber: 1,
            most: 35,
            much: 25,
            medium: 25,
            less: 10,
            least: 5,
            average: 3.85
          },
          {
            questionId: 6,
            questionText: "วิทยากรตอบคำถามได้ชัดเจนหรือไม่?",
            questionType: "Single answer",
            questionNumber: 2,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "ชัดเจนมาก", count: 50 },
              { choiceId: 2, choiceText: "ชัดเจน", count: 30 },
              { choiceId: 3, choiceText: "ปานกลาง", count: 15 },
              { choiceId: 4, choiceText: "ไม่ชัดเจน", count: 5 }
            ]
          },
          {
            questionId: 7,
            questionText: "คุณชอบวิธีการสอนแบบไหนของวิทยากร? (เลือกได้มากกว่า 1 ข้อ)",
            questionType: "Multiple answer",
            questionNumber: 3,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "การใช้สื่อการสอน", count: 80, percentage: "80.0%" },
              { choiceId: 2, choiceText: "การยกตัวอย่าง", count: 65, percentage: "65.0%" },
              { choiceId: 3, choiceText: "การเปิดโอกาสให้ถาม", count: 45, percentage: "45.0%" },
              { choiceId: 4, choiceText: "การสรุปเนื้อหา", count: 70, percentage: "70.0%" }
            ]
          },
          {
            questionId: 8,
            questionText: "คุณมีข้อเสนอแนะสำหรับวิทยากรหรือไม่?",
            questionType: "Text answer",
            questionNumber: 4,
            answers: [
              "วิทยากรสอนดีมาก อยากให้มาเป็นวิทยากรอีก",
              "ควรเพิ่มตัวอย่างให้มากขึ้น",
              "พูดชัดเจนดีมาก",
              "ตอบคำถามได้ดี"
            ]
          }
        ]
      },
      {
        setNumberId: 3,
        setName: "หัวข้อ 3: ประเมินผลการอบรม",
        questions: [
          {
            questionId: 9,
            questionText: "คุณคิดว่าความรู้ที่ได้รับสามารถนำไปใช้ในการทำงานได้หรือไม่?",
            questionType: "Fix Single answer",
            questionNumber: 1,
            most: 40,
            much: 35,
            medium: 20,
            less: 3,
            least: 2,
            average: 4.11
          },
          {
            questionId: 10,
            questionText: "คุณคิดว่าการอบรมครั้งนี้บรรลุวัตถุประสงค์หรือไม่?",
            questionType: "Single answer",
            questionNumber: 2,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "บรรลุมาก", count: 45 },
              { choiceId: 2, choiceText: "บรรลุ", count: 40 },
              { choiceId: 3, choiceText: "ปานกลาง", count: 12 },
              { choiceId: 4, choiceText: "ไม่บรรลุ", count: 3 }
            ]
          },
          {
            questionId: 11,
            questionText: "คุณต้องการฝึกอบรมเพิ่มเติมในหัวข้อไหนบ้าง?",
            questionType: "Multiple answer",
            questionNumber: 3,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "เทคนิคขั้นสูง", count: 55, percentage: "55.0%" },
              { choiceId: 2, choiceText: "การประยุกต์ใช้งาน", count: 40, percentage: "40.0%" },
              { choiceId: 3, choiceText: "การแก้ไขปัญหา", count: 35, percentage: "35.0%" },
              { choiceId: 4, choiceText: "การออกแบบระบบ", count: 25, percentage: "25.0%" }
            ]
          },
          {
            questionId: 12,
            questionText: "คุณมีข้อเสนอแนะสำหรับการปรับปรุงการอบรมหรือไม่?",
            questionType: "Text answer",
            questionNumber: 4,
            answers: [
              "อยากให้จัดกิจกรรมแบบนี้บ่อยๆ เพราะได้ความรู้มาก",
              "ควรเพิ่มเวลาพักให้มากขึ้น",
              "อยากให้มีเอกสารประกอบการอบรมแจกให้",
              "ควรจัดในวันเสาร์-อาทิตย์จะดีกว่า"
            ]
          }
        ]
      },
      {
        setNumberId: 4,
        setName: "หัวข้อ 4: ข้อเสนอแนะและความคิดเห็น",
        questions: [
          {
            questionId: 13,
            questionText: "คุณประเมินการจัดกิจกรรมครั้งนี้โดยรวมอย่างไร?",
            questionType: "Fix Single answer",
            questionNumber: 1,
            most: 30,
            much: 35,
            medium: 25,
            less: 7,
            least: 3,
            average: 3.82
          },
          {
            questionId: 14,
            questionText: "คุณจะแนะนำให้เพื่อนร่วมงานเข้าร่วมกิจกรรมแบบนี้หรือไม่?",
            questionType: "Single answer",
            questionNumber: 2,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "จะแนะนำแน่นอน", count: 60 },
              { choiceId: 2, choiceText: "อาจจะแนะนำ", count: 25 },
              { choiceId: 3, choiceText: "ไม่แน่ใจ", count: 10 },
              { choiceId: 4, choiceText: "ไม่แนะนำ", count: 5 }
            ]
          },
          {
            questionId: 15,
            questionText: "คุณอยากให้ปรับปรุงอะไรในการจัดกิจกรรมครั้งต่อไป? (เลือกได้มากกว่า 1 ข้อ)",
            questionType: "Multiple answer",
            questionNumber: 3,
            totalRespondents: 100,
            choices: [
              { choiceId: 1, choiceText: "ปรับปรุงระบบเสียง", count: 40, percentage: "40.0%" },
              { choiceId: 2, choiceText: "เพิ่มเวลาในการถาม-ตอบ", count: 55, percentage: "55.0%" },
              { choiceId: 3, choiceText: "จัดเตรียมอาหารว่าง", count: 30, percentage: "30.0%" },
              { choiceId: 4, choiceText: "ปรับปรุงสถานที่", count: 35, percentage: "35.0%" }
            ]
          },
          {
            questionId: 16,
            questionText: "คุณมีความคิดเห็นเพิ่มเติมหรือข้อเสนอแนะสำหรับการจัดกิจกรรมครั้งต่อไป",
            questionType: "Text answer",
            questionNumber: 4,
            answers: [
              "อยากให้มีกิจกรรมกลุ่มมากขึ้น",
              "ห้องอบรมควรมีเครื่องปรับอากาศที่ดีกว่า",
              "ควรแจ้งล่วงหน้านานกว่านี้เพื่อเตรียมตัว",
              "เพิ่มสื่อการเรียนการสอน",
              "จัดระบบลงทะเบียนให้สะดวกขึ้น"
            ]
          }
        ]
      }
    ];

    // บังคับใช้ข้อมูล mock เพื่อแสดงทุกประเภทคำถาม (สำหรับการทดสอบ)
    console.log("🔍 [AssessmentListCard] Force using mock data to show all question types");
    return mockData as SetNumberGroup[];
  }, [assessmentData]);

  // แสดง loading state
  if (assessmentLoading) {
    return (
      <CustomCard className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-gray-600">กำลังโหลดข้อมูลแบบประเมิน...</span>
          </div>
        </div>
      </CustomCard>
    );
  }

  // แสดง error state
  if (assessmentError) {
    return (
      <CustomCard className="w-full p-6">
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
      </CustomCard>
    );
  }

  if (groupedQuestions.length === 0) {
    return (
      <CustomCard className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500">ไม่มีข้อมูลแบบประเมิน</div>
            <div className="text-sm text-gray-400 mt-2">
              Debug: assessmentData length = {assessmentData?.length || 0}
            </div>
          </div>
        </div>
      </CustomCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mock Data Warning - แสดงเสมอเพื่อทดสอบ */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h4 className="font-semibold text-orange-800">ข้อมูล Mock สำหรับการทดสอบ</h4>
            <p className="text-sm text-orange-700">
              กำลังแสดงข้อมูลตัวอย่าง (Mock Data) เพื่อแสดงคำถามครบทุกประเภทในแต่ละหัวเรื่อง
            </p>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Debug Information:</h4>
        <div className="text-sm text-yellow-700">
          <p>Total groups found: {groupedQuestions.length}</p>
          <p>Groups: {groupedQuestions.map(g => `Set ${g.setNumberId} (${g.questions.length} questions)`).join(', ')}</p>
          <p>Data source: Mock Data (บังคับใช้เพื่อทดสอบ)</p>
        </div>
      </div>

      {groupedQuestions.map((group) => (
        <CustomCard key={group.setNumberId} className="w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-blue-800">
              {group.setName}
            </h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">
                หัวข้อ
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">
                กราฟ
              </button>
            </div>
          </div>

          {/* จัดกลุ่มคำถามตามประเภท */}
          {(() => {
            const fixSingleQuestions = group.questions.filter(q => q.questionType === "Fix Single answer");
            const singleQuestions = group.questions.filter(q => q.questionType === "Single answer");
            const multipleQuestions = group.questions.filter(q => q.questionType === "Multiple answer");
            const textQuestions = group.questions.filter(q => q.questionType === "Text answer");

            return (
              <div className="space-y-8">
                {/* Fix Single Answer Questions */}
                {fixSingleQuestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-700">
                      คำถามแบบเลือกคำตอบเดียว (แบบคงที่)
                    </h4>
                    <FixSingleAnswerRenderer questions={fixSingleQuestions as Question[]} />
                  </div>
                )}

                {/* Single Answer Questions */}
                {singleQuestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-700">
                      คำถามแบบเลือกคำตอบเดียว (แบบอิสระ)
                    </h4>
                    <SingleAnswerRenderer questions={singleQuestions as Question[]} />
                  </div>
                )}

                {/* Multiple Answer Questions */}
                {multipleQuestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-700">
                      คำถามแบบเลือกตอบหลายข้อ
                    </h4>
                    <MultipleAnswerRenderer questions={multipleQuestions as Question[]} />
                  </div>
                )}

                {/* Text Answer Questions */}
                {textQuestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-700">
                      คำถามแบบข้อความ
                    </h4>
                    <TextAnswerRenderer questions={textQuestions as Question[]} />
                  </div>
                )}
              </div>
            );
          })()}
        </CustomCard>
      ))}
    </div>
  );
}
