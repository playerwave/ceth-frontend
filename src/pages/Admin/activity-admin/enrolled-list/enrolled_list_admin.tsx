import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Admin/store_activity_info_admin";
import { useEnrolledStudentStore } from "../../../../stores/Admin/store_enrolled_student_admin";

import EnrolledListHeader from "./components/EnrolledListHeader";
import EnrolledListFilter from "./components/EnrolledListFilter";
import EnrolledListTable from "./components/EnrolledListTable";
import EnrolledListFooter from "./components/EnrolledListFooter";

export default function EnrolledListAdmin() {
  const { id } = useParams<{ id: string }>();
  const activityId = Number(id);
  const navigate = useNavigate();

  const { activity, fetchActivity, activityLoading } = useActivityStore();
  const { enrolledStudents, fetchEnrolledStudents } = useEnrolledStudentStore();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    if (!isNaN(activityId) && activityId > 0) {
      fetchActivity(activityId);
    }
  }, [activityId, fetchActivity]);

  useEffect(() => {
    if (activity && parseInt(activity.id) === activityId) {
      fetchEnrolledStudents(activityId);
    }
  }, [activity, activityId, fetchEnrolledStudents]);

  const filteredStudents = enrolledStudents.filter((student) => {
    return true; // ใส่เงื่อนไขฟิลเตอร์ถ้าต้องการ
  });

  return (
    <div className="p-6 w-320 h-230 mx-auto">
      {/* ส่งข้อมูลกิจกรรมไปยัง EnrolledListFilter */}
      <EnrolledListHeader />

      <div className="p-0 w-full h-[510px] border border-gray-300 shadow-md rounded-lg flex flex-col">
        <EnrolledListFilter
          selectedDepartments={selectedDepartments}
          setSelectedDepartments={setSelectedDepartments}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          activity={activity} // ส่งข้อมูลกิจกรรมไปยัง EnrolledListFilter
        />

        <div className="p-0 w-full h-[510px] border border-gray-300 shadow-md rounded-lg flex flex-col">
          <EnrolledListTable
            activityLoading={activityLoading}
            enrolledStudents={filteredStudents}
            filteredStudents={filteredStudents} // ส่ง filteredStudents ให้ Table
            activity={activity} // ส่ง activity ให้ Table
          />

          <EnrolledListFooter />
        </div>
      </div>
    </div>
  );
}
