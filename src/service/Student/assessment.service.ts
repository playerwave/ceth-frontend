import { Assessment } from "../../types/assessment/assessment.type";

// API base URL - ควรจะมาจาก environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5090/api";

console.log("🔍 [AssessmentService] Environment check:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
});

class AssessmentService {
  /**
   * ทดสอบการเชื่อมต่อกับ backend
   * @returns Promise<boolean> - true ถ้าเชื่อมต่อได้
   */
  async testBackendConnection(): Promise<boolean> {
    try {
      // ใช้ assessment endpoint สำหรับทดสอบ
      const testUrl = `${API_BASE_URL}/student/activity/assessment/1`;
      console.log("🔍 [AssessmentService] Testing backend connection:", testUrl);
      
      const response = await fetch(testUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      console.log("✅ [AssessmentService] Backend connection test result:", response.ok);
      return response.ok;
    } catch (error) {
      console.log("❌ [AssessmentService] Backend connection test failed:", error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * ดึงข้อมูล assessment ตาม activity_id
   * @param activityId - ID ของ activity
   * @returns Promise<Assessment> - ข้อมูล assessment
   */
  async getAssessmentByActivityId(activityId: string | number): Promise<Assessment> {
    try {
      console.log("🔄 [AssessmentService] Fetching assessment for activity:", activityId);
      console.log("🔄 [AssessmentService] API_BASE_URL:", API_BASE_URL);
      
      // ใช้ assessment endpoint ที่ถูกต้อง
      const fullUrl = `${API_BASE_URL}/student/activity/assessment/${activityId}`;
      console.log("🔄 [AssessmentService] Making request to:", fullUrl);
      
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // เพิ่ม Authorization header ถ้าต้องการ
          // "Authorization": `Bearer ${token}`,
        },
        credentials: "include", // สำหรับ cookies
      });

      console.log("📡 [AssessmentService] Response status:", response.status);
      console.log("📡 [AssessmentService] Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [AssessmentService] Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ [AssessmentService] Assessment data received:", data);
      
      // ตรวจสอบว่าเป็นข้อมูล assessment หรือไม่
      if (data && (data.assessment_id || data.questions)) {
        return data as Assessment;
      } else if (data && data.length > 0 && data[0].assessment_id) {
        return data[0] as Assessment;
      } else {
        throw new Error("ไม่พบข้อมูล assessment");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
      const errorName = error instanceof Error ? error.name : 'Unknown';
      
      console.error("❌ [AssessmentService] Error fetching assessment:", error);
      console.error("❌ [AssessmentService] Error type:", errorType);
      console.error("❌ [AssessmentService] Error message:", errorMessage);
      
      // ตรวจสอบประเภทของ error
      if (errorName === 'TypeError' && errorMessage.includes('Failed to fetch')) {
        console.log("🔍 [AssessmentService] Network connectivity issue detected");
        console.log("🔍 [AssessmentService] Possible causes:");
        console.log("  - Backend server is not running");
        console.log("  - CORS policy blocking the request");
        console.log("  - Network connectivity issues");
        console.log("  - Wrong API URL");
      }
      
      // Throw error instead of returning mock data
      throw new Error(`Failed to fetch assessment: ${errorMessage}`);
    }
  }



  /**
   * ส่งคำตอบ assessment ไปยัง backend
   * @param assessmentResponse - คำตอบทั้งหมด
   * @returns Promise<any> - ผลลัพธ์จากการส่ง
   */
  async submitAssessment(assessmentResponse: {
    assessment_id: number;
    answers: {
      satisfaction: { [questionId: number]: string };
      multiple_choice: { [questionId: number]: string[] };
      single_choice: { [questionId: number]: string };
      open_ended: { [questionId: number]: string };
    };
  }): Promise<any> {
    try {
      console.log("📤 [AssessmentService] Submitting assessment:", assessmentResponse);
      
      // ดึง join_id จาก localStorage หรือ session
      const storedUser = localStorage.getItem('auth-store');
      let join_id = null;
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const studentId = parsedUser?.state?.user?.student?.students_id;
          
          if (studentId) {
            // ดึง join_id จาก API โดยใช้ student_id และ activity_id
            const activityId = window.location.pathname.split('/').pop();
            if (activityId) {
              const joinResponse = await fetch(`${API_BASE_URL}/student/activity/${activityId}/join-id/${studentId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });
              
              if (joinResponse.ok) {
                const joinData = await joinResponse.json();
                join_id = joinData.join_id;
                console.log("✅ [AssessmentService] Found join_id:", join_id);
              } else {
                console.error("❌ [AssessmentService] Failed to get join_id:", joinResponse.status);
              }
            }
          }
        } catch (error) {
          console.error("❌ [AssessmentService] Error parsing stored user:", error);
        }
      }
      
      if (!join_id) {
        throw new Error("ไม่พบข้อมูลการลงทะเบียนกิจกรรม กรุณาลงทะเบียนเข้าร่วมกิจกรรมก่อน");
      }
      
      const payload = {
        ...assessmentResponse,
        join_id: join_id
      };
      
      const response = await fetch(`${API_BASE_URL}/student/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("📡 [AssessmentService] Response status:", response.status);
      console.log("📡 [AssessmentService] Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [AssessmentService] Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ [AssessmentService] Assessment submitted successfully:", result);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ [AssessmentService] Error submitting assessment:", error);
      
      // Throw error instead of returning mock response
      throw new Error(`Failed to submit assessment: ${errorMessage}`);
    }
  }


  /**
   * ดึงข้อมูล assessment_id จาก activity_id
   * @param activityId - ID ของ activity
   * @returns Promise<number> - assessment_id
   */
  async getAssessmentIdByActivityId(activityId: string | number): Promise<number> {
    try {
      console.log("🔄 [AssessmentService] Getting assessment ID for activity:", activityId);
      
      const response = await fetch(`${API_BASE_URL}/student/activity/${activityId}/assessment-id`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ [AssessmentService] Assessment ID received:", data);
      
      return data.assessment_id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ [AssessmentService] Error getting assessment ID:", error);
      throw new Error(`Failed to get assessment ID: ${errorMessage}`);
    }
  }
}

// Export singleton instance
const assessmentService = new AssessmentService();
export default assessmentService;
