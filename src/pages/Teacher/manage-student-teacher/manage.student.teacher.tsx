import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TabBar from "../../../components/TabBar";
import { List, Calendar } from "lucide-react";
import ListStudentTeacher from "./list-student-teacher/list.student.teacher";
import EventCoopManagement from "./event-coop-management/eventcoop.management.teacher";

const ManageStudentTeacher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "coop-schedule">("list");
  const [searchParams] = useSearchParams();
  
  // Department state
  const [departmentName, setDepartmentName] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<number>(1);

  // Department mapping
  const departmentMapping: { [key: string]: { name: string; id: number } } = {
    "SE": { name: "วิศวกรรมซอฟต์แวร์", id: 3 },
    "AAI": { name: "ปัญญาประดิษฐ์ประยุกต์", id: 2 },
    "CS": { name: "วิทยาการคอมพิวเตอร์", id: 1 },
    "IT": { name: "เทคโนโลยีสารสนเทศ", id: 4 }
  };

  // Update department when URL params change
  useEffect(() => {
    const department = searchParams.get('department');
    if (department && departmentMapping[department]) {
      setDepartmentName(departmentMapping[department].name);
      setDepartmentId(departmentMapping[department].id);
      console.log(`🔄 Department changed to: ${department} (${departmentMapping[department].name})`);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <TabBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as "list" | "coop-schedule")}
            tabs={[
              {
                id: "list",
                label: "ลิสต์",
                icon: <List className="w-4 h-4" />
              },
              {
                id: "coop-schedule",
                label: "กำหนดการสหกิจ",
                icon: <Calendar className="w-4 h-4" />
              }
            ]}
          />
        </div>

        {/* Content based on active tab */}
        {activeTab === "list" ? (
          <ListStudentTeacher />
        ) : (
          <EventCoopManagement 
            departmentId={departmentId}
            departmentName={departmentName}
          />
        )}
      </div>
    </div>
  );
};

export default ManageStudentTeacher;
