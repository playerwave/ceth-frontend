import React, { useEffect, useState } from "react";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Activity } from "../../../../types/model";

import SearchBar from "../../../../components/Searchbar";
import Loading from "../../../../components/Loading";
import ActivityTablePage from "./ActivityTablePage";
import Dialog2 from "../../../../components/Dialog/Dialog2";
import TabBar from "../../../../components/TabBar";
import { AlertCircle, List, Calendar as CalendarIcon } from "lucide-react";

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
import { isActivityValid, validatePrivateToPublic } from "./utils/activity";
import CalendarComponent from "../calendar-list-activity/calendar";

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
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    // ✅ เพิ่มการตรวจสอบ loading state และ debug logs
    console.log("🔍 [ListActivityTeacher] useEffect triggered:", {
      activityLoading,
      activitiesCount: activities.length,
      user: useAuthStore.getState().user,
      isAuthenticated: useAuthStore.getState().isAuthenticated
    });
    
    if (!activityLoading) {
      console.log("🔄 [ListActivityTeacher] Fetching activities...");
      fetchActivities();
    } else {
      console.log("⏳ [ListActivityTeacher] Already loading, skipping fetch");
    }
  }, []); // ✅ เปลี่ยนเป็น dependency array ว่าง

  const displayedActivities = searchResults ?? activities;


  
  // ✅ ตรวจสอบว่า location.state มี tab หรือไม่ เพื่อได้รู้ว่ามาจากหน้าปฏิทินหรือไม่
  const location = useLocation();
  useEffect(() => {
    const tabFromState = location.state?.tab;
    if (tabFromState === "calendar" || tabFromState === "list") {
      setActiveTab(tabFromState); // ✅ set tab ตามที่ส่งกลับมา
    }
  }, [location.state]);


  // กิจกรรมสหกิจ: Public และมี activity_state เป็น Not Start, Special Open Register, Open Register, Close Register
  const publicActivities = displayedActivities.filter((a) => {
    const isPublic = a.activity_status === "Public";
    
    // ต้องมี activity_state เป็น Not Start, Special Open Register, Open Register, Close Register
    const allowedStates = ["Not Start", "Special Open Register", "Open Register", "Close Register"];
    const hasAllowedState = allowedStates.includes(a.activity_state);

    // Debug log
    if (import.meta.env.DEV) {
      console.log(`🔍 Activity: ${a.activity_name}`, {
        isPublic,
        activityState: a.activity_state,
        hasAllowedState,
        included: isPublic && hasAllowedState,
        reason: "State-based filtering"
      });
    }

    return isPublic && hasAllowedState;
  });

  const privateActivities = displayedActivities.filter(
    (a) => a.activity_status === "Private",
  );

  // กิจกรรมที่กำลังดำเนินการและจบแล้ว: Public และมี activity_state เป็น Start Activity, End Activity
  const activeActivities = displayedActivities.filter((a) => {
    const isPublic = a.activity_status === "Public";
    
    // ต้องมี activity_state เป็น Start Activity, End Activity
    const allowedStates = ["Start Activity", "End Activity"];
    const hasAllowedState = allowedStates.includes(a.activity_state);

    // Debug log
    if (import.meta.env.DEV) {
      console.log(`🔍 Active Activity: ${a.activity_name}`, {
        isPublic,
        activityState: a.activity_state,
        hasAllowedState,
        included: isPublic && hasAllowedState,
        reason: "Active state filtering"
      });
    }

    return isPublic && hasAllowedState;
  });

  // กิจกรรมที่ให้นิสิตทำแบบประเมิน: Public, Active, และมี activity_state เป็น "Start Assessment"
  const activitiesEvaluate = displayedActivities.filter((a) => {
    // ต้องเป็น Public และ Active
    const isPublic = a.activity_status === "Public";
    const isActive = a.status === "Active";
    if (!isPublic || !isActive) return false;

    // Course ไม่สามารถแสดงในตารางนี้ได้
    if (a.event_format === "Course") return false;

    // ต้องมี start_assessment และ end_assessment
    const hasStartAssessment = a.start_assessment !== null && a.start_assessment !== undefined;
    const hasEndAssessment = a.end_assessment !== null && a.end_assessment !== undefined;
    if (!hasStartAssessment || !hasEndAssessment || !a.start_assessment || !a.end_assessment) return false;

    // ต้องมี activity_state เป็น "Start Assessment"
    const isStartAssessment = a.activity_state === "Start Assessment";

    // Debug log
    if (import.meta.env.DEV) {
      console.log(`🔍 Assessment Activity: ${a.activity_name}`, {
        isPublic,
        isActive,
        eventFormat: a.event_format,
        hasStartAssessment,
        hasEndAssessment,
        activityState: a.activity_state,
        isStartAssessment,
        included: isStartAssessment
      });
    }

    return isStartAssessment;
  });

  const handleSearch = (term: string) => {
    if (term.trim() === searchTerm.trim()) return;
    setSearchTerm(term);
    searchActivities?.(term);
  };

  const handleStatusToggle = async (activity: Activity) => {
    const currentStatus = activity.activity_status?.toLowerCase();
    const updatedStatus = currentStatus === "public" ? "Private" : "Public";

    // ✅ เพิ่ม debug log
    console.log("🔄 Status toggle attempt:", {
      activity_id: activity.activity_id,
      activity_name: activity.activity_name,
      current_status: activity.activity_status,
      activity_state: activity.activity_state,
      currentStatus_lowercase: currentStatus,
      updatedStatus: updatedStatus,
    });

    // ✅ ตรวจสอบเงื่อนไขตามทิศทางการเปลี่ยน
    if (currentStatus === "public") {
      // เปลี่ยนจาก Public เป็น Private
      
      // ✅ ตรวจสอบ activity_state ที่อนุญาตให้เปลี่ยนได้เลย
      const allowedStatesForDirectToggle = ["Special Open Register", "Open Register", "Close Register"];
      const canToggleDirectly = allowedStatesForDirectToggle.includes(activity.activity_state);
      
      if (canToggleDirectly) {
        // ✅ เปลี่ยนได้เลยโดยไม่ต้องตรวจสอบ validation
        console.log("✅ Public to Private: Allowed to toggle directly for state:", activity.activity_state);
        console.log("🔄 Calling updateActivityStatus with:", {
          id: activity.activity_id.toString(),
          status: "Private"
        });
        try {
          console.log("🔄 Attempting to update activity status...");
          await useActivityStore
            .getState()
            .updateActivityStatus?.(
              activity.activity_id.toString(),
              "Private",
            );
          console.log("✅ Status update successful");
          toast.success("เปลี่ยนสถานะเป็น Private แล้ว");
          // ✅ Store จะจัดการการอัปเดต state เอง
        } catch (err: any) {
          console.error("❌ Error updating status:", err);
          
          // ✅ แสดงข้อความ error ที่เฉพาะเจาะจง
          let errorMessage = "ไม่สามารถเปลี่ยนสถานะกิจกรรมได้";
          
          if (err?.response?.status === 401) {
            errorMessage = "กรุณาเข้าสู่ระบบใหม่";
          } else if (err?.response?.status === 403) {
            errorMessage = "ไม่มีสิทธิ์ในการเปลี่ยนสถานะกิจกรรม";
          } else if (err?.response?.status === 404) {
            errorMessage = "ไม่พบกิจกรรมที่ต้องการอัปเดต";
          } else if (err?.code === "ERR_NETWORK") {
            errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
          } else if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          
          toast.error(errorMessage);
          
          // ✅ ถ้าเป็น network error ให้ลองใหม่
          if (err?.code === "ERR_NETWORK") {
            console.log("🔄 Retrying after network error...");
            setTimeout(async () => {
              try {
                await useActivityStore
                  .getState()
                  .updateActivityStatus?.(
                    activity.activity_id.toString(),
                    "Private",
                  );
                console.log("✅ Retry successful");
                toast.success("เปลี่ยนสถานะเป็น Private แล้ว");
              } catch (retryErr) {
                console.error("❌ Retry failed:", retryErr);
                toast.error("ไม่สามารถเปลี่ยนสถานะกิจกรรมได้ กรุณาลองใหม่อีกครั้ง");
              }
            }, 2000); // รอ 2 วินาทีแล้วลองใหม่
          }
        }
        return;
      }
      
      // ✅ ถ้าไม่ใช่ state ที่อนุญาต ให้ตรวจสอบ validation ตามเดิม
      if (!isActivityValid(activity)) {
        console.log("❌ Public to Private validation failed, showing dialog");
        setDialog({
          open: true,
          title: "แจ้งเตือน",
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
    } else {
      // เปลี่ยนจาก Private เป็น Public
      const validation = validatePrivateToPublic(activity);

      if (!validation.isValid) {
        console.log("❌ Private to Public validation failed:", validation.reason);
        setDialog({
          open: true,
          title: "แจ้งเตือน",
          message: validation.message,
          onConfirm: () => {
            setDialog(null);
            // สร้าง URL ที่เข้ารหัสสำหรับหน้า update พร้อมข้อมูล validation
            const encryptedUrl = createSecureLink("/update-activity-admin", {
              id: activity.activity_id,
              name: "Update Activity",
              type: "update",
              isActive: true,
              timestamp: Date.now(),
              // เพิ่มข้อมูล validation
              validationError: validation.reason,
              targetStatus: "Public", // ต้องการเปลี่ยนเป็น Public
              showValidationErrors: true, // แสดงข้อความ error
            });

            console.log("🔄 Navigating to update activity:", activity.activity_id);
            console.log("🔐 Generated update URL:", encryptedUrl);
            console.log("🔍 Validation error reason:", validation.reason);

            window.location.href = encryptedUrl;
          },
        });
        return;
      } else {
        // ถ้าผ่าน validation แต่ยังต้องยืนยัน
        console.log("✅ Private to Public validation passed, showing confirmation dialog");
        setDialog({
          open: true,
          title: "ยืนยันการเปลี่ยนสถานะ",
          message: validation.message,
          onConfirm: async () => {
            setDialog(null);
            try {
              await useActivityStore
                .getState()
                .updateActivityStatus?.(
                  activity.activity_id.toString(),
                  "Public",
                );
              toast.success("เปลี่ยนสถานะเป็น Public แล้ว");
            } catch (err) {
              toast.error("ไม่สามารถเปลี่ยนสถานะกิจกรรมได้");
            }
          },
        });
        return;
      }
    }

    // ✅ สำหรับ Public เป็น Private (ผ่าน validation แล้ว) หรือกรณีอื่นๆ
    console.log("🔄 Calling updateActivityStatus for other cases with:", {
      id: activity.activity_id.toString(),
      status: updatedStatus
    });
    try {
      await useActivityStore
        .getState()
        .updateActivityStatus?.(
          activity.activity_id.toString(),
          updatedStatus as "Public" | "Private",
        );
      console.log("✅ Status update successful for other cases");
      toast.success(`เปลี่ยนสถานะเป็น ${updatedStatus} แล้ว`);
      // ✅ Store จะจัดการการอัปเดต state เอง
    } catch (err: any) {
      console.error("❌ Error updating status for other cases:", err);
      
      // ✅ แสดงข้อความ error ที่เฉพาะเจาะจง
      let errorMessage = "ไม่สามารถเปลี่ยนสถานะกิจกรรมได้";
      
      if (err?.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบใหม่";
      } else if (err?.response?.status === 403) {
        errorMessage = "ไม่มีสิทธิ์ในการเปลี่ยนสถานะกิจกรรม";
      } else if (err?.response?.status === 404) {
        errorMessage = "ไม่พบกิจกรรมที่ต้องการอัปเดต";
      } else if (err?.code === "ERR_NETWORK") {
        errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast.error(errorMessage);
      
      // ✅ ถ้าเป็น network error ให้ลองใหม่
      if (err?.code === "ERR_NETWORK") {
        console.log("🔄 Retrying after network error...");
        setTimeout(async () => {
          try {
            await useActivityStore
              .getState()
              .updateActivityStatus?.(
                activity.activity_id.toString(),
                updatedStatus as "Public" | "Private",
              );
            console.log("✅ Retry successful");
            toast.success(`เปลี่ยนสถานะเป็น ${updatedStatus} แล้ว`);
          } catch (retryErr) {
            console.error("❌ Retry failed:", retryErr);
            toast.error("ไม่สามารถเปลี่ยนสถานะกิจกรรมได้ กรุณาลองใหม่อีกครั้ง");
          }
        }, 2000); // รอ 2 วินาทีแล้วลองใหม่
      }
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
        {/* {import.meta.env.DEV && (
          <div className="w-full max-w-screen-xl mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p>🔍 Debug Filtering Info:</p>
            <p>Total Activities: {displayedActivities.length}</p>
            <p>Public Activities: {publicActivities.length}</p>
            <p>Private Activities: {privateActivities.length}</p>
            <p>Assessment Activities: {activitiesEvaluate.length}</p>
            <p>Current Time: {new Date().toISOString()}</p>
            <p>Missing Activities: {displayedActivities.length - (publicActivities.length + privateActivities.length + activitiesEvaluate.length)}</p>
            <p>Public Activities Details:</p>
            {publicActivities.map((activity, index) => (
              <p key={index} className="ml-4">
                • {activity.activity_name} (ID: {activity.activity_id}) - {activity.event_format} - 
                Start: {activity.start_assessment} - End: {activity.end_assessment}
              </p>
            ))}
            <p>Private Activities Details:</p>
            {privateActivities.map((activity, index) => (
              <p key={index} className="ml-4">
                • {activity.activity_name} (ID: {activity.activity_id}) - {activity.event_format}
              </p>
            ))}
            <p>Assessment Activities Details:</p>
            {activitiesEvaluate.map((activity, index) => (
              <p key={index} className="ml-4">
                • {activity.activity_name} (ID: {activity.activity_id}) - {activity.event_format} - 
                Start: {activity.start_assessment} - End: {activity.end_assessment}
              </p>
            ))}
          </div>
        )} */}

        <div className="flex flex-wrap justify-between items-center gap-2 mb-6 w-full">
          <TabBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as "list" | "calendar")}
            tabs={[
              {
                id: "list",
                label: "ลิสต์",
                icon: <List className="w-4 h-4" />
              },
              {
                id: "calendar", 
                label: "ปฏิทิน",
                icon: <CalendarIcon className="w-4 h-4" />
              }
            ]}
          />

          <button
            className="bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center gap-2 hover:brightness-90"
            onClick={() =>
              navigate("/create-activity-admin", { state: { reload: true, from: 'list' } })
            }
          >
            เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
          </button>
        </div>

        {activityLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loading />
            <div className="mt-4 text-gray-600 text-center">
              <p>กำลังโหลดกิจกรรม...</p>
              <p className="text-sm text-gray-500 mt-2">
                อาจใช้เวลานานเนื่องจากข้อมูลจำนวนมาก
              </p>
              <p className="text-xs text-gray-400 mt-1">
                หากใช้เวลานานเกิน 30 วินาที กรุณารีเฟรชหน้า
              </p>
            </div>
          </div>
        ) : activityError ? (
          <div className="text-center p-4">
            <p className="text-red-500 mb-4">
              ❌ เกิดข้อผิดพลาด: {activityError}
            </p>
            <button 
              onClick={() => fetchActivities()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ลองใหม่
            </button>
          </div>
        ) : displayedActivities.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500 mb-4">
              📭 ไม่พบกิจกรรม
            </p>
            <p className="text-sm text-gray-400 mb-4">
              อาจเป็นเพราะ Backend Server ไม่ทำงาน หรือไม่มีข้อมูลกิจกรรม
            </p>
            <button 
              onClick={() => fetchActivities()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ลองโหลดใหม่
            </button>
          </div>
        ) : activeTab === "list" ? (
          <ActivityTablePage
            rows1={publicActivities}
            rows2={privateActivities}
            rows3={activeActivities}
            rows4={activitiesEvaluate}
            handleStatusToggle={handleStatusToggle}
            createSecureLink={createSecureLink}
          />
        ) : (
          <div className="text-center text-gray-500 p-6">
            <CalendarComponent />
          </div>
        )}

        {dialog && (
          <Dialog2
            open={dialog.open}
            title={dialog.title}
            message={dialog.message}
            icon={<AlertCircle className="w-6 h-6 text-red-500" />}
            onClose={() => setDialog(null)}
            onConfirm={dialog.onConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default ListActivityTeacher;
