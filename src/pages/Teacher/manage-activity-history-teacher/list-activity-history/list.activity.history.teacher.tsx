import { useEffect, useMemo, useState } from "react";
import { Activity } from "../../../../types/model";
import ActivityHistoryTable from "./activity.history.table";
import Searchbar from "../../../../components/Searchbar";
import ActivityFilterBar from "./components/activity.history.filter.bar";
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher"; // <-- เพิ่ม


const ListActivityHistoryTeacher = () => {

  const { activities, loading, error, fetchEndedActivities } = useActivityStore();
  // ถ้าต้องการดึงทั้งหมดให้เปลี่ยนเป็น fetchActivities()

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    type?: string;
    year?: number;
    month?: number;
    date?: string;
    event_format?: string;
    event_formats?: string[];
    startDate?: string;
    endDate?: string;
  }>({});

  // โหลดข้อมูลเมื่อเข้าหน้า
  useEffect(() => {
    fetchEndedActivities(); // หรือ fetchActivities()
  }, [fetchEndedActivities]);

  // ฟังก์ชันกรอง (ปรับให้รับ list เข้ามาแทน refer mock)
  function applyFilters(
    baseList: Activity[],
    term: string,
    filterValues: typeof filters
  ): Activity[] {
    const lowerTerm = (term || "").toLowerCase().trim();
    const norm = (s?: string | null) => (s ?? "").toLowerCase().trim();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const parseYMD = (s?: string) => {
      if (!s) return undefined;
      const [y, m, d] = s.split("-").map(Number);
      if (!y || !m || !d) return undefined;
      return new Date(y, m - 1, d);
    };

    const single = parseYMD(filterValues.date);
    const rangeStart = parseYMD(filterValues.startDate);
    const rangeEndRaw = parseYMD(filterValues.endDate);
    const rangeEnd = rangeEndRaw
      ? new Date(rangeEndRaw.getFullYear(), rangeEndRaw.getMonth(), rangeEndRaw.getDate(), 23, 59, 59, 999)
      : undefined;

    const picked = (filterValues.event_formats ?? []).map(norm).filter(Boolean);
    const pickedSingle = norm(filterValues.event_format);

    return baseList.filter((activity) => {
      const actDate = startOfDay(new Date(activity.start_activity_date));

      const matchesSearch =
        norm(activity.activity_name).includes(lowerTerm) ||
        norm(activity.presenter_company_name).includes(lowerTerm);

      // หมายเหตุ: type ในโมเดลของคุณคือ "Hard/Soft"
      const matchesType = filterValues.type ? activity.type === filterValues.type : true;

      const matchesYear = typeof filterValues.year === "number"
        ? actDate.getFullYear() === filterValues.year
        : true;

      const matchesMonth = typeof filterValues.month === "number"
        ? actDate.getMonth() === filterValues.month
        : true;

      const matchesSingleDate = single ? actDate.getTime() === startOfDay(single).getTime() : true;
      const matchesRange =
        (rangeStart || rangeEnd)
          ? (!rangeStart || actDate >= startOfDay(rangeStart)) &&
            (!rangeEnd || actDate <= rangeEnd)
          : true;
      const dateOK = single ? matchesSingleDate : matchesRange;

      const actFmt = norm(activity.event_format);
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

  // คำนวณรายการที่กรองแล้ว (จะรันใหม่เมื่อ activities/search/filters เปลี่ยน)
  const filteredActivities = useMemo(
    () => applyFilters(activities ?? [], searchTerm, filters),
    [activities, searchTerm, filters]
  );

  function handleSearch(term: string) {
    setSearchTerm(term);
  }

  function handleFilterChange(updatedFilter: typeof filters) {
    setFilters((prev) => ({ ...prev, ...updatedFilter }));
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
          // ✅ แก้ให้ตรงกับข้อมูลจริง
          // type = Hard/Soft (เดิมคุณส่ง Course/Online/Onsite ซึ่งเป็น format)
          typeOptions={["Hard", "Soft"]}
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

        {loading && <p className="mt-4">⏳ กำลังโหลด...</p>}
        {error && <p className="mt-4 text-red-600">❌ {error}</p>}

        {!loading && !error && (
          <div className="w-full">
            <ActivityHistoryTable rows1={filteredActivities}  />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListActivityHistoryTeacher;
