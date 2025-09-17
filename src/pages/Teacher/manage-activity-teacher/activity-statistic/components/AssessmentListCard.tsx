import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "@components/Card";
import { useActivityReportStore } from "@stores/Teacher/activity-report.store";
import { Loader2 } from "lucide-react";
import { 
  AssessmentQuestionData
} from "@/types/activity-report.type";
import SingleAnswerResponseCard from "./assessmentr-response-report/SingleAnswerResponseCard";
import MultipleAnswerResponseCard from "./assessmentr-response-report/MultipleAnswerResponseCard";

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

// Single Answer และ Multiple Answer Renderers ถูกย้ายไปใช้ component แยกแล้ว

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
    // Debug: ตรวจสอบข้อมูลจาก API
    console.log("🔍 [AssessmentListCard] assessmentData:", assessmentData);
    console.log("🔍 [AssessmentListCard] assessmentData length:", assessmentData?.length || 0);
    
    // ใช้ข้อมูลจริงจาก API แทนข้อมูล Mock
    if (!assessmentData || assessmentData.length === 0) {
      console.log("⚠️ [AssessmentListCard] No assessment data from API, returning empty array");
      return [];
    }

    // ตรวจสอบโครงสร้างข้อมูล - อาจเป็น nested structure (topics -> questions)
    let processedData = assessmentData;
    
    // ถ้าข้อมูลมีโครงสร้างแบบ nested (มี topics และ questions แยกกัน)
    if (assessmentData[0] && assessmentData[0].questions) {
      console.log("🔍 [AssessmentListCard] Detected nested structure (topics -> questions)");
      processedData = assessmentData; // ใช้ข้อมูลตามที่เป็น
    } else {
      console.log("🔍 [AssessmentListCard] Detected flat structure (questions only)");
      // ถ้าเป็น flat structure ให้สร้าง topic ปลอม
      processedData = [{
        setNumberId: 1,
        setName: "แบบประเมิน",
        questions: assessmentData
      }] as any[];
    }

    // จัดกลุ่มข้อมูลตาม setNumber (รองรับ field names ที่แตกต่างกัน)
    const grouped = processedData.reduce((acc: SetNumberGroup[], item: any) => {
      console.log("🔍 [AssessmentListCard] Processing item:", item);
      
      // รองรับ field names ที่แตกต่างกัน
      const setNumberId = item.setNumberId || item.topicId || item.id || 1;
      const setName = item.setName || item.topicName || item.name || `หัวข้อ ${setNumberId}`;
      
      console.log("🔍 [AssessmentListCard] Extracted - setNumberId:", setNumberId, "setName:", setName);
      
      // ถ้ามี questions array ให้ใช้ ถ้าไม่มีให้ใช้ item เอง
      let questions = item.questions || [item];
      
      // แปลงข้อมูล Fix Single Answer questions ให้มีโครงสร้างที่ถูกต้อง
      questions = questions.map((question: any) => {
        if (question.questionType === "Fix Single answer") {
          // ถ้าไม่มี most, much, medium, less, least ให้แปลงจาก choiceStats
          if (!question.most && !question.much && !question.medium && !question.less && !question.least) {
            if (question.choiceStats && Array.isArray(question.choiceStats)) {
              const stats = question.choiceStats;
              return {
                ...question,
                most: stats.find((s: any) => s.choiceText === 'มากที่สุด')?.count || 0,
                much: stats.find((s: any) => s.choiceText === 'มาก')?.count || 0,
                medium: stats.find((s: any) => s.choiceText === 'ปานกลาง')?.count || 0,
                less: stats.find((s: any) => s.choiceText === 'น้อย')?.count || 0,
                least: stats.find((s: any) => s.choiceText === 'น้อยที่สุด')?.count || 0,
              };
            }
          }
        }
        return question;
      });
      
      acc.push({
        setNumberId: setNumberId,
        setName: setName,
        questions: questions
      });
      
      return acc;
    }, []);

    // เรียงลำดับคำถามในแต่ละกลุ่มตาม questionNumber
    grouped.forEach(group => {
      group.questions.sort((a, b) => a.questionNumber - b.questionNumber);
    });

    console.log("🔍 [AssessmentListCard] Final grouped questions:", grouped);
    
    // Debug: ตรวจสอบโครงสร้างข้อมูลแต่ละคำถาม
    grouped.forEach((group, groupIndex) => {
      console.log(`🔍 [AssessmentListCard] Group ${groupIndex + 1}:`, group.setName);
      group.questions.forEach((question, questionIndex) => {
        console.log(`🔍 [AssessmentListCard] Question ${questionIndex + 1}:`, {
          questionId: question.questionId,
          questionText: question.questionText,
          questionType: question.questionType,
          most: question.most,
          much: question.much,
          medium: question.medium,
          less: question.less,
          least: question.least,
          average: question.average,
          choices: question.choices,
          choiceStats: question.choiceStats,
          totalRespondents: question.totalRespondents,
          totalAnswers: question.totalAnswers
        });
      });
    });
    
    return grouped;

    // ===== ข้อมูล Mock สำหรับการทดสอบ (ถูกปิดใช้งาน) =====
    /*
    const mockData = [
      {
        // หัวข้อที่ 1: ความพึงพอใจ - ตัวอย่างคำถามเกี่ยวกับความพึงพอใจของผู้เข้าร่วมกิจกรรม
        setNumberId: 1,
        setName: "หัวข้อ 1: ความพึงพอใจ",
        questions: [
          {
            // คำถามที่ 1: Fix Single answer - แสดงผลเป็นตารางแบบคงที่
            // ข้อมูล: จำนวนผู้ตอบในแต่ละระดับ (มากที่สุด, มาก, ปานกลาง, น้อย, น้อยที่สุด) และค่าเฉลี่ย
            questionId: 1,
            questionText: "คุณพึงพอใจกับการจัดกิจกรรมครั้งนี้มากน้อยเพียงใด?",
            questionType: "Fix Single answer",
            questionNumber: 1,
            most: 25,      // จำนวนผู้ตอบ "มากที่สุด"
            much: 30,      // จำนวนผู้ตอบ "มาก"
            medium: 20,    // จำนวนผู้ตอบ "ปานกลาง"
            less: 15,      // จำนวนผู้ตอบ "น้อย"
            least: 10,     // จำนวนผู้ตอบ "น้อยที่สุด"
            average: 3.45  // ค่าเฉลี่ย (1-5)
          },
          {
            // คำถามที่ 2: Single answer - แสดงผลเป็น radio button style พร้อม progress bar
            // ข้อมูล: ตัวเลือกคำตอบแบบอิสระ พร้อมจำนวนผู้ตอบและเปอร์เซ็นต์
            questionId: 2,
            questionText: "คุณคิดว่าการใช้เวลาของกิจกรรมเหมาะสมหรือไม่?",
            questionType: "Single answer",
            questionNumber: 2,
            totalRespondents: 100,  // จำนวนผู้ตอบทั้งหมด
            choices: [
              { choiceId: 1, choiceText: "เหมาะสมมาก", count: 40 },  // 40% ของผู้ตอบ
              { choiceId: 2, choiceText: "เหมาะสม", count: 35 },      // 35% ของผู้ตอบ
              { choiceId: 3, choiceText: "ปานกลาง", count: 20 },      // 20% ของผู้ตอบ
              { choiceId: 4, choiceText: "ไม่เหมาะสม", count: 5 }     // 5% ของผู้ตอบ
            ]
          },
          {
            // คำถามที่ 3: Multiple answer - แสดงผลเป็น checkbox style พร้อม progress bar
            // ข้อมูล: ตัวเลือกคำตอบหลายข้อ พร้อมจำนวนผู้ตอบและเปอร์เซ็นต์ (รวมกันอาจเกิน 100%)
            questionId: 3,
            questionText: "คุณชอบกิจกรรมแบบไหนบ้าง? (เลือกได้มากกว่า 1 ข้อ)",
            questionType: "Multiple answer",
            questionNumber: 3,
            totalRespondents: 100,  // จำนวนผู้ตอบทั้งหมด
            choices: [
              { choiceId: 1, choiceText: "การบรรยาย", count: 60, percentage: "60.0%" },    // 60% เลือก
              { choiceId: 2, choiceText: "การสาธิต", count: 45, percentage: "45.0%" },      // 45% เลือก
              { choiceId: 3, choiceText: "การทำกิจกรรม", count: 70, percentage: "70.0%" },  // 70% เลือก
              { choiceId: 4, choiceText: "การอภิปราย", count: 30, percentage: "30.0%" }     // 30% เลือก
            ]
          },
          {
            // คำถามที่ 4: Text answer - แสดงผลเป็นข้อความข้อเสนอแนะ
            // ข้อมูล: รายการข้อความที่ผู้ตอบเขียนมา
            questionId: 4,
            questionText: "คุณมีความคิดเห็นเพิ่มเติมเกี่ยวกับความพึงพอใจหรือไม่?",
            questionType: "Text answer",
            questionNumber: 4,
            answers: [
              "กิจกรรมน่าสนใจมาก ได้ความรู้เยอะ",  // ข้อเสนอแนะที่ 1
              "อยากให้จัดบ่อยๆ",                    // ข้อเสนอแนะที่ 2
              "วิทยากรสอนดีมาก",                    // ข้อเสนอแนะที่ 3
              "เวลาจัดเหมาะสม"                      // ข้อเสนอแนะที่ 4
            ]
          }
        ]
      },
      {
        // หัวข้อที่ 2: ประเมินวิทยากร - ตัวอย่างคำถามเกี่ยวกับการประเมินวิทยากร
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
        // หัวข้อที่ 3: ประเมินผลการอบรม - ตัวอย่างคำถามเกี่ยวกับผลการอบรม
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
        // หัวข้อที่ 4: ข้อเสนอแนะและความคิดเห็น - ตัวอย่างคำถามเกี่ยวกับข้อเสนอแนะ
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

    // ข้อมูล Mock ถูกปิดใช้งานแล้ว ใช้ข้อมูลจริงจาก API แทน
    // console.log("🔍 [AssessmentListCard] Force using mock data to show all question types");
    // return mockData as SetNumberGroup[];
    */
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
            <div className="text-sm text-gray-400 mt-1">
              Loading: {assessmentLoading ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Error: {assessmentError || 'None'}
            </div>
            {assessmentData && (
              <div className="text-sm text-gray-400 mt-2">
                Raw data: {JSON.stringify(assessmentData, null, 2)}
              </div>
            )}
          </div>
        </div>
      </CustomCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* Debug Information - แสดงข้อมูล debug เพื่อตรวจสอบ */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Debug Information:</h4>
        <div className="text-sm text-blue-700">
          <p>Total groups found: {groupedQuestions.length}</p>
          <p>Groups: {groupedQuestions.map(g => `Set ${g.setNumberId} (${g.questions.length} questions)`).join(', ')}</p>
          <p>Data source: API Data</p>
          <p>Assessment Data Length: {assessmentData?.length || 0}</p>
          {assessmentData && assessmentData.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">Raw API Data (Click to expand)</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(assessmentData, null, 2)}
              </pre>
            </details>
          )}
          {groupedQuestions.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">Processed Questions Data (Click to expand)</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(groupedQuestions, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>

      {groupedQuestions.map((group) => (
        <CustomCard key={`group-${group.setNumberId}`} className="w-full p-6">
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
                    <SingleAnswerResponseCard questions={singleQuestions as Question[]} />
                  </div>
                )}

                {/* Multiple Answer Questions */}
                {multipleQuestions.length > 0 && (
                  <div>
                    <MultipleAnswerResponseCard questions={multipleQuestions as Question[]} />
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
