import { create } from "zustand";
import { Student } from "@/types/student.type";
import userService from "@service/Teacher/student.service";

interface UserStore {
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
  searchResults: Student[] | null;
  filteredStudents: Student[];
  selectedYears: number[];
  selectedStatuses: string[];
  
  // Functions
  fetchStudentsByDepartment: (departmentCode: string) => Promise<void>;
  fetchAllStudents: () => Promise<void>;
  selectStudent: (id: string) => void;
  clearSelectedStudent: () => void;
  searchStudents: (searchTerm: string) => Promise<void>;
  filterStudentsByYear: (years: number[]) => void;
  filterStudentsByStatus: (statuses: string[]) => void;
  clearFilters: () => void;
  uploadStudents: (file: File) => Promise<{ success: boolean; message: string }>;
  updateGradeYear: () => Promise<{ success: boolean; message: string; data?: any }>;
  rollbackGradeYear: () => Promise<{ success: boolean; message: string; data?: any }>;
  exportStudentsToExcel: () => Promise<{ success: boolean; message: string }>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
  searchResults: null,
  filteredStudents: [],
  selectedYears: [1, 2, 3, 4],
  selectedStatuses: ['Normal', 'Risk'],

  //------------------------------------------- Role: Teacher --------------------------------------------------

  //--------------------- Fetch Students by Department -------------------------
  fetchStudentsByDepartment: async (departmentCode: string) => {
    console.log("📥 [STORE] Fetching students for department:", departmentCode);
    set({ loading: true, error: null });
    
    let retries = 3;
    while (retries > 0) {
      try {
        const data = await userService.fetchStudentsByDepartment(departmentCode);
        
        console.log("🔍 [STORE] Data received from service:", data);
        console.log("🔍 [STORE] Data type:", typeof data);
        console.log("🔍 [STORE] Is array:", Array.isArray(data));
        console.log("🔍 [STORE] Data length:", data?.length);
        
        // ✅ ตรวจสอบข้อมูลที่ได้
        if (!data || !Array.isArray(data)) {
          console.warn("⚠️ [STORE] Invalid data received from service:", data);
          if (retries > 1) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          set({ students: [], filteredStudents: [], loading: false });
          return;
        }

        // ✅ Debug: Log first few students to see data structure
        console.log("🔍 [STORE] First 3 students data structure:", data.slice(0, 3));
        console.log("🔍 [STORE] Sample student keys:", data[0] ? Object.keys(data[0]) : 'No data');
        
        // ✅ Normalize data from backend: derive year from grade_id, fix missing values
        const validStudents = data.filter(student => {
          if (!student) {
            console.warn("⚠️ [STORE] Null student found");
            return false;
          }
          
          // ✅ ให้ mapper เป็นแหล่งความจริงของ year
          // หากปีไม่เป็นตัวเลขจริง ๆ ค่อยพยายามอิงจาก grade_id
          if (typeof (student as any).year !== 'number') {
            student.year = Number((student as any).grade_id) || 1;
          }
          
          // ✅ Fix missing risk_status - use default value 'Normal' if undefined
          if (!student.risk_status) {
            console.warn("⚠️ [STORE] Missing risk_status, setting default:", { 
              student_id: student.student_id, 
              risk_status: student.risk_status 
            });
            student.risk_status = 'Normal'; // Set default risk status
          }
          
          return true;
        });
        
        console.log(`✅ [STORE] Valid students: ${validStudents.length} out of ${data.length}`);
        console.log(`✅ [STORE] Setting ${validStudents.length} valid students in store`);
        
        set({ 
          students: validStudents, 
          filteredStudents: validStudents,
          loading: false 
        });
        console.log(`✅ [STORE] fetchStudentsByDepartment: Retrieved ${validStudents.length} valid students for department ${departmentCode}`);
        return;
      } catch (err) {
        retries--;
        console.error(`❌ [STORE] fetchStudentsByDepartment error (retries left: ${retries}):`, err);
        
        if (retries === 0) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch students";
          set({ 
            error: errorMessage,
            loading: false 
          });
          return;
        }
        
        // ✅ รอสักครู่ก่อนลองใหม่
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch All Students -------------------------
  fetchAllStudents: async () => {
    console.log("📥 Fetching all students...");
    set({ loading: true, error: null });
    
    let retries = 3;
    while (retries > 0) {
      try {
        const data = await userService.fetchAllStudents();
        
        // ✅ ตรวจสอบข้อมูลที่ได้
        if (!data || !Array.isArray(data)) {
          console.warn("⚠️ Invalid data received from service:", data);
          if (retries > 1) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          set({ students: [], loading: false });
          return;
        }

        set({ 
          students: data, 
          filteredStudents: data,
          loading: false 
        });
        console.log(`✅ fetchAllStudents: Retrieved ${data.length} students`);
        return;
      } catch (err) {
        retries--;
        console.error(`❌ fetchAllStudents error (retries left: ${retries}):`, err);
        
        if (retries === 0) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch students";
          set({ 
            error: errorMessage,
            loading: false 
          });
          return;
        }
        
        // ✅ รอสักครู่ก่อนลองใหม่
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },
  //----------------------------------------------------------------

  //--------------------- Select Student -------------------------
  selectStudent: (id: string) => {
    console.log("📥 Selecting student with ID:", id);
    const student = get().students.find(s => s.student_id === id);
    set({ selectedStudent: student || null });
  },
  //----------------------------------------------------------------

  clearSelectedStudent: () => set({ selectedStudent: null }),
  //----------------------------------------------------------------

  //--------------------- Search Students -------------------------
  searchStudents: async (searchTerm: string) => {
    console.log("🔍 Searching students with term:", searchTerm);
    if (!searchTerm.trim()) {
      set({ searchResults: null, filteredStudents: get().students });
      return;
    }

    set({ loading: true, error: null });
    try {
      const results = await userService.searchStudents(searchTerm);
      set({ 
        searchResults: results,
        filteredStudents: results,
        loading: false 
      });
    } catch (error) {
      console.error("❌ Error searching students:", error);
      set({ 
        error: "ไม่สามารถค้นหานิสิตได้",
        loading: false 
      });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Filter Students by Year -------------------------
  filterStudentsByYear: (years: number[]) => {
    console.log("🔍 Filtering students by years:", years);
    set({ selectedYears: years });
    
    const { students, searchResults, selectedStatuses } = get();
    const sourceData = searchResults || students;
    
    console.log("🔍 Filter data:", {
      totalStudents: sourceData.length,
      selectedYears: years,
      selectedStatuses,
      firstStudent: sourceData[0]
    });
    
    // ✅ Normalize: ใช้ year จาก mapper; ถ้าไม่ใช่ตัวเลขค่อยอิงจาก grade_id และตั้งค่า risk_status หากว่าง
    const validStudents = sourceData.filter(student => {
      if (!student) return false;
      
      // ✅ อย่าทับ year ที่ mapper คำนวณมาแล้ว
      if (typeof (student as any).year !== 'number') {
        student.year = Number((student as any).grade_id) || 1;
      }
      
      // ✅ Fix missing risk_status - use default value 'Normal' if undefined
      if (!student.risk_status) {
        student.risk_status = 'Normal'; // Set default risk status
      }
      
      return true;
    });
    
    console.log(`🔍 Valid students: ${validStudents.length} out of ${sourceData.length}`);
    
    // ✅ Debug: Show year distribution
    const yearDistribution = validStudents.reduce((acc, student) => {
      acc[student.year] = (acc[student.year] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });
    console.log("🔍 Year distribution:", yearDistribution);
    
    const filtered = validStudents.filter(student => 
      years.includes(student.year) && selectedStatuses.includes(student.risk_status)
    );
    
    console.log("🔍 Filtered result:", {
      filteredCount: filtered.length,
      yearBreakdown: years.map(year => ({
        year,
        count: validStudents.filter(s => s.year === year).length
      }))
    });
    
    set({ filteredStudents: filtered });
  },
  //----------------------------------------------------------------

  //--------------------- Filter Students by Status -------------------------
  filterStudentsByStatus: (statuses: string[]) => {
    console.log("🔍 Filtering students by statuses:", statuses);
    set({ selectedStatuses: statuses });
    
    const { students, searchResults, selectedYears } = get();
    const sourceData = searchResults || students;
    
    // ✅ Normalize: ใช้ year จาก mapper; ถ้าไม่ใช่ตัวเลขค่อยอิงจาก grade_id และตั้งค่า risk_status หากว่าง
    const validStudents = sourceData.filter(student => {
      if (!student) return false;
      
      // ✅ อย่าทับ year ที่ mapper คำนวณมาแล้ว
      if (typeof (student as any).year !== 'number') {
        student.year = Number((student as any).grade_id) || 1;
      }
      
      // ✅ Fix missing risk_status - use default value 'Normal' if undefined
      if (!student.risk_status) {
        student.risk_status = 'Normal'; // Set default risk status
      }
      
      return true;
    });
    
    const filtered = validStudents.filter(student => 
      selectedYears.includes(student.year) && statuses.includes(student.risk_status)
    );
    
    set({ filteredStudents: filtered });
  },
  //----------------------------------------------------------------

  //--------------------- Clear Filters -------------------------
  clearFilters: () => {
    console.log("🔄 Clearing all filters");
    set({ 
      searchResults: null,
      filteredStudents: get().students,
      selectedYears: [1, 2, 3, 4],
      selectedStatuses: ['Normal', 'Risk']
    });
  },
  //----------------------------------------------------------------

  //--------------------- Upload Students -------------------------
  uploadStudents: async (file: File) => {
    console.log("📤 [STORE] Uploading students file:", file.name);
    set({ loading: true, error: null });
    
    try {
      const result = await userService.uploadStudents(file);
      
      if (result.success) {
        console.log("✅ [STORE] Upload successful:", result.message);
        set({ loading: false });
        return { success: true, message: result.message };
      } else {
        console.error("❌ [STORE] Upload failed:", result.message);
        set({ loading: false, error: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("❌ [STORE] Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "ไม่สามารถอัปโหลดไฟล์ได้";
      set({ loading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },
  //----------------------------------------------------------------

  //--------------------- Update Grade Year -------------------------
  updateGradeYear: async () => {
    console.log("🔄 [STORE] Updating grade year...");
    set({ loading: true, error: null });
    
    try {
      const result = await userService.updateGradeYear();
      
      if (result.success) {
        console.log("✅ [STORE] Grade year update successful:", result.message);
        console.log("📊 [STORE] Update data:", result.data);
        set({ loading: false });
        return { 
          success: true, 
          message: result.message,
          data: result.data
        };
      } else {
        console.error("❌ [STORE] Grade year update failed:", result.message);
        set({ loading: false, error: result.message });
        return { 
          success: false, 
          message: result.message 
        };
      }
    } catch (error) {
      console.error("❌ [STORE] Grade year update error:", error);
      const errorMessage = error instanceof Error ? error.message : "ไม่สามารถอัพเดทชั้นปีได้";
      set({ loading: false, error: errorMessage });
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  },
  //----------------------------------------------------------------

  //--------------------- Rollback Grade Year -------------------------
  rollbackGradeYear: async () => {
    console.log("🔄 [STORE] Rolling back grade year...");
    set({ loading: true, error: null });
    
    try {
      const result = await userService.rollbackGradeYear();
      
      if (result.success) {
        console.log("✅ [STORE] Grade year rollback successful:", result.message);
        console.log("📊 [STORE] Rollback data:", result.data);
        set({ loading: false });
        return { 
          success: true, 
          message: result.message,
          data: result.data
        };
      } else {
        console.error("❌ [STORE] Grade year rollback failed:", result.message);
        set({ loading: false, error: result.message });
        return { 
          success: false, 
          message: result.message 
        };
      }
    } catch (error) {
      console.error("❌ [STORE] Grade year rollback error:", error);
      const errorMessage = error instanceof Error ? error.message : "ไม่สามารถย้อนกลับชั้นปีได้";
      set({ loading: false, error: errorMessage });
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  },
  //----------------------------------------------------------------

  //--------------------- Export Students to Excel -------------------------
  exportStudentsToExcel: async () => {
    console.log("📤 [STORE] Exporting students to Excel...");
    set({ loading: true, error: null });
    
    try {
      const { blob, filename } = await userService.exportStudentsToExcel();
      
      // ✅ Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      
      // ✅ Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("✅ [STORE] Export completed successfully, filename:", filename);
      set({ loading: false, error: null });
      
      return { success: true, message: "ส่งออกข้อมูลสำเร็จ" };
    } catch (error) {
      console.error("❌ [STORE] Export error:", error);
      const errorMessage = error instanceof Error ? error.message : "ไม่สามารถส่งออกข้อมูลได้";
      set({ loading: false, error: errorMessage });
      
      return { success: false, message: errorMessage };
    }
  },
  //----------------------------------------------------------------

}));
