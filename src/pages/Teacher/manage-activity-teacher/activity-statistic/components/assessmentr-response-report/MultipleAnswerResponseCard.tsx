// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
import CustomCard from "@components/Card";
// import { useActivityReportStore } from "@stores/Teacher/activity-report.store";
import { AssessmentQuestionData } from "@/types/activity-report.type";

// Mock data สำหรับ Multiple Answer questions
const mockMultipleAnswerData = [
  {
    questionId: 1,
    questionText: "คุณชอบกิจกรรมใดบ้าง? (สามารถเลือกได้มากกว่า 1 ข้อ)",
    questionType: "Multiple answer" as const,
    questionNumber: 1,
    choices: [
      {
        choiceId: 1,
        choiceText: "การบรรยาย",
        count: 25,
        percentage: "78.1%"
      },
      {
        choiceId: 2,
        choiceText: "การประชุมกลุ่ม",
        count: 18,
        percentage: "56.3%"
      },
      {
        choiceId: 3,
        choiceText: "กิจกรรมนันทนาการ",
        count: 12,
        percentage: "37.5%"
      },
      {
        choiceId: 4,
        choiceText: "การทำ Workshop",
        count: 20,
        percentage: "62.5%"
      },
      {
        choiceId: 5,
        choiceText: "การนำเสนอผลงาน",
        count: 8,
        percentage: "25.0%"
      }
    ],
    totalRespondents: 32
  },
  {
    questionId: 2,
    questionText: "คุณได้รับประโยชน์ในด้านใดบ้าง?",
    questionType: "Multiple answer" as const,
    questionNumber: 2,
    choices: [
      {
        choiceId: 6,
        choiceText: "ความรู้ทางวิชาการ",
        count: 28,
        percentage: "87.5%"
      },
      {
        choiceId: 7,
        choiceText: "ทักษะการทำงานเป็นทีม",
        count: 22,
        percentage: "68.8%"
      },
      {
        choiceId: 8,
        choiceText: "ประสบการณ์การนำเสนอ",
        count: 15,
        percentage: "46.9%"
      },
      {
        choiceId: 9,
        choiceText: "เครือข่ายเพื่อนร่วมงาน",
        count: 19,
        percentage: "59.4%"
      }
    ],
    totalRespondents: 32
  },
  {
    questionId: 3,
    questionText: "คุณใช้เวลาในการเรียนรู้อย่างไรบ้าง?",
    questionType: "Multiple answer" as const,
    questionNumber: 3,
    choices: [
      {
        choiceId: 10,
        choiceText: "อ่านเอกสารประกอบ",
        count: 35,
        percentage: "73.9%"
      },
      {
        choiceId: 11,
        choiceText: "ดูวิดีโอออนไลน์",
        count: 42,
        percentage: "89.4%"
      },
      {
        choiceId: 12,
        choiceText: "ฝึกปฏิบัติจริง",
        count: 38,
        percentage: "80.9%"
      },
      {
        choiceId: 13,
        choiceText: "ปรึกษาผู้เชี่ยวชาญ",
        count: 22,
        percentage: "46.8%"
      },
      {
        choiceId: 14,
        choiceText: "ร่วมกลุ่มศึกษา",
        count: 18,
        percentage: "38.3%"
      },
      {
        choiceId: 15,
        choiceText: "ทดลองทำโครงการ",
        count: 31,
        percentage: "66.0%"
      }
    ],
    totalRespondents: 47
  },
  {
    questionId: 4,
    questionText: "คุณต้องการให้มีการปรับปรุงด้านใดบ้าง?",
    questionType: "Multiple answer" as const,
    questionNumber: 4,
    choices: [
      {
        choiceId: 16,
        choiceText: "เนื้อหาการบรรยาย",
        count: 15,
        percentage: "44.1%"
      },
      {
        choiceId: 17,
        choiceText: "อุปกรณ์และเครื่องมือ",
        count: 23,
        percentage: "67.6%"
      },
      {
        choiceId: 18,
        choiceText: "ระยะเวลาในการจัดกิจกรรม",
        count: 12,
        percentage: "35.3%"
      },
      {
        choiceId: 19,
        choiceText: "สถานที่จัดกิจกรรม",
        count: 8,
        percentage: "23.5%"
      },
      {
        choiceId: 20,
        choiceText: "การสื่อสารและแจ้งข่าวสาร",
        count: 19,
        percentage: "55.9%"
      },
      {
        choiceId: 21,
        choiceText: "ระบบลงทะเบียน",
        count: 14,
        percentage: "41.2%"
      },
      {
        choiceId: 22,
        choiceText: "การติดตามผลหลังกิจกรรม",
        count: 26,
        percentage: "76.5%"
      }
    ],
    totalRespondents: 34
  },
  {
    questionId: 5,
    questionText: "คุณสนใจเข้าร่วมกิจกรรมประเภทใดบ้างในอนาคต?",
    questionType: "Multiple answer" as const,
    questionNumber: 5,
    choices: [
      {
        choiceId: 23,
        choiceText: "การพัฒนาทักษะการพูด",
        count: 41,
        percentage: "68.3%"
      },
      {
        choiceId: 24,
        choiceText: "การเขียนโปรแกรม",
        count: 35,
        percentage: "58.3%"
      },
      {
        choiceId: 25,
        choiceText: "การออกแบบกราฟิก",
        count: 28,
        percentage: "46.7%"
      },
      {
        choiceId: 26,
        choiceText: "การตลาดดิจิทัล",
        count: 32,
        percentage: "53.3%"
      },
      {
        choiceId: 27,
        choiceText: "การวิเคราะห์ข้อมูล",
        count: 24,
        percentage: "40.0%"
      },
      {
        choiceId: 28,
        choiceText: "การเป็นผู้ประกอบการ",
        count: 19,
        percentage: "31.7%"
      },
      {
        choiceId: 29,
        choiceText: "การพัฒนาบุคลิกภาพ",
        count: 33,
        percentage: "55.0%"
      },
      {
        choiceId: 30,
        choiceText: "การทำงานเป็นทีม",
        count: 37,
        percentage: "61.7%"
      }
    ],
    totalRespondents: 60
  },
  {
    questionId: 6,
    questionText: "คุณใช้เทคโนโลยีใดบ้างในการเรียน?",
    questionType: "Multiple answer" as const,
    questionNumber: 6,
    choices: [
      {
        choiceId: 31,
        choiceText: "โน้ตบุ๊ก",
        count: 52,
        percentage: "92.9%"
      },
      {
        choiceId: 32,
        choiceText: "แท็บเล็ต",
        count: 28,
        percentage: "50.0%"
      },
      {
        choiceId: 33,
        choiceText: "สมาร์ทโฟน",
        count: 56,
        percentage: "100.0%"
      },
      {
        choiceId: 34,
        choiceText: "เดสก์ท็อป",
        count: 31,
        percentage: "55.4%"
      },
      {
        choiceId: 35,
        choiceText: "หูฟัง/ลำโพง",
        count: 45,
        percentage: "80.4%"
      },
      {
        choiceId: 36,
        choiceText: "กล้องเว็บแคม",
        count: 38,
        percentage: "67.9%"
      }
    ],
    totalRespondents: 56
  }
];

