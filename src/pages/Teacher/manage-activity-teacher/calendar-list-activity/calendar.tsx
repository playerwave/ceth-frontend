import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useActivityStore } from '../../../../stores/Teacher/activity.store.teacher';
import { useNavigate } from 'react-router-dom';
import { useSecureLink } from '../../../../routes/secure/SecureRoute';
import './Calendar.css'; // ✅ เพิ่มโค้ดบรรทัดนี้
const CalendarPage = () => {
    const { activities, fetchActivities } = useActivityStore();
    const { createSecureLink } = useSecureLink();
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivities(); // โหลดกิจกรรมทั้งหมด
    }, []);

    // กรองเฉพาะกิจกรรมที่เป็น Public และมีวันเริ่ม
    // const publicEvents = activities
    //     .filter((a) => a.activity_status === 'Public' && a.start_activity_date)
    //     .map((a) => ({
    //         id: a.activity_id.toString(),
    //         title: a.activity_name,
    //         date: a.start_activity_date.split('T')[0],
    //         extendedProps: {
    //             presenter: a.presenter_company_name,
    //             type: a.type,
    //             format: a.event_format,
    //             url: a.url,
    //         },
    //     }));

    const publicEvents = activities
        .filter((a) =>
            a.activity_status === 'Public' &&
            a.start_activity_date &&
            a.event_format !== 'Course' &&
            !['End Activity', 'Start Assessment', 'End Assessment'].includes(a.activity_state)
        )
        .map((a) => {
            const baseDate = a.start_activity_date.split('T')[0];

            // กำหนดสีตามประเภทกิจกรรม
            const isHard = a.type === 'Hard';
            const bgColor = isHard ? '#FFF4CC' : '#EDE7F6';
            const textColor = isHard ? '#FBBF24' : '#5E35B1';

            return {
                id: a.activity_id.toString(),
                title: a.activity_name,
                date: baseDate,
                backgroundColor: bgColor, // ✅ สีพื้นหลัง
                textColor: textColor,     // ✅ สีตัวอักษร
                extendedProps: {
                    presenter: a.presenter_company_name,
                    type: a.type,
                    format: a.event_format,
                    url: a.url,
                },
            };
        });



    // ใช้สำหรับจับ double-click บนวันที่ว่าง
    let lastClickTime = 0;

    return (
        <div className="w-[1000px] h-[700px] p-4 bg-white shadow rounded">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={false}
                events={publicEvents}
                height="100%"

                // ✅ Double-click บนกิจกรรม → ไปหน้าอัปเดตแบบเข้ารหัส
                eventDidMount={(info) => {
                    info.el.addEventListener('dblclick', () => {
                        const id = info.event.id;
                        if (id) {
                            const encryptedUrl = createSecureLink('/update-activity-admin', {
                                id: Number(id),
                                name: 'Update Activity',
                                type: 'update',
                                isActive: true,
                                timestamp: Date.now(),
                                from: 'calendar', // / ✅ ส่งต้นทาง

                            });
                            window.location.href = encryptedUrl;
                        }
                    });
                }}

                // ✅ Double-click บนวันที่ว่าง → ไปหน้า create แบบไม่เข้ารหัส
                dateClick={(info) => {
                    const now = Date.now();
                    if (now - lastClickTime < 400) {
                        const clickedDate = info.date;
                        const yyyyMMdd = clickedDate.toISOString().split('T')[0];

                        const startDate = `${yyyyMMdd}T09:00:00`;
                        const endDate = `${yyyyMMdd}T16:00:00`;

                        navigate('/create-activity-admin', {
                            state: {
                                start_activity_date: startDate,
                                end_activity_date: endDate,
                                from: 'calendar', // ✅ ส่งต้นทาง
                            },
                        });
                    }
                    lastClickTime = now;
                }}
            />
        </div>
    );
};

export default CalendarPage;
