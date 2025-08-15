


import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useActivityStore } from '../../../../stores/Teacher/activity.store.teacher'

const CalendarPage = () => {
    const { activities, fetchActivities } = useActivityStore();

    useEffect(() => {
        fetchActivities(); // โหลดกิจกรรมทั้งหมด
    }, []);

    // กรองเฉพาะกิจกรรมที่เป็น Public และมีวันเริ่มกิจกรรม
    const publicEvents = activities
        .filter((a) => a.activity_status === 'Public' && a.start_activity_date)
        .map((a) => ({
            id: a.activity_id.toString(),
            title: a.activity_name,
            date: a.start_activity_date.split('T')[0], // แปลงเป็น YYYY-MM-DD
            extendedProps: {
                presenter: a.presenter_company_name,
                type: a.type,
                format: a.event_format,
                url: a.url,
            },
        }));

    return (
        <div className="w-[1000px] h-[700px] p-4 bg-white shadow rounded">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={false}
                events={publicEvents}
                height="100%"
                eventClick={(info) => {
                    const { title, extendedProps } = info.event;
                    alert(`กิจกรรม: ${title}\nบริษัท: ${extendedProps.presenter}`);
                }}
            />
        </div>
    );
};

export default CalendarPage;
