import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "@/components/Card";
import DepartmentCard from "./components/departmentCard";
import Button from "@/components/Button";
import UploadStudentsDialog from "./components/uploadStudentsDialog";
import { useUserStore } from "@/stores/Teacher/student.store";

const UserDepartment: React.FC = () => {
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const departments = [
    { name: "Software Engineering", code: "SE" },
    { name: "Applied Artificial Intelligence", code: "AAI" },
    { name: "Computer Science", code: "CS" },
    { name: "Information Technology", code: "IT" },
  ];

  const handleDepartmentClick = (departmentCode: string) => {
    console.log(`Clicked department: ${departmentCode}`);
    // Navigate to list user teacher page with department code
    navigate(`/list-user-teacher?department=${departmentCode}`);
  };

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const { uploadStudents } = useUserStore();

  const handleFileUpload = async (file: File) => {
    console.log("Uploading file:", file.name);
    try {
      const result = await uploadStudents(file);
      if (result.success) {
        console.log("Upload successful:", result.message);
      } else {
        console.error("Upload failed:", result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleCloseDialog = () => {
    setUploadDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-black-600 text-center mb-8">
          จัดการนิสิต
        </h1>

<div className="mb-10 flex justify-end">
<Button onClick={handleUploadClick}>อัพโหลดข้อมูลนิสิต</Button>
</div>

        {/* Main Card Container */}
        <CustomCard className="p-8" width={"100%"} minHeight={"700px"}>
          {/* Department Grid */}
          <div className="grid grid-cols-2 gap-6 gap-y-20">
            {departments.map((department) => (
                <div className="mt-10">
                    <DepartmentCard
                key={department.code}
                departmentCode={department.code}
                departmentName={department.name}
                onClick={() => handleDepartmentClick(department.code)}
              />
                </div>
            ))}
          </div>
        </CustomCard>
      </div>

      {/* Upload Dialog */}
      <UploadStudentsDialog
        open={uploadDialogOpen}
        onClose={handleCloseDialog}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default UserDepartment;
