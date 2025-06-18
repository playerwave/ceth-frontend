import { useEffect, useState } from "react";
import React from "react";
import { useActivityStore } from "../../../../stores/Teacher/activity_list_store";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../components/Loading";
import SearchBar from "../../../../components/Searchbar";
import ActivityTablePage from "./ActivityTablePage";
import { CopyPlus } from "lucide-react";
import { Activity } from "../../../../types/Admin/activity_list_type";

import { toast } from "sonner";
import ConfirmDialog from "./components/onfirmDialog";
import axiosInstance from "../../../../libs/axios";

const ManageActivityAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    activityError,
    mockActivities,
    setMockActivities,
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<
    (Activity & { source: "mock" | "real" }) | null
  >(null);

  const [dialog, setDialog] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const displayedActivities = searchResults ?? activities;

  const activitiesSuccess = displayedActivities.filter(
    (a) => a.status === "Public"
  );
  const activitiesDraft = displayedActivities.filter(
    (a) => a.status === "Private"
  );

  const now = new Date();
  const activitiesForEvaluation = mockActivities.filter((a) => {
    const endActivity = a.end_time ? new Date(a.end_time) : null;
    const endEvaluation = a.end_assessment ? new Date(a.end_assessment) : null;
    return (
      endActivity !== null &&
      endEvaluation !== null &&
      endActivity < now &&
      endEvaluation > now
    );
  });

  const handleSearch = (term: string) => {
    if (term.trim() === searchTerm.trim()) return;
    setSearchTerm(term);
    searchActivities(term);
  };

  const updateMockStatus = (id: string, status: "Public" | "Private") => {
    const updated = mockActivities.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    setMockActivities(updated);
  };

  const mapToApiPayload = (activity: Activity, status: string) => ({
    ac_id: Number(activity.id),
    ac_name: activity.name,
    ac_company_lecturer: activity.company_lecturer,
    ac_description: activity.description,
    ac_type: activity.type,
    ac_room: activity.room,
    ac_seat: Number(activity.seat),
    ac_food: activity.food,
    ac_status: status,
    ac_location_type: activity.location_type,
    ac_start_register: activity.start_register,
    ac_end_register: activity.end_register,
    ac_create_date: activity.create_date,
    ac_last_update: new Date(),
    ac_registered_count: activity.registered_count,
    ac_attended_count: activity.attended_count,
    ac_not_attended_count: activity.not_attended_count,
    ac_start_time: activity.start_time,
    ac_end_time: activity.end_time,
    ac_image_url: activity.image_url,
    ac_state: activity.state,
    ac_normal_register: activity.normal_register,
    ac_recieve_hours: activity.recieve_hours,
    ac_start_assessment: activity.start_assessment,
    ac_end_assessment: activity.end_assessment,
    assessment: activity.assessment,
  });

  const handleStatusToggle = async (
    row: Activity & { source: "mock" | "real" }
  ) => {
    const currentStatus = row.status?.toLowerCase();
    const updatedStatus = currentStatus === "public" ? "Private" : "Public";

    console.log("🌀 CLICK TOGGLE");
    console.log(`👉 Toggle status: ${row.status} → ${updatedStatus}`);
    console.log("📎 Activity row:", row);

    setSelectedRow(row);

    const sourceList = row.source === "mock" ? mockActivities : activities;

    const target = sourceList.find((a) => String(a.id) === String(row.id));

    if (!target) {
      console.error("❌ ไม่พบกิจกรรมที่ต้องการอัปเดต:", {
        id: row.id,
        allIds: sourceList.map((a) => a.id),
      });
      toast.error("ไม่สามารถเปลี่ยนสถานะ: ไม่พบข้อมูลกิจกรรม");
      return;
    }

    if (!target.requiredFieldsFilled) {
      setDialog({
        open: true,
        message:
          "กรุณากรอกข้อมูลกิจกรรมให้ตรงเงื่อนไข\n(กด Confirm เพื่อไปที่หน้าแก้ไขกิจกรรม)",
        onConfirm: () => {
          setDialog(null);
          navigate("/update-activity-admin", { state: { id: row.id } });
        },
      });
      return;
    }

    const updatedData = mapToApiPayload(target, updatedStatus);

    try {
      console.log("📦 ส่ง PUT:", {
        url: `/admin/activity/update-activity/${row.id}`,
        body: updatedData,
      });

      await axiosInstance.put(
        `/admin/activity/update-activity/${row.id}`,
        updatedData
      );

      if (row.source === "mock") {
        updateMockStatus(row.id, updatedStatus);
      }

      toast.success(`เปลี่ยนสถานะเป็น ${updatedStatus} แล้ว`);
      await fetchActivities();
    } catch (err) {
      console.error("❌ อัปเดตสถานะล้มเหลว:", err);
      toast.error("ไม่สามารถเปลี่ยนสถานะกิจกรรมได้");
    }
  };

  const activitiesSuccessWithSource = activitiesSuccess.map((a) => ({
    ...a,
    source: "real" as const,
  }));

  const activitiesDraftWithSource = activitiesDraft.map((a) => ({
    ...a,
    source: "real" as const,
  }));

  const activitiesForEvaluationWithSource = activitiesForEvaluation.map(
    (a) => ({
      ...a,
      source: "mock" as const,
    })
  );

  return (
    <>
      <div className="max-w-screen-xl w-full mx-auto px-6 mt-10">
        <h1 className="text-center text-3xl font-bold mb-9 mt-4">
          จัดการกิจกรรม
        </h1>

        <div className="flex justify-center w-full mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 text-lg font-semibold flex items-center ${
                activeTab === "list"
                  ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("list")}
            >
              ลิสต์
            </button>
            <button
              className={`px-4 py-2 text-lg font-semibold flex items-center ${
                activeTab === "calendar"
                  ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              ปฏิทิน
            </button>
          </div>

          <div className="flex justify-end">
            <button
              className="w-full md:w-auto max-w-xs sm:max-w-sm bg-[#1E3A8A] text-white px-6 py-2 rounded-[12px] flex items-center justify-center gap-2 hover:brightness-90 transition"
              onClick={() =>
                navigate("/create-activity-admin", { state: { reload: true } })
              }
            >
              เพิ่มกิจกรรม <CopyPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activityLoading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
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
            rows1={activitiesSuccessWithSource}
            rows2={activitiesDraftWithSource}
            rows3={activitiesForEvaluationWithSource}
            setDialog={setDialog}
            handleStatusToggle={handleStatusToggle}
          />
        ) : (
          <div className="text-center text-gray-500 p-6">
            <h2 className="text-xl font-semibold">
              📅 โหมดปฏิทิน (ยังไม่มีข้อมูล)
            </h2>
          </div>
        )}
      </div>

      {dialog && (
        <ConfirmDialog
          open={dialog.open}
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
};

export default ManageActivityAdmin;