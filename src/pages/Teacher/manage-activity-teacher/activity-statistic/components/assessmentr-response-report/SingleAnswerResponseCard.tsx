import CustomCard from "@components/Card";
import { AssessmentQuestionData } from "@/types/activity-report.type";

// ===== Types =====
type SingleChoiceQuestion = AssessmentQuestionData;

interface SingleAnswerResponseCardProps {
  questions: SingleChoiceQuestion[];
}

// ===== Helpers =====
const pct = (count: number, total: number): string =>
  total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0.0%";

const barClass = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-400";
  if (percentage >= 60) return "bg-blue-600";
  if (percentage >= 40) return "bg-yellow-400";
  if (percentage >= 20) return "bg-orange-400";
  return "bg-red-400";
};

export default function SingleChoiceResponseCard({ questions }: SingleAnswerResponseCardProps) {

  return (
    <CustomCard
      className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-full p-4 sm:p-6 relative mx-0 self-start h-full"
    >
      <h3 className="font-bold text-lg mb-6">คำถามแบบเลือกคำตอบเดียว (Single choice)</h3>

      {questions.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">ยังไม่มีคำถามประเภทนี้</p>
            <p className="text-gray-400 text-sm mt-2">ข้อมูลจะแสดงเมื่อมีคำถาม Single answer</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {questions.map((q, idx) => (
            <div key={q.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* Question */}
              <div className="mb-4">
                <h4 className="font-semibold text-base text-gray-800 leading-relaxed">
                  {idx + 1}. {q.questionText}
                </h4>
                <p className="text-sm text-gray-500 mt-1">จากผู้ตอบ {q.totalRespondents} คน</p>
              </div>

              {/* Choices + stats */}
              <div className="space-y-3">
                {q.choices?.map((c) => {
                  const percentageNumber = (q.totalRespondents || 0) > 0 ? ((c.count || 0) / (q.totalRespondents || 0)) * 100 : 0;
                  return (
                    <div
                      key={c.choiceId}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {/* Radio icon (read-only visual) */}
                          <div className="w-5 h-5 border-2 border-gray-400 rounded-full mr-3 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>

                          <span className="text-gray-800 font-medium">{c.choiceText}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{c.count || 0}</div>
                            <div className="text-gray-500 text-xs">คน</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{pct(c.count || 0, q.totalRespondents || 0)}</div>
                            <div className="text-gray-500 text-xs">เปอร์เซ็นต์</div>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${barClass(
                              percentageNumber
                            )}`}
                            style={{ width: `${percentageNumber.toFixed(1)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary per question */}
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-800 font-medium">สรุป:</span>
                  <div className="flex space-x-4">
                    <span className="text-blue-600">
                      ตัวเลือกทั้งหมด: <strong>{q.choices?.length || 0}</strong> ข้อ
                    </span>
                    <span className="text-blue-600">
                      ผู้ตอบ: <strong>{q.totalRespondents}</strong> คน
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Overall summary */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-bold text-lg text-blue-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>สรุปข้อมูลโดยรวม
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">จำนวนคำถาม</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {questions.reduce((acc, q) => acc + (q.choices?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">ตัวเลือกทั้งหมด</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                      {questions.length > 0
                        ? Math.round(
                            questions.reduce((sum, q) => sum + (q.totalRespondents || 0), 0) / questions.length
                          )
                        : 0}
                  </div>
                  <div className="text-sm text-gray-600">ผู้ตอบเฉลี่ย</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-blue-700">
              <p className="font-medium">ข้อมูลการตอบแบบประเมิน:</p>
              <ul className="mt-2 space-y-1">
                {questions.map((q, i) => (
                  <li key={q.questionId} className="flex justify-between">
                    <span>คำถาม {i + 1}:</span>
                    <span className="font-medium">{q.totalRespondents || 0} คน</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </CustomCard>
  );
}
