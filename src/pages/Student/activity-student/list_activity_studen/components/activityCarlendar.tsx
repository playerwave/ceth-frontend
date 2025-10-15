import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useActivityStore } from "../../../../../stores/Student/activity.store.student";

const StudentActivityCalendar = () => {
  const { activities } = useActivityStore();

  const publicEvents = useMemo(() => {
    return (activities || [])
      .filter(
        (a) =>
          a.activity_status === "Public" &&
          !!a.start_activity_date &&
          a.event_format !== "Course" &&
          ![
            "End Activity",
            "Start Assessment",
            "End Assessment",
          ].includes(a.activity_state as string)
      )
      .map((a) => {
        const baseDate = (a.start_activity_date as string).split("T")[0];
        const isHard = a.type === "Hard";
        const bgColor = isHard ? "#FFF4CC" : "#EDE7F6";
        const textColor = isHard ? "#FBBF24" : "#5E35B1";
        return {
          id: String(a.activity_id),
          title: a.activity_name,
          date: baseDate,
          backgroundColor: bgColor,
          textColor,
          extendedProps: {
            presenter: a.presenter_company_name,
            type: a.type,
            format: a.event_format,
            url: a.url,
          },
        };
      });
  }, [activities]);

  return (
    <div className="w-[1000px] h-[700px] p-4 bg-white shadow rounded">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={false}
        events={publicEvents}
        height="100%"
      />
    </div>
  );
};

export default StudentActivityCalendar;


