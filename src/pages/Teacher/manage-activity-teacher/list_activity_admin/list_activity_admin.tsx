import React, { useEffect, useState } from "react";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Activity } from "../../../../types/model";

import SearchBar from "../../../../components/Searchbar";
import Loading from "../../../../components/Loading";
import ActivityTablePage from "./ActivityTablePage";
import ConfirmDialog from "./components/onfirmDialog";

// 🔧 Custom CopyPlus icon แทน lucide-react
const CopyPlus = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="m5 16 4-4 4 4" />
    <path d="M3 20h18" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

import { useSecureLink } from "../../../../routes/secure/SecureRoute";
import { isActivityValid } from "./utils/activity";

const ListActivityTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { createSecureLink } = useSecureLink();
  
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const displayedActivities = searchResults ?? activities;
  
  // กิจกรรมสหกิจ: Public และยังไม่ถึง start_assessment
  const publicActivities = displayedActivities.filter((a) => {
    const isPublic = a.activity_status === "Public";
    const hasStartAssessment = a.start_assessment !== null && a.start_assessment !== undefined;
    const now = new Date();
    const startAssessmentDate = hasStartAssessment && a.start_assessment ? new Date(a.start_assessment) : null;
    const notReachedAssessment = !hasStartAssessment || (startAssessmentDate && now < startAssessmentDate);
    
    // Debug log
    if (import.meta.env.DEV) {
      console.log(`🔍 Activity: ${a.activity_name}`, {
        isPublic,
        hasStartAssessment,
        startAssessmentDate: startAssessmentDate?.toISOString(),
        now: now.toISOString(),
        notReachedAssessment,
        included: isPublic && notReachedAssessment
      });
    }
    
    return isPublic && notReachedAssessment;
  });
  
  const privateActivities = displayedActivities.filter(
    (a) => a.activity_status === "Private",
  );
  
  // กิจกรรมที่ให้นิสิตทำแบบประเมิน: มี start_assessment และถึงเวลาแล้ว
  const activitiesEvaluate = displayedActivities.filter((a) => {
    const hasStartAssessment = a.start_assessment !== null && a.start_assessment !== undefined;
    if (!hasStartAssessment || !a.start_assessment) return false;
    
    const now = new Date();
    const startAssessmentDate = new Date(a.start_assessment);
    const hasReachedAssessment = now >= startAssessmentDate;
    
    return hasStartAssessment && hasReachedAssessment;
  });

  const handleSearch = (term: string) => {
    if (term.trim() === searchTerm.trim()) return;
    setSearchTerm(term);
    searchActivities?.(term);
  };

  const handleStatusToggle = async (activity: Activity) => {
    const currentStatus = activity.activity_status?.toLowerCase();
    const updatedStatus = currentStatus === "public" ? "Private" : "Public";

    if (!isActivityValid(activity)) {
      setDialog({
        open: true,
        message:
          "กรุณากรอกข้อมูลกิจกรรมให้ตรงเงื่อนไข\n(กด Confirm เพื่อไปที่หน้าแก้ไขกิจกรรม)",
        onConfirm: () => {
          setDialog(null);
          // สร้าง URL ที่เข้ารหัสสำหรับหน้า update
          const encryptedUrl = createSecureLink("/update-activity-admin", {
            id: activity.activity_id,
            name: "Update Activity",
            type: "update",
            isActive: true,
            timestamp: Date.now(),
          });
          
          console.log("🔄 Navigating to update activity:", activity.activity_id);
          console.log("🔐 Generated update URL:", encryptedUrl);
          
          window.location.href = encryptedUrl;
        },
      });
      return;
    }

    try {
      await useActivityStore
        .getState()
        .updateActivityStatus?.(
          activity.activity_id.toString(),
          updatedStatus as "Public" | "Private",
        );
      toast.success(`เปลี่ยนสถานะเป็น ${updatedStatus} แล้ว`);
    } catch (err) {
      toast.error("ไม่สามารถเปลี่ยนสถานะกิจกรรมได้");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-6 mt-10">
      <div className="w-full max-w-screen-xl flex flex-col items-center justify-center">
        <h1 className="text-center text-3xl font-bold mb-9 mt-4">
          จัดการกิจกรรม
        </h1>

        <div className="flex justify-center w-full mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Debug: Show filtering info */}
        {import.meta.env.DEV && (
          <div className="w-full max-w-screen-xl mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p>🔍 Debug Filtering Info:</p>
            <p>Total Activities: {displayedActivities.length}</p>
            <p>Public Activities: {publicActivities.length}</p>
            <p>Private Activities: {privateActivities.length}</p>
            <p>Assessment Activities: {activitiesEvaluate.length}</p>
            <p>Current Time: {new Date().toISOString()}</p>
          </div>
        )}

                <div className="flex flex-wrap justify-between items-center gap-2 mb-6 w-full">
          <div className="flex space-x-4">
            {(["list", "calendar"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-lg font-semibold ${
                  activeTab === tab
                    ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "list" ? "ลิสต์" : "ปฏิทิน"}
              </button>
            ))}
          </div>

          <button
            className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90"
            onClick={() =>
              navigate("/create-activity-admin", { state: { reload: true } })
            }
          >
            เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
          </button>
        </div>

      {activityLoading ? (
        <div className="fixed inset-0 flex justify-center ml-10 items-center bg-white bg-opacity-50 z-40">
          <Loading />
        </div>
      ) : activityError ? (
        <p className="text-center text-red-500 p-4">
          ❌ เกิดข้อผิดพลาด: {activityError}
        </p>
      ) : displayedActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          📭 ไม่พบกิจกรรมที่ตรงกับการค้นหา
        </p>
      ) : activeTab === "list" ? (
        <ActivityTablePage
          rows1={publicActivities}
          rows2={privateActivities}
          rows3={activitiesEvaluate}
          setDialog={setDialog}
          handleStatusToggle={handleStatusToggle}
          createSecureLink={createSecureLink}
        />
      ) : (
        <div className="text-center text-gray-500 p-6">
          <h2 className="text-xl font-semibold">
            📅 โหมดปฏิทิน (ยังไม่มีข้อมูล)
          </h2>
        </div>
        )}

        {dialog && (
          <ConfirmDialog
            open={dialog.open}
            message={dialog.message}
            onConfirm={dialog.onConfirm}
            onClose={() => setDialog(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ListActivityTeacher;
