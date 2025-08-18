import { useState, useMemo, useCallback } from "react";
import TableRedesign from "../../../../components/Table_re";
import CustomCard from "../../../../components/Card";
import { getActivityColumns } from "../../../../components/activity_column";
import { Activity } from "../../../../types/model";

import Dialog2 from "../../../../components/Dialog2";
import { ProtectionLevel } from "../../../../routes/secure/urlEnCryption";

type Props = {
  rows1: Activity[];
  rows2: Activity[];
  rows3: Activity[];
  rows4: Activity[];
  handleStatusToggle: (row: Activity) => void;
  createSecureLink: (path: string, params: Record<string, any>) => string;
};

const ActivityTablePage = ({
  rows1,
  rows2,
  rows3,
  rows4,
  handleStatusToggle,
  createSecureLink,
}: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Activity | null>(null);
  const [, setPreviewChecked] = useState<boolean | null>(null); // เพิ่ม preview

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // 🔗 ฟังก์ชันสำหรับ double-click ที่ใช้การเข้ารหัส
  const handleDoubleClickActivity = (row: Activity) => {
    console.log('🔍 Double-click detected!');
    console.log('🔍 Row data:', row);
    
    // สร้าง URL ที่เข้ารหัส
    const encryptedUrl = createSecureLink("/activity-info-admin", {
      id: row.activity_id,
      name: row.activity_name,
      type: row.type,
      isActive: row.activity_status === "Public",
      userId: 0, // ใช้ค่าเริ่มต้นแทน user_id ที่ไม่มีใน Activity type
      timestamp: Date.now(),
    });

    // 🔍 Debug: แสดงข้อมูล
    console.log('🔐 Activity Data:', {
      id: row.activity_id,
      name: row.activity_name,
      type: row.type,
      isActive: row.activity_status === "Public",
    });
    console.log('🔐 Generated URL:', encryptedUrl);
    console.log('🔐 Original URL would be:', `/activity-info-admin/${row.activity_id}`);
    console.log('🔐 createSecureLink function:', typeof createSecureLink);

    // ไปยัง URL ที่เข้ารหัส
    console.log('🔐 Navigating to:', encryptedUrl);
    window.location.href = encryptedUrl;
  };

  // 🧪 ฟังก์ชันทดสอบการเข้ารหัส
  const testEncryption = () => {
    console.log('🧪 Testing encryption...');
    const testUrl = createSecureLink("/activity-info-admin", {
      id: 123,
      name: "Test Activity",
      type: "test",
      isActive: true,
      timestamp: Date.now(),
    });
    console.log('🧪 Test URL:', testUrl);
    alert(`Test URL: ${testUrl}`);
  };

  const filterByType = (rows: Activity[]) => {
    if (selectedTypes.length === 0) return rows;
    return rows.filter((row) => selectedTypes.includes(row.type));
  };

  const handleConfirmStatusChange = useCallback((row: Activity) => {
    setSelectedRow(row);
    setPreviewChecked(row.activity_status === "Public");
    setOpenDialog(true);
  }, []);

  const confirmToggle = () => {
    if (selectedRow) {
      handleStatusToggle(selectedRow);
    }
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const activityColumns = useMemo(
    () =>
      getActivityColumns({
        includeStatus: true,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
        handleStatusToggle: handleConfirmStatusChange,
      }),
    [selectedTypes, handleConfirmStatusChange],
  );

  const activityColumnsWithoutStatus = useMemo(
    () =>
      getActivityColumns({
        includeStatus: false,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
      }),
    [selectedTypes],
  );

  const activityColumnsForAssessment = useMemo(
    () =>
      getActivityColumns({
        includeStatus: false, // ✅ ไม่แสดงคอลัมน์สถานะ
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
      }),
    [selectedTypes],
  );

  const activityColumnsForActive = useMemo(
    () =>
      getActivityColumns({
        includeStatus: true,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
        disableStatusToggle: true, // ✅ ปิดปุ่ม Toggle สำหรับตาราง Active
        showActivityState: true, // ✅ แสดง activity_state แทน status
      }),
    [selectedTypes],
  );

  return (
    <div style={{ 
      padding: 24, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      maxWidth: '100%',
      width: '100%',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ 
          maxWidth: "1465px", 
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <CustomCard height={500} width="1465px" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจ</h2>
            <TableRedesign
              columns={activityColumns}
              rows={filterByType(rows1) ?? []}
              height={420}
              width="100%"
              borderRadius={14}
              handleStatusToggle={handleConfirmStatusChange}
              onRowDoubleClick={handleDoubleClickActivity}
            />
          </CustomCard>
        </div>
      </div>

      <div style={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ 
          maxWidth: "1465px", 
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <CustomCard height={500} width="1465px" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจที่ร่าง</h2>
            <TableRedesign
              columns={activityColumns}
              rows={filterByType(rows2) ?? []}
              height={420}
              width="100%"
              borderRadius={14}
              handleStatusToggle={handleConfirmStatusChange}
              onRowDoubleClick={handleDoubleClickActivity}
            />
          </CustomCard>
        </div>
      </div>

      <div style={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ 
          maxWidth: "1465px", 
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <CustomCard height={500} width="1465px" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              กิจกรรมที่กำลังดำเนินการหรือจบกิจกรรมแล้ว
            </h2>
            <TableRedesign
              columns={activityColumnsForActive}
              rows={filterByType(rows3) ?? []}
              height={420}
              width="100%"
              borderRadius={14}
              onRowDoubleClick={handleDoubleClickActivity}
            />
          </CustomCard>
        </div>
      </div>

      <div style={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ 
          maxWidth: "1465px", 
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <CustomCard height={500} width="1465px">
            <h2 className="text-2xl font-semibold mb-4">
              กิจกรรมสหกิจที่ให้นิสิตทำแบบประเมิน
            </h2>
            <TableRedesign
              columns={activityColumnsForAssessment}
              rows={filterByType(rows4) ?? []}
              height={420}
              width="100%"
              borderRadius={14}
              onRowDoubleClick={handleDoubleClickActivity}
            />
          </CustomCard>
        </div>
      </div>
      <Dialog2
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmToggle}
        title="เปลี่ยนสถานะของกิจกรรม"
        message={
          <>
            คุณแน่ใจหรือไม่ที่ต้องการเปลี่ยนสถานะของกิจกรรม{" "}
            <span className="font-semibold">
              "{selectedRow?.activity_name}"
            </span>{" "}
            จาก{" "}
            <span className="text-gray-700">
              {selectedRow?.activity_status}
            </span>{" "}
            เป็น{" "}
            <span className="text-gray-700">
              {selectedRow?.activity_status === "Public" ? "Private" : "Public"}
            </span>
          </>
        }
      />
    </div>
  );
};

export default ActivityTablePage;