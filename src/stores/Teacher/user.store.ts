import { create } from "zustand";
import { Student } from "../api/user.api";
import userService from "../../service/Teacher/user.service";

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

        console.log(`✅ [STORE] Setting ${data.length} students in store`);
        set({ 
          students: data, 
          filteredStudents: data,
          loading: false 
        });
        console.log(`✅ [STORE] fetchStudentsByDepartment: Retrieved ${data.length} students for department ${departmentCode}`);
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
    
    const filtered = sourceData.filter(student => 
      years.includes(student.year) && selectedStatuses.includes(student.status)
    );
    
    set({ filteredStudents: filtered });
  },
  //----------------------------------------------------------------

  //--------------------- Filter Students by Status -------------------------
  filterStudentsByStatus: (statuses: string[]) => {
    console.log("🔍 Filtering students by statuses:", statuses);
    set({ selectedStatuses: statuses });
    
    const { students, searchResults, selectedYears } = get();
    const sourceData = searchResults || students;
    
    const filtered = sourceData.filter(student => 
      selectedYears.includes(student.year) && statuses.includes(student.status)
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

}));
