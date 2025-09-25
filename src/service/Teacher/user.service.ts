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
    
    const students = mapApiToStudents(studentsData);
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

//--------------------- Export Service -----------------------------
// เป็นการทำ Object literal เพื่อรวมฟังก์ชันทั้งหมดที่เกี่ยวข้องกับ user management
const userService = {
  fetchStudentsByDepartment,
  fetchAllStudents,
  fetchAllDepartments,
  searchStudents,
};
//----------------------------------------------------------------

export default userService;
