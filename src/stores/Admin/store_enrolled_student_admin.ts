import { create } from "zustand";
import { fetchEnrolledStudentsByActivityId } from "../../services/Admin/service_enrolled_student_admin";
import type { EnrolledStudent } from "../../types/Admin/type_enrolled_list_admin";

export const useEnrolledStudentStore = create<{
  enrolledStudents: EnrolledStudent[];
  enrolledLoading: boolean;
  enrolledError: string | null;
  fetchEnrolledStudents: (activityId: number) => Promise<void>;
}>((set) => {

  // map function อยู่ในนี้เลย
  const mapEnrolledStudentData = (raw: any): EnrolledStudent => ({
    id: raw.studentid,
    name: raw.fullname,
    department: raw.department || "SE",
    status: raw.riskstatus === "Low" ? "normal" : "risk",
    checkIn: "No",
    checkOut: "No",
    evaluated: "No",
    selectedfood: raw.selectedfood,
  });

  return {
    enrolledStudents: [],
    enrolledLoading: false,
    enrolledError: null,

    fetchEnrolledStudents: async (activityId: number) => {
      set({ enrolledLoading: true, enrolledError: null });
      try {
        const res = await fetchEnrolledStudentsByActivityId(activityId);
        const mapped = res.map(mapEnrolledStudentData);
        set({ enrolledStudents: mapped, enrolledLoading: false });
      } catch (error) {
        console.error("❌ Error fetching enrolled students:", error);
        set({ enrolledStudents: [], enrolledLoading: false, enrolledError: "โหลดข้อมูลนิสิตล้มเหลว" });
      }
    },
  };
});
