import { useState } from "react";
import { Activity } from "../../../../types/model";
import ActivityHistoryTable from "./activity.history.table";
import Searchbar from "../../../../components/Searchbar";
import ActivityFilterBar from "./components/activity.history.filter.bar";

export const mockActivities: Activity[] = [
  {
    activity_id: 1,
    activity_name: "อบรมทักษะการสื่อสาร",
    presenter_company_name: "SkillUp Co., Ltd.",
    type: "Soft",
    description: "เรียนรู้การสื่อสารอย่างมีประสิทธิภาพในที่ทำงาน",
    seat: 50,
    recieve_hours: 3,
    event_format: "Onsite",
    create_activity_date: "2025-07-01T09:00:00Z",
    special_start_register_date: "2025-07-05T08:00:00Z",
    start_register_date: "2025-07-10T08:00:00Z",
    end_register_date: "2025-07-20T23:59:00Z",
    start_activity_date: "2025-07-25T09:00:00Z",
    end_activity_date: "2025-07-25T12:00:00Z",
    image_url: "https://example.com/images/activity1.jpg",
    activity_status: "Public",
    activity_state: "Open Register",
    status: "Active",
    last_update_activity_date: "2025-07-02T10:00:00Z",
    url: "https://example.com/activity/1",
    assessment_id: 101,
    room_id: 201,
    start_assessment: "2025-07-26T08:00:00Z",
    end_assessment: "2025-07-30T23:59:00Z",
    activityFood: [],
  },
  {
    activity_id: 2,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 3,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 4,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 5,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 6,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 7,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-08T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 8,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-07-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 9,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-10-09T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 10,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Course",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-10-01T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 11,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-10-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
  {
    activity_id: 12,
    activity_name: "หลักสูตรเขียนโปรแกรมเบื้องต้น",
    presenter_company_name: "CodeCamp Thailand",
    type: "Hard",
    description: "เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    seat: 100,
    recieve_hours: 6,
    event_format: "Online",
    create_activity_date: "2025-06-15T10:00:00Z",
    special_start_register_date: "2025-06-20T08:00:00Z",
    start_register_date: "2025-06-25T08:00:00Z",
    end_register_date: "2025-07-05T23:59:00Z",
    start_activity_date: "2025-10-10T09:00:00Z",
    end_activity_date: "2025-07-10T15:00:00Z",
    image_url: "https://example.com/images/activity2.jpg",
    activity_status: "Private",
    activity_state: "Close Register",
    status: "Inactive",
    last_update_activity_date: "2025-06-18T14:00:00Z",
    url: null,
    assessment_id: 102,
    room_id: 202,
    start_assessment: null,
    end_assessment: null,
    activityFood: [],
  },
];

const ListActivityHistoryTeacher = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    type?: string;
    year?: number;
    month?: number;
    date?: string;
    event_format?: string; // เผื่อที่อื่นยังส่งแบบเดี่ยว
    event_formats?: string[]; // ใช้ตัวนี้สำหรับ multi-select
    startDate?: string;
    endDate?: string;
  }>({});

  const [filteredActivities, setFilteredActivities] =
    useState<Activity[]>(mockActivities);

  // 🔍 ฟังก์ชันกรองข้อมูล
  function applyFilters(term: string, filterValues: typeof filters): Activity[] {
  const lowerTerm = (term || "").toLowerCase().trim();

  // ---- helper ----
  const norm = (s?: string | null) => (s ?? "").toLowerCase().trim();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const parseYMD = (s?: string) => {
    if (!s) return undefined;
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  };

  // ---- เตรียมตัวกรองเวลา/ช่วง ----
  const single = parseYMD(filterValues.date);
  const rangeStart = parseYMD(filterValues.startDate);
  const rangeEndRaw = parseYMD(filterValues.endDate);
  const rangeEnd = rangeEndRaw
    ? new Date(rangeEndRaw.getFullYear(), rangeEndRaw.getMonth(), rangeEndRaw.getDate(), 23, 59, 59, 999)
    : undefined;

  // ---- เตรียมประเภท (หลายค่า/เดี่ยว) ----
  const picked = (filterValues.event_formats ?? [])
    .map(norm)        // lowercase + trim
    .filter(Boolean);

  const pickedSingle = norm(filterValues.event_format);

  return mockActivities.filter((activity) => {
    // วันที่อ้างอิง
    const actDate = startOfDay(new Date(activity.start_activity_date));

    // คำค้น
    const matchesSearch =
      norm(activity.activity_name).includes(lowerTerm) ||
      norm(activity.presenter_company_name).includes(lowerTerm);

    // ประเภท (Hard/Soft) ถ้าไม่ได้เลือกให้ผ่าน
    const matchesType = filterValues.type ? activity.type === filterValues.type : true;

    // ปี ถ้าไม่ได้เลือกให้ผ่าน
    const matchesYear = typeof filterValues.year === "number"
      ? actDate.getFullYear() === filterValues.year
      : true;

    // เดือน: ต้องเป็นเลข 0–11
    const matchesMonth = typeof filterValues.month === "number"
      ? actDate.getMonth() === filterValues.month
      : true;

    // วันเดียว vs ช่วง (ไม่ให้ทับกัน)
    const matchesSingleDate = single ? actDate.getTime() === startOfDay(single).getTime() : true;
    const matchesRange =
      (rangeStart || rangeEnd)
        ? (!rangeStart || actDate >= startOfDay(rangeStart)) &&
          (!rangeEnd || actDate <= rangeEnd)
        : true;
    const dateOK = single ? matchesSingleDate : matchesRange;

    // รูปแบบกิจกรรม (Online/Onsite/Course)
    const actFmt = norm(activity.event_format);

    // เงื่อนไข:
    // - ถ้ามี picked (หลายค่า) -> ต้องอยู่ใน picked
    // - ถ้าไม่มี picked แต่มี event_format เดี่ยว -> ต้องเท่ากัน
    // - ถ้าไม่เลือกอะไรเลย -> ให้ "แสดงทั้งหมด" หรือถ้าอยากให้ว่างเปล่า ให้เปลี่ยน true เป็น false
    const matchesFormat =
      picked.length > 0
        ? picked.includes(actFmt)
        : (pickedSingle ? actFmt === pickedSingle : true);

    return (
      matchesSearch &&
      matchesType &&
      matchesYear &&
      matchesMonth &&
      dateOK &&
      matchesFormat
    );
  });
}


  // 📌 เมื่อมีการค้นหา
  function handleSearch(term: string): void {
    setSearchTerm(term);
    const results = applyFilters(term, filters);
    setFilteredActivities(results);
  }

  // 📌 เมื่อมีการเปลี่ยน filter
  function handleFilterChange(updatedFilter: typeof filters): void {
    const newFilters = { ...filters, ...updatedFilter };
    setFilters(newFilters);
    const results = applyFilters(searchTerm, newFilters);
    setFilteredActivities(results);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-10 mt-10">
      <div className="w-full max-w-screen-xl flex flex-col items-center justify-center">
        <h1 className="text-center text-3xl font-bold mb-9 mt-4">
          ประวัติกิจกรรม
        </h1>

        <div className="flex justify-center w-full mb-4">
          <Searchbar onSearch={handleSearch} />
        </div>

        <ActivityFilterBar
          typeOptions={["Course", "Online", "Onsite"]}
          yearOptions={Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)}
          monthOptions={[
            { label: "มกราคม", value: 0 },
            { label: "กุมภาพันธ์", value: 1 },
            { label: "มีนาคม", value: 2 },
            { label: "เมษายน", value: 3 },
            { label: "พฤษภาคม", value: 4 },
            { label: "มิถุนายน", value: 5 },
            { label: "กรกฎาคม", value: 6 },
            { label: "สิงหาคม", value: 7 },
            { label: "กันยายน", value: 8 },
            { label: "ตุลาคม", value: 9 },
            { label: "พฤศจิกายน", value: 10 },
            { label: "ธันวาคม", value: 11 },
          ]}
          onFilterChange={handleFilterChange}
        />

        <div className="w-full">
          <ActivityHistoryTable rows1={filteredActivities} />
        </div>
      </div>
    </div>
  );
};

export default ListActivityHistoryTeacher;
