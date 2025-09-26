// src/service/Teacher/user.service.ts
import axiosInstance from "../../libs/axios";
import { Student } from "../../stores/api/user.api";
import { ApiStudent, ApiDepartment } from "../../stores/api/user.api";
import { mapApiToStudents, mapApiToDepartments } from "../../stores/mapper/user.mapper";

// Base path
const TEACHER_USER_PATH = "/teacher/user-management";

//--------------------- Fetch Students by Department -------------------------
export const fetchStudentsByDepartment = async (departmentCode: string): Promise<Student[]> => {
  try {
    console.log("📥 Fetching students for department:", departmentCode);
    
    const response = await axiosInstance.get<any>(
      `${TEACHER_USER_PATH}/students/${departmentCode}`
    );
    
    console.log("🔍 Raw API response:", response.data);
    
    // ✅ Handle response structure from backend
    let studentsData: ApiStudent[] = [];
    
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      // Backend returns { success: true, data: [...], department: 'SE', count: 374 }
      studentsData = response.data.data;
      console.log(`📊 Backend returned ${studentsData.length} students for department ${departmentCode}`);
    } else if (Array.isArray(response.data)) {
      // Direct array response
      studentsData = response.data;
      console.log(`📊 Direct array response with ${studentsData.length} students`);
    } else {
      console.warn("⚠️ Invalid response structure from API:", response.data);
      return [];
    }
    
    // ✅ Debug: Log first student data structure before mapping
    console.log("🔍 [SERVICE] First student before mapping:", studentsData[0]);
    console.log("🔍 [SERVICE] First student keys:", studentsData[0] ? Object.keys(studentsData[0]) : 'No data');
    console.log("🔍 [SERVICE] First student year:", studentsData[0]?.year, typeof studentsData[0]?.year);
    console.log("🔍 [SERVICE] First student risk_status:", studentsData[0]?.risk_status);
    
    const students = mapApiToStudents(studentsData);
    
    // ✅ Debug: Log first student after mapping
    console.log("🔍 [SERVICE] First student after mapping:", students[0]);
    console.log("🔍 [SERVICE] First student year:", students[0]?.year, typeof students[0]?.year);
    console.log("🔍 [SERVICE] First student risk_status:", students[0]?.risk_status);
    
    console.log(`✅ fetchStudentsByDepartment: Retrieved ${students.length} students for department ${departmentCode}`);
    return students;
  } catch (error) {
    console.error("❌ fetchStudentsByDepartment error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        console.warn("⚠️ Network error, returning empty array");
        return [];
      }
    }
    
    // ✅ Re-throw error เพื่อให้ store จัดการ
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Fetch All Students -------------------------
export const fetchAllStudents = async (): Promise<Student[]> => {
  try {
    console.log("📥 Fetching all students...");
    
    const response = await axiosInstance.get<ApiStudent[]>(
      `${TEACHER_USER_PATH}/students`
    );
    
    // ✅ ตรวจสอบ response data
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("⚠️ Invalid response data from API:", response.data);
      return [];
    }
    
    const students = mapApiToStudents(response.data);
    console.log(`✅ fetchAllStudents: Retrieved ${students.length} students`);
    return students;
  } catch (error) {
    console.error("❌ fetchAllStudents error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        console.warn("⚠️ Network error, returning empty array");
        return [];
      }
    }
    
    // ✅ Re-throw error เพื่อให้ store จัดการ
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Fetch All Departments -------------------------
export const fetchAllDepartments = async (): Promise<any[]> => {
  try {
    console.log("📥 Fetching all departments...");
    
    const response = await axiosInstance.get<ApiDepartment[]>(
      `${TEACHER_USER_PATH}/departments`
    );
    
    // ✅ ตรวจสอบ response data
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("⚠️ Invalid response data from API:", response.data);
      return [];
    }
    
    const departments = mapApiToDepartments(response.data);
    console.log(`✅ fetchAllDepartments: Retrieved ${departments.length} departments`);
    return departments;
  } catch (error) {
    console.error("❌ fetchAllDepartments error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        console.warn("⚠️ Network error, returning empty array");
        return [];
      }
    }
    
    // ✅ Re-throw error เพื่อให้ store จัดการ
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Search Students -------------------------
export const searchStudents = async (searchTerm: string): Promise<Student[]> => {
  try {
    console.log("🔍 Searching students with term:", searchTerm);
    
    const response = await axiosInstance.get<ApiStudent[]>(
      `${TEACHER_USER_PATH}/students/search?q=${encodeURIComponent(searchTerm)}`
    );
    
    // ✅ ตรวจสอบ response data
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("⚠️ Invalid response data from API:", response.data);
      return [];
    }
    
    const students = mapApiToStudents(response.data);
    console.log(`✅ searchStudents: Found ${students.length} students matching "${searchTerm}"`);
    return students;
  } catch (error) {
    console.error("❌ searchStudents error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        console.warn("⚠️ Network error, returning empty array");
        return [];
      }
    }
    
    // ✅ Re-throw error เพื่อให้ store จัดการ
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Upload Students -------------------------
export const uploadStudents = async (file: File): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("📤 [SERVICE] Uploading students file:", file.name);
    
    // ✅ Validate file
    if (!file) {
      return { success: false, message: "กรุณาเลือกไฟล์" };
    }
    
    // ✅ Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: "รองรับเฉพาะไฟล์ .xlsx, .xls, .csv เท่านั้น" };
    }
    
    // ✅ Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, message: "ขนาดไฟล์ต้องไม่เกิน 10 MB" };
    }
    
    // ✅ Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // ✅ Upload file
    const response = await axiosInstance.post(
      `${TEACHER_USER_PATH}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log("🔍 [SERVICE] Upload response:", response.data);
    
    if (response.data && response.data.success) {
      return { 
        success: true, 
        message: response.data.message || "อัปโหลดไฟล์สำเร็จ" 
      };
    } else {
      return { 
        success: false, 
        message: response.data.message || "อัปโหลดไฟล์ไม่สำเร็จ" 
      };
    }
  } catch (error) {
    console.error("❌ [SERVICE] Upload error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        return { success: false, message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้" };
      }
      if (error.message.includes('timeout')) {
        return { success: false, message: "การอัปโหลดใช้เวลานานเกินไป" };
      }
    }
    
    return { success: false, message: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" };
  }
};
//----------------------------------------------------------------

//--------------------- Export Service -----------------------------
// เป็นการทำ Object literal เพื่อรวมฟังก์ชันทั้งหมดที่เกี่ยวข้องกับ user management
const userService = {
  fetchStudentsByDepartment,
  fetchAllStudents,
  fetchAllDepartments,
  searchStudents,
  uploadStudents,
};
//----------------------------------------------------------------

export default userService;