// ใช้ interface จาก type files แทน
type MultipleAnswerQuestion = AssessmentQuestionData;

export default function MultipleAnswerResponseCard() {
  // const { id } = useParams<{ id: string }>();
  // const { 
  //   assessmentData, 
  //   assessmentLoading, 
  //   assessmentError, 
  //   fetchAssessmentData,
  //   clearAssessmentError 
  // } = useActivityReportStore();

  // useEffect(() => {
  //   if (id) {
  //     fetchAssessmentData(id);
  //   }
  // }, [id, fetchAssessmentData]);

  // กรองเฉพาะคำถามประเภท Multiple answer
  const getMultipleAnswerQuestions = (): MultipleAnswerQuestion[] => {
    // ใช้ mock data เสมอสำหรับการแสดงผล
    return mockMultipleAnswerData;
    
    // TODO: เมื่อมีข้อมูลจริงจาก API แล้ว ให้ uncomment ส่วนนี้
    // if (assessmentData && assessmentData.length > 0) {
    //   const allQuestions: MultipleAnswerQuestion[] = [];
      
    //   assessmentData.forEach(topic => {
    //     topic.questions.forEach(question => {
    //       if (question.questionType === 'Multiple answer') {
    //         // แปลงข้อมูลจาก API ให้เข้ากับ format ที่ต้องการ
    //         const choices: MultipleAnswerChoice[] = question.choices?.map(choice => ({
    //           choiceId: choice.choiceId,
    //           choiceText: choice.choiceText,
    //           count: question.choiceStats?.find(stat => stat.choiceText === choice.choiceText)?.count || 0,
    //           percentage: question.choiceStats?.find(stat => stat.choiceText === choice.choiceText)?.percentage || "0.0%"
    //         })) || [];
            
    //         allQuestions.push({
    //           questionId: question.questionId,
    //           questionText: question.questionText,
    //           questionType: question.questionType,
    //           choices,
    //           totalRespondents: question.totalAnswers || 0
    //         });
    //       }
    //     });
    //   });
      
    //   return allQuestions;
    // }
    
    // return mockMultipleAnswerData;
  };

  const multipleAnswerQuestions = getMultipleAnswerQuestions();

  // แสดง loading state (ปิดการใช้งานชั่วคราวเพื่อแสดง mock data)
  // if (assessmentLoading) {
  //   return (
  //     <CustomCard>
  //       <h3 className="font-bold text-lg mb-4">คำถามแบบเลือกตอบหลายข้อ</h3>
  //       <div className="flex items-center justify-center h-64">
  //         <p className="text-blue-600">กำลังโหลดข้อมูล...</p>
  //       </div>
  //     </CustomCard>
  //   );
  // }

  // แสดง error state (ปิดการใช้งานชั่วคราวเพื่อแสดง mock data)
  // if (assessmentError) {
  //   return (
  //     <CustomCard>
  //       <h3 className="font-bold text-lg mb-4">คำถามแบบเลือกตอบหลายข้อ</h3>
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-red-600 bg-red-100 px-4 py-2 rounded">
  //           {assessmentError}
  //           <button 
  //             onClick={clearAssessmentError}
  //             className="ml-2 text-red-800 underline"
  //           >
  //             ลองใหม่
  //           </button>
  //         </div>
  //       </div>
  //     </CustomCard>
  //   );
  // }

  return (
    <CustomCard
      className="w-full
                max-w-[90vw]       
                sm:max-w-[600px]     
                md:max-w-[700px]    
                lg:max-w-full
                p-4 sm:p-6
                relative
                mx-0
                self-start
                h-full"
    >
      <h3 className="font-bold text-lg mb-6">คำถามแบบเลือกตอบหลายข้อ</h3>

      {multipleAnswerQuestions.length > 0 ? (
        <div className="space-y-8">
          {multipleAnswerQuestions.map((question, index) => (
            <div key={question.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* คำถาม */}
              <div className="mb-4">
                <h4 className="font-semibold text-base text-gray-800 leading-relaxed">
                  {index + 1}. {question.questionText}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  จากผู้ตอบ {question.totalRespondents} คน
                </p>
              </div>

              {/* ตัวเลือกและสถิติ */}
        <div className="space-y-3">
          {question.choices?.map((choice) => (
            <div 
              key={choice.choiceId} 
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  {/* Checkbox icon */}
                  <div className="w-5 h-5 border-2 border-gray-400 rounded mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  
                  {/* Choice text */}
                  <span className="text-gray-800 font-medium">
                    {choice.choiceText}
                  </span>
                </div>

                {/* สถิติ */}
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

              {/* Progress bar */}
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
                  ></div>
                </div>
              </div>
            </div>
          ))}
              </div>

              {/* สรุปสถิติ */}
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-800 font-medium">สรุป:</span>
                  <div className="flex space-x-4">
                    <span className="text-blue-600">
                      ตัวเลือกทั้งหมด: <strong>{question.choices?.length || 0}</strong> ข้อ
                    </span>
                    <span className="text-blue-600">
                      ผู้ตอบ: <strong>{question.totalRespondents}</strong> คน
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* สรุปข้อมูลโดยรวม */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-bold text-lg text-blue-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              สรุปข้อมูลโดยรวม
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {multipleAnswerQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">จำนวนคำถาม</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {multipleAnswerQuestions.reduce((total, q) => total + (q.choices?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">ตัวเลือกทั้งหมด</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                      {multipleAnswerQuestions.length > 0 
                        ? Math.round(multipleAnswerQuestions.reduce((sum, q) => sum + (q.totalRespondents || 0), 0) / multipleAnswerQuestions.length)
                        : 0
                      }
                  </div>
                  <div className="text-sm text-gray-600">ผู้ตอบเฉลี่ย</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-blue-700">
              <p className="font-medium">ข้อมูลการตอบแบบประเมิน:</p>
              <ul className="mt-2 space-y-1">
                {multipleAnswerQuestions.map((question, index) => (
                  <li key={question.questionId} className="flex justify-between">
                    <span>คำถาม {index + 1}:</span>
                    <span className="font-medium">{question.totalRespondents || 0} คน</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">ไม่มีคำถามแบบเลือกตอบหลายข้อ</p>
            <p className="text-gray-400 text-sm mt-2">
              คำถามประเภทนี้จะแสดงที่นี่เมื่อมีข้อมูล
            </p>
          </div>
        </div>
      )}
    </CustomCard>
  );
}
