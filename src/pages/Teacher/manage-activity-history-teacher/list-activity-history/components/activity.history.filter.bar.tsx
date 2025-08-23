import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";
import CustomDropdown from "../components/CustomDropdown";

interface ActivityFilterBarProps {
  typeOptions: string[];
  yearOptions: number[];
  monthOptions: { label: string; value: number }[];
  isDialogOpen?: boolean
  onFilterChange: (filters: {
    type?: string;
    year?: number;
    month?: number;
    date?: string;
    startDate?: string;
    endDate?: string;
    event_format?: string;
    event_formats?: string[];
    
  }) => void;
}

/* ปุ่มสไตล์เดียวกัน */
const btnBase =
  "h-10 px-4 min-w-[140px] rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold " +
  "hover:brightness-95 outline-none focus:outline-none focus:ring-0 border-0 shadow-sm";

const MultiSelectCheckbox: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  const isChecked = (v: string) => selected.includes(v);
  const toggleValue = (v: string) =>
    isChecked(v)
      ? onChange(selected.filter((s) => s !== v))
      : onChange([...selected, v]);

  return (
    <div className="relative">
      <button type="button" onClick={toggle} className={btnBase}>
        {selected.length ? `${label} (${selected.length})` : label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black/10 z-40">
          <div className="max-h-64 overflow-auto py-1">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked(opt)}
                  onChange={() => toggleValue(opt)}
                  className="accent-[#1E3A8A] w-4 h-4"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityFilterBar: React.FC<ActivityFilterBarProps> = ({
  yearOptions,
  monthOptions,
  onFilterChange,
  isDialogOpen = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  const [yearValue, setYearValue] = useState<string | number | null>(null);
  const [monthValue, setMonthValue] = useState<string | number | null>(null);
  React.useEffect(() => {
    if (isDialogOpen) setCalendarOpen(false);
  }, [isDialogOpen]);


  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const toggle = () => setShowFilters(!showFilters);

  const handleDateChange = (value: Date | Date[]) => {
    const date = value instanceof Date ? value : null;
    setSelectedDate(date);
    setCalendarOpen(false);
    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      onFilterChange({ date: `${y}-${m}-${d}`, startDate: "", endDate: "" });
    } else {
      onFilterChange({ date: "" });
    }
  };

  const formatBuddhistDate = (date: Date | null) => {
    if (!date) return "เลือกวัน / เดือน / ปี";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  };
  

  return (
    <div className="activity-filterbar w-full flex flex-col items-center mb-6">
      <div className="w-full flex justify-between items-center px-8 py-4 gap-4 relative overflow-visible">
        {/* Toggle โหมด */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="ml-14 w-20 h-10 flex items-center rounded-full p-1 transition duration-300 bg-[#1E3A8A]"
          >
            <div
              className={`bg-white w-7 h-7 rounded-full shadow-md transform transition duration-300 ${
                showFilters ? "translate-x-10" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-xl text-black">
            โหมด: {showFilters ? "ธรรมดา" : "ช่วง"}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-end">
          {showFilters ? (
            <>
              <MultiSelectCheckbox
                label="เลือกประเภท"
                options={["Onsite", "Online", "Course"]}
                selected={selectedFormats}
                onChange={(next) => {
                  setSelectedFormats(next);
                  onFilterChange({ event_formats: next });
                }}
              />

              {/* ปี */}
              <CustomDropdown
                placeholder="เลือกปี"
                value={yearValue}
                options={Array.from({ length: 6 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return { label: String(y), value: y };
                })}
                onChange={(v) => {
                  setYearValue(v);
                  onFilterChange({ year: v === null ? undefined : Number(v) });
                }}
                className="min-w-[120px]"
              />

              {/* เดือน */}
              <CustomDropdown
                placeholder="เลือกเดือน"
                value={monthValue}
                options={monthOptions}
                onChange={(v) => {
                  setMonthValue(v);
                  onFilterChange({ month: v === null ? undefined : Number(v) });
                }}
                className="min-w-[140px]"
              />

              {/* วันเดียว */}
              <div className="relative z-10">
                <button
                  className={btnBase + " min-w-[160px]"}
                  onClick={() => {
                    if (selectedDate) {
                      setSelectedDate(null);
                      onFilterChange({ date: "" });
                    } else {
                      toggleCalendar();
                    }
                  }}
                >
                  {formatBuddhistDate(selectedDate)}
                </button>

                {calendarOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl shadow-lg p-4 calendar-popover">
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate || new Date()}
                      locale="th-TH"
                      calendarType="gregory"
                      tileClassName={({ date, view }) =>
                        view === "month" && date.getDay() === 0
                          ? "text-red-500"
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* ช่วงวันที่ */}
              <div className="relative z-10">
                <button
                  className={btnBase + " min-w-[160px]"}
                  onClick={() => {
                    if (startDate || endDate) {
                      setStartDate(null);
                      setEndDate(null);
                      onFilterChange({ startDate: "", endDate: "" });
                    } else {
                      toggleCalendar();
                    }
                  }}
                >
                  {formatBuddhistDate(startDate)} - {formatBuddhistDate(endDate)}
                </button>

                {calendarOpen && (
                  <div className="absolute mt-2 right-0 bg-white rounded-xl shadow-lg p-4 calendar-popover">
                    <Calendar
                      selectRange
                      onChange={(value) => {
                        if (Array.isArray(value)) {
                          const [startVal, endVal] = value;
                          const fmt = (dt?: Date | null) =>
                            dt
                              ? `${dt.getFullYear()}-${String(
                                  dt.getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  dt.getDate()
                                ).padStart(2, "0")}`
                              : "";
                          setStartDate(startVal ?? null);
                          setEndDate(endVal ?? null);
                          onFilterChange({
                            startDate: fmt(startVal),
                            endDate: fmt(endVal),
                            date: "",
                          });
                          setCalendarOpen(false);
                        }
                      }}
                      value={
                        startDate && endDate ? [startDate, endDate] : undefined
                      }
                      locale="th-TH"
                      calendarType="gregory"
                      tileClassName={({ date, view }) =>
                        view === "month" && date.getDay() === 0
                          ? "text-red-500"
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFilterBar;
