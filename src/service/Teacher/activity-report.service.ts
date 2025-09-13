import axiosInstance from "../../libs/axios";

// Types สำหรับข้อมูลที่ได้รับจาก API
export interface DepartmentData {
  name: string;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  total: number;
  percent: string;
}

export interface LegendData {
  label: string;
  count: number;
  percent: string;
  color: string;
}

export interface EnrollmentByDepartmentResponse {
  departments: DepartmentData[];
  legend: LegendData[];
  totalStudents: number;
  totalText: string;
}

export interface ParticipationData {
  label: string;
  count: number;
  percent: string;
  color: string;
}

export interface StudentStatusData {
  label: string;
  count: number;
  percent: string;
  color: string;
}

export interface ParticipationStatusResponse {
  totalRegistered: number;
  fullTimeAttendance: number;
  partTimeAttendance: number;
  noParticipation: number;
  normalStatus: number;
  riskStatus: number;
  registeredInfo: ParticipationData;
  participationData: ParticipationData[];
  studentStatusData: StudentStatusData[];
}

export interface AssessmentQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  choices: Array<{
    choiceId: number;
    choiceText: string;
  }>;
  totalAnswers: number;
  choiceStats?: Array<{
    choiceText: string;
    count: number;
    percentage: string;
  }>;
  average?: number;
}

export interface AssessmentTopic {
  topicId: number;
  topicName: string;
  questions: AssessmentQuestion[];
  pieData: Array<{
    name: string;
    value: string;
    color: string;
  }>;
  totalRespondents: number;
}

export interface AssessmentDataResponse {
  topics: AssessmentTopic[];
}

class ActivityReportService {
  /**
   * ดึงข้อมูลจำนวนนิสิตที่ลงทะเบียนแยกตามสาขาและชั้นปี
   */
  async getEnrollmentByDepartment(activityId: string | number): Promise<EnrollmentByDepartmentResponse> {
    try {
      console.log("📊 [ActivityReportService] Getting enrollment by department for activity:", activityId);
      
      const response = await axiosInstance.get(`/teacher/activity-report/${activityId}/enrollment-by-department`);
      
      console.log("✅ [ActivityReportService] Enrollment data received:", response.data.data);
      
      return response.data.data;
    } catch (error) {
      console.error("❌ [ActivityReportService] Error getting enrollment by department:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get enrollment by department: ${errorMessage}`);
    }
  }

  /**
   * ดึงข้อมูลสถานะการเข้าร่วมกิจกรรมและสถานะนิสิต
   */
  async getParticipationStatus(activityId: string | number): Promise<ParticipationStatusResponse> {
    try {
      console.log("📊 [ActivityReportService] Getting participation status for activity:", activityId);
      
      const response = await axiosInstance.get(`/teacher/activity-report/${activityId}/participation-status`);
      
      console.log("✅ [ActivityReportService] Participation status received:", response.data.data);
      
      return response.data.data;
    } catch (error) {
      console.error("❌ [ActivityReportService] Error getting participation status:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get participation status: ${errorMessage}`);
    }
  }

  /**
   * ดึงข้อมูลแบบประเมินและผลการตอบ
   */
  async getAssessmentData(activityId: string | number): Promise<AssessmentTopic[]> {
    try {
      console.log("📊 [ActivityReportService] Getting assessment data for activity:", activityId);
      
      const response = await axiosInstance.get(`/teacher/activity-report/${activityId}/assessment-data`);
      
      console.log("✅ [ActivityReportService] Assessment data received:", response.data.data);
      
      return response.data.data;
    } catch (error) {
      console.error("❌ [ActivityReportService] Error getting assessment data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get assessment data: ${errorMessage}`);
    }
  }
}

export default new ActivityReportService();
