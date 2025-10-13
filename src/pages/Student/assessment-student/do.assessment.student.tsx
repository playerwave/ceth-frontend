import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useAssessmentStore } from "../../../stores/Student/assessment.store.student";
import { AssessmentResponse } from "../../../types/assessment/assessment.type";

import SatisfactionQuestions from "./components/satisfactionQuestions";
import MultipleChoice from "./components/multipleChoice";
import ChoiceAnswer from "./components/choiceAnswer";
import OpenEndedQuestion from "./components/openEndedQuestion";
import Loading from "../../../components/Loading";

function AssessmentStudent() {
  const { activityId } = useParams<{ activityId?: string }>();
  const navigate = useNavigate();
  
  const { 
    assessment, 
    loading, 
    error, 
    submitting, 
    submitError,
    fetchAssessmentByActivityId, 
    submitAssessment,
    clearError,
    clearSubmitError 
  } = useAssessmentStore();
  
  const [activity, setActivity] = useState<any>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // เก็บคำตอบทั้งหมด
  const [answers, setAnswers] = useState<AssessmentResponse["answers"]>({
    satisfaction: {},
    multiple_choice: {},
    single_choice: {},
    open_ended: {},
  });

  // ดึงข้อมูล assessment จาก API
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!activityId) {
        clearError();
        return;
      }

      try {
        setUsingFallbackData(false);
        console.log("🔄 [AssessmentStudent] Fetching assessment for activity:", activityId);
        
        // ใช้ store แทนการเรียก service โดยตรง
        await fetchAssessmentByActivityId(activityId);
      } catch (err) {
        console.error("❌ [AssessmentStudent] Error fetching assessment:", err);
      }
    };

    fetchAssessment();
  }, [activityId, fetchAssessmentByActivityId, clearError]);

  // แยก useEffect สำหรับจัดการ assessment data
  useEffect(() => {
    if (assessment) {
      // ตรวจสอบว่าเป็น fallback data หรือไม่ (ดูจาก description ที่มีคำว่า "Mock Data")
      const isFallbackData = assessment.assessment_description?.includes("Mock Data") || false;
      setUsingFallbackData(isFallbackData);
      
      console.log("✅ [AssessmentStudent] Assessment loaded:", assessment);
      console.log("🔍 [AssessmentStudent] Activity name from backend:", (assessment as any).activity_name);
      console.log("🔍 [AssessmentStudent] Using fallback data:", isFallbackData);
      
      // ตั้งค่า activity จาก assessment data
      setActivity({ activity_name: (assessment as any).activity_name });
    }
  }, [assessment]);

  // Handler functions
  const handleSatisfactionChange = (questionId: number, value: string) => {
    console.log("🔄 [AssessmentStudent] Satisfaction change:", { questionId, value });
    setAnswers((prev) => ({
      ...prev,
      satisfaction: { ...prev.satisfaction, [questionId]: value },
    }));
  };

  const handleMultipleChoiceChange = (questionId: number, option: string) => {
    console.log("🔄 [AssessmentStudent] Multiple choice change:", { questionId, option });
    setAnswers((prev) => {
      const current = prev.multiple_choice[questionId] || [];
      const isChecked = current.includes(option);
      const newAnswers = isChecked 
        ? current.filter((o) => o !== option)
        : [...current, option];
      
      return {
        ...prev,
        multiple_choice: { ...prev.multiple_choice, [questionId]: newAnswers },
      };
    });
  };

  const handleSingleChoiceChange = (questionId: number, value: string) => {
    console.log("🔄 [AssessmentStudent] Single choice change:", { questionId, value });
    setAnswers((prev) => ({
      ...prev,
      single_choice: { ...prev.single_choice, [questionId]: value },
    }));
  };

  const handleOpenEndedChange = (questionId: number, value: string) => {
    console.log("🔄 [AssessmentStudent] Open ended change:", { questionId, value });
    setAnswers((prev) => ({
      ...prev,
      open_ended: { ...prev.open_ended, [questionId]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!assessment || submitting) return;
    
    const payload: AssessmentResponse = {
      assessment_id: assessment.assessment_id,
      answers,
    };
    
    try {
      console.log("📤 [AssessmentStudent] Submit payload:", payload);
      
      // ใช้ store แทนการเรียก service โดยตรง
      await submitAssessment(payload);
      
      alert("ส่งคำตอบเรียบร้อยแล้ว!");
      
      // Redirect กลับไปหน้า main-student
      navigate("/main-student");
    } catch (error) {
      console.error("❌ [AssessmentStudent] Error submitting assessment:", error);
      alert("เกิดข้อผิดพลาดในการส่งคำตอบ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // กรองคำถามตามประเภท (ป้องกัน undefined error)
  const questions = assessment?.questions || [];
  const satisfactionQuestions = questions.filter((q) => q.question_type === "satisfaction");
  const multipleChoiceQuestions = questions.filter((q) => q.question_type === "multiple_choice");
  const singleChoiceQuestions = questions.filter((q) => q.question_type === "single_choice");
  const openEndedQuestions = questions.filter((q) => q.question_type === "open_ended");

  // Debug logs
  console.log("🔍 [AssessmentStudent] Assessment data:", assessment);
  console.log("🔍 [AssessmentStudent] Satisfaction questions:", satisfactionQuestions);
  console.log("🔍 [AssessmentStudent] Multiple choice questions:", multipleChoiceQuestions);
  console.log("🔍 [AssessmentStudent] Single choice questions:", singleChoiceQuestions);
  console.log("🔍 [AssessmentStudent] Open ended questions:", openEndedQuestions);
  console.log("🔍 [AssessmentStudent] Current answers:", answers);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="ml-25 mr-5 flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
        <button 
          onClick={clearError}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="ml-25 mr-5 flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">ไม่พบข้อมูลการประเมิน</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-center mb-2">
              แบบประเมินกิจกรรม {activity?.activity_name || "กิจกรรม"}
            </h1>
        {assessment.assessment_description && (
          <p className="text-center text-gray-600">{assessment.assessment_description}</p>
        )}
        <p className="text-center text-sm text-gray-500 mt-2">
          Activity ID: {activityId || "ไม่ระบุ"}
        </p>
        
        {usingFallbackData && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  ใช้ข้อมูลตัวอย่าง (Backend ไม่พร้อมใช้งาน)
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>ขณะนี้ระบบใช้ข้อมูลตัวอย่างเนื่องจาก backend มีปัญหาในการเชื่อมต่อ กรุณาติดต่อผู้ดูแลระบบ</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    เกิดข้อผิดพลาดในการส่งคำตอบ
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{submitError}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={clearSubmitError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* แสดงตาม sections ถ้ามี หรือแสดงแบบเดิมถ้าไม่มี sections */}
      {assessment.sections && assessment.sections.length > 0 ? (
        // แสดงตาม sections
        assessment.sections
          .sort((a: any, b: any) => a.section_order - b.section_order)
          .map((section: any) => {
            // กรองคำถามใน section ตามประเภท
            const sectionSatisfactionQuestions = section.questions.filter((q: any) => q.question_type === "satisfaction");
            const sectionMultipleChoiceQuestions = section.questions.filter((q: any) => q.question_type === "multiple_choice");
            const sectionSingleChoiceQuestions = section.questions.filter((q: any) => q.question_type === "single_choice");
            const sectionOpenEndedQuestions = section.questions.filter((q: any) => q.question_type === "open_ended");

            return (
              <div key={section.section_id} className="mb-8">

                {sectionSatisfactionQuestions.length > 0 && (
                  <>
                    <SatisfactionQuestions
                      questions={sectionSatisfactionQuestions}
                      answers={answers.satisfaction}
                      onChange={handleSatisfactionChange}
                    />
                    <br />
                  </>
                )}

                {sectionMultipleChoiceQuestions.length > 0 && (
                  <>
                    <MultipleChoice
                      title={`คำถามแบบหลายตัวเลือก - ${section.section_name}`}
                      questions={sectionMultipleChoiceQuestions}
                      answers={answers.multiple_choice}
                      onToggle={handleMultipleChoiceChange}
                    />
                    <br />
                  </>
                )}

                {sectionSingleChoiceQuestions.length > 0 && (
                  <>
                    <ChoiceAnswer
                      title={`คำถามแบบตัวเลือกเดียว - ${section.section_name}`}
                      questions={sectionSingleChoiceQuestions}
                      answers={answers.single_choice}
                      onChange={handleSingleChoiceChange}
                    />
                    <br />
                  </>
                )}

                {sectionOpenEndedQuestions.length > 0 && (
                  <>
                    <OpenEndedQuestion
                      title={`คำถามปลายเปิด - ${section.section_name}`}
                      questions={sectionOpenEndedQuestions}
                      answers={answers.open_ended}
                      onChange={handleOpenEndedChange}
                    />
                    <br />
                  </>
                )}
              </div>
            );
          })
      ) : (
        // แสดงแบบเดิม (fallback)
        <>
          {satisfactionQuestions.length > 0 && (
            <>
              <SatisfactionQuestions
                questions={satisfactionQuestions}
                answers={answers.satisfaction}
                onChange={handleSatisfactionChange}
              />
              <br />
            </>
          )}

          {multipleChoiceQuestions.length > 0 && (
            <>
              <MultipleChoice
                title="คำถามแบบหลายตัวเลือก"
                questions={multipleChoiceQuestions}
                answers={answers.multiple_choice}
                onToggle={handleMultipleChoiceChange}
              />
              <br />
            </>
          )}

          {singleChoiceQuestions.length > 0 && (
            <>
              <ChoiceAnswer
                title="คำถามแบบตัวเลือกเดียว"
                questions={singleChoiceQuestions}
                answers={answers.single_choice}
                onChange={handleSingleChoiceChange}
              />
              <br />
            </>
          )}

          {openEndedQuestions.length > 0 && (
            <>
              <OpenEndedQuestion
                title="คำถามปลายเปิด"
                questions={openEndedQuestions}
                answers={answers.open_ended}
                onChange={handleOpenEndedChange}
              />
              <br />
            </>
          )}
        </>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit} 
          disabled={submitting}
          className={submitting ? "opacity-50 cursor-not-allowed" : ""}
        >
          {submitting ? "กำลังส่ง..." : "ส่งคำตอบ"}
        </Button>
      </div>
      </div>
    </div>
  );
}

export default AssessmentStudent;