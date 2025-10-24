
import { useState, useEffect } from "react";
import CustomCard from "@/components/Card";
import TableRedesign from "@/components/Table_re";
import Button from "@/components/Button";
import { GridColDef } from "@mui/x-data-grid";
import { useEventCoopStore } from "@/stores/Teacher/eventCoop.store";
import { useUserStore } from "@/stores/Teacher/student.store";
import { EventCoop } from "@/types/eventcoop.type";
import EditEventCoopDialog from "./components/editEventCoopDialog";
import { toast } from "sonner";
import Loading from "@/components/Loading";

interface EventCoopManagementProps {
  departmentId?: number;
  departmentName?: string;
}

const EventCoopManagement: React.FC<EventCoopManagementProps> = ({ 
  departmentId = 1, 
  departmentName = "วิศวกรรมคอมพิวเตอร์"
}) => {
  const { 
    eventCoops, 
    loading, 
    error, 
    fetchEventCoops, 
    getEventCoopsByDepartment 
  } = useEventCoopStore();
  
  const { updateGradeYear, rollbackGradeYear } = useUserStore();
  
  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEventCoop, setSelectedEventCoop] = useState<EventCoop | null>(null);

  // โหลดข้อมูล Event Coop เมื่อ component mount หรือ department เปลี่ยน
  useEffect(() => {
    const loadEventCoops = async () => {
      try {
        console.log(`🔄 Loading event coops for department: ${departmentName} (ID: ${departmentId})`);
        // ลองดึงข้อมูลตาม department ก่อน
        await getEventCoopsByDepartment(departmentId);
      } catch (error) {
        console.error("Error loading event coops by department:", error);
        // ถ้าไม่ได้ ให้ดึงข้อมูลทั้งหมด
        await fetchEventCoops();
      }
    };
    
    loadEventCoops();
  }, [departmentId, departmentName, getEventCoopsByDepartment, fetchEventCoops]);

  // ฟังก์ชันสำหรับย้อนกลับชั้นปี
  const handleRollbackGrade = async () => {
    console.log("🔄 Starting grade year rollback...");
    
    try {
      // แสดง loading toast
      toast.loading("กำลังย้อนกลับชั้นปี...", { id: "rollback-grade" });
      
      const result = await rollbackGradeYear();
      
      if (result.success) {
        toast.success(result.message, { id: "rollback-grade" });
        console.log("✅ Grade year rollback successful:", result.data);
        
        // แสดงข้อมูลสรุป
        if (result.data) {
          const { summary } = result.data;
          console.log("📊 Rollback Summary:", {
            gradesRolledBack: summary.gradesRolledBack,
            studentsUpdated: summary.studentsUpdated,
            totalProcessed: summary.totalProcessed
          });
          
          // แสดง toast แสดงข้อมูลสรุป
          toast.success(
            `ย้อนกลับเสร็จสิ้น: ย้อนกลับชั้นปี ${summary.gradesRolledBack} ระดับ, นิสิต ${summary.studentsUpdated}/${summary.totalProcessed} คน`,
            { duration: 5000 }
          );
        }

        // 🔄 Refresh Event Coop data หลังจากย้อนกลับชั้นปี
        console.log("🔄 Refreshing Event Coop data after rollback...");
        try {
          await getEventCoopsByDepartment(departmentId);
          console.log("✅ Event Coop data refreshed successfully");
        } catch (refreshError) {
          console.error("❌ Error refreshing Event Coop data:", refreshError);
          // ไม่ต้องแสดง error toast เพราะการ refresh เป็น optional
        }
      } else {
        toast.error(result.message, { id: "rollback-grade" });
        console.error("❌ Grade year rollback failed:", result.message);
      }
    } catch (error) {
      console.error("❌ Grade year rollback error:", error);
      toast.error("เกิดข้อผิดพลาดในการย้อนกลับชั้นปี", { id: "rollback-grade" });
    }
  };

  // ฟังก์ชันสำหรับอัพเดทชั้นปี
  const handleUpdateGrade = async () => {
    console.log("🔄 Starting grade year update...");
    
    try {
      // แสดง loading toast
      toast.loading("กำลังอัพเดทชั้นปี...", { id: "update-grade" });
      
      const result = await updateGradeYear();
      
      if (result.success) {
        toast.success(result.message, { id: "update-grade" });
        console.log("✅ Grade year update successful:", result.data);
        
        // แสดงข้อมูลสรุป
        if (result.data) {
          const { summary } = result.data;
          console.log("📊 Update Summary:", {
            gradesUpdated: summary.gradesUpdated,
            studentsUpdated: summary.studentsUpdated,
            totalProcessed: summary.totalProcessed
          });
          
          // แสดง toast แสดงข้อมูลสรุป
          toast.success(
            `อัพเดทเสร็จสิ้น: อัพเดทชั้นปี ${summary.gradesUpdated} ระดับ, นิสิต ${summary.studentsUpdated}/${summary.totalProcessed} คน`,
            { duration: 5000 }
          );
        }

        // 🔄 Refresh Event Coop data หลังจากอัพเดทชั้นปี
        console.log("🔄 Refreshing Event Coop data after update...");
        try {
          await getEventCoopsByDepartment(departmentId);
          console.log("✅ Event Coop data refreshed successfully");
        } catch (refreshError) {
          console.error("❌ Error refreshing Event Coop data:", refreshError);
          // ไม่ต้องแสดง error toast เพราะการ refresh เป็น optional
        }
      } else {
        toast.error(result.message, { id: "update-grade" });
        console.error("❌ Grade year update failed:", result.message);
      }
    } catch (error) {
      console.error("❌ Grade year update error:", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดทชั้นปี", { id: "update-grade" });
    }
  };


  // ฟังก์ชันสำหรับเปิด Dialog แก้ไข
  const handleEditEventCoop = (eventCoop: EventCoop) => {
    console.log("📝 Opening edit dialog for Event Coop:", eventCoop);
    
    // ตรวจสอบว่า eventCoop มีข้อมูลครบถ้วน
    if (!eventCoop || !eventCoop.eventcoop_id) {
      console.error("❌ Invalid EventCoop data:", eventCoop);
      return;
    }
    
    console.log("🔄 Setting dialog state...");
    setSelectedEventCoop(eventCoop);
    setEditDialogOpen(true);
    console.log("✅ Dialog state set - should be open now");
    
    // ตรวจสอบ state หลังจาก set
    setTimeout(() => {
      console.log("🔍 Current editDialogOpen:", editDialogOpen);
      console.log("🔍 Current selectedEventCoop:", selectedEventCoop);
    }, 100);
  };

  // ฟังก์ชันสำหรับปิด Dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEventCoop(null);
  };

  // ฟังก์ชันคำนวณจำนวนวัน
  const calculateDaysUntilCoop = (coopDate: Date | string | null | undefined) => {
    // ตรวจสอบ null หรือ undefined
    if (!coopDate || coopDate === null || coopDate === undefined) {
      return null;
    }
    
    const today = new Date();
    const coop = new Date(coopDate);
    const diffTime = coop.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // แปลงข้อมูล Event Coop เป็นรูปแบบที่ตารางต้องการ
  const tableData = Array.isArray(eventCoops) ? eventCoops.map((eventCoop: EventCoop) => ({
    id: eventCoop.eventcoop_id,
    grade: `ปี ${eventCoop.grade_id}${eventCoop.th_year ? ` (${eventCoop.th_year})` : ''}`,
    date: eventCoop.date,
    is_on_coop: eventCoop.is_on_coop,
    department_name_tha: departmentName
  })) : [];

  // Debug logging
  console.log("🔍 EventCoopManagement Debug:", {
    eventCoops: eventCoops,
    eventCoopsLength: eventCoops.length,
    tableData: tableData,
    tableDataLength: tableData.length,
    loading: loading,
    error: error
  });

  // กำหนด columns สำหรับตาราง
  const columns: GridColDef[] = [
    {
      field: "grade",
      headerName: "ชั้นปี",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-4",
    },
    {
      field: "date",
      headerName: "วันที่ไปสหกิจ",
      width: 250,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-4",
      renderCell: (params) => {
        if (!params.value) {
          return "ยังไม่ระบุ";
        }
        const date = new Date(params.value);
        return date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    },
    {
      field: "days_until_coop",
      headerName: "จำนวนวันที่เหลือก่อนไปสหกิจศึกษา",
      width: 300,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-4",
      renderCell: (params) => {
        const days = calculateDaysUntilCoop(params.row.date);
        
        // ตรวจสอบ null หรือ undefined
        if (days === null) {
          return "ยังไม่ระบุ";
        }
        
        if (days > 0) {
          return `${days} วัน`;
        } else if (days === 0) {
          return "วันนี้";
        } else {
          return `${Math.abs(days)} วัน`;
        }
      }
    },
    {
      field: "is_on_coop",
      headerName: "บังคับออกฝึก",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-4",
      renderCell: (params) => {
        const isOnCoop = params.value;
        
        // ตรวจสอบ null หรือ undefined
        if (isOnCoop === null || isOnCoop === undefined) {
          return (
            <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              ยังไม่ได้ระบุ
            </span>
          );
        }
        
        return (
          <span 
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              isOnCoop 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isOnCoop ? 'บังคับ' : 'ไม่บังคับ'}
          </span>
        );
      }
    }
  ];

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      <CustomCard height={700} width="100%" className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            กำหนดการณ์ไปสหกิจ สาขา {departmentName}
          </h2>
          <div className="flex gap-3">
            <Button
              onClick={handleRollbackGrade}
              bgColor="#DC2626"
              textColor="#FFFFFF"
              width="auto"
              className="px-4 py-2"
            >
              ย้อนกลับชั้นปี
            </Button>
            <Button
              onClick={handleUpdateGrade}
              bgColor="#1E3A8A"
              textColor="#FFFFFF"
              width="auto"
              className="px-4 py-2"
            >
              อัพเดทชั้นปี
            </Button>
          </div>
        </div>
        
        <TableRedesign
          columns={columns}
          rows={tableData}
          height={500}
          width="100%"
          borderRadius={14}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
          onRowDoubleClick={(row: any) => {
            console.log("🔍 Double-click detected with row:", row);
            
            // ตรวจสอบข้อมูลพื้นฐาน
            if (!row || !row.id) {
              console.warn("⚠️ Invalid row structure");
              return;
            }
            
            // ตรวจสอบว่า eventCoops array มีข้อมูล
            if (!Array.isArray(eventCoops) || eventCoops.length === 0) {
              console.warn("⚠️ No eventCoops data available");
              return;
            }
            
            console.log("🔍 Looking for EventCoop with ID:", row.id);
            console.log("🔍 Available EventCoops:", eventCoops.map(ec => ec.eventcoop_id));
            
            // หา Event Coop ที่ตรงกับ row ที่ double-click (เปรียบเทียบแบบ string)
            const eventCoop = eventCoops.find(ec => String(ec.eventcoop_id) === String(row.id));
            if (eventCoop) {
              console.log("📝 Found EventCoop:", eventCoop);
              handleEditEventCoop(eventCoop);
            } else {
              console.warn("⚠️ EventCoop not found for ID:", row.id);
            }
          }}
        />
      </CustomCard>

      {/* Edit Event Coop Dialog */}
      <EditEventCoopDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        eventCoop={selectedEventCoop}
      />
    </div>
  );
};

export default EventCoopManagement;