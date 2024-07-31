import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { COLOR_SCHEMES } from "../../utils/constants";
import './calendar.css'

function MyEventCalender({ reports, onClickHandler, setFilterMinDate, setFilterMaxDate }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (reports) {
            setEvents(reports.map(report => {
                let date = (new Date(report?.dateOfReport)).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0];
                const days = date.split('/')
                return {
                    title: report.address,
                    date: days[2] + '-' + days[1] + '-' + days[0],
                    item: report
                }
            }));
        }
    }, [reports]);

    const eventContent = ({ event }) => {
        return (
            <div className="flex flex-col px-2 py-1 border-l-2" style={{
                background: COLOR_SCHEMES[event._def.extendedProps.item.status] && COLOR_SCHEMES[event._def.extendedProps.item.status].bg,
                color: COLOR_SCHEMES[event._def.extendedProps.item.status] && COLOR_SCHEMES[event._def.extendedProps.item.status].text,
                borderColor: COLOR_SCHEMES[event._def.extendedProps.item.status] && COLOR_SCHEMES[event._def.extendedProps.item.status].text
            }}>
                <span className="tab-date text-xs font-bold">{(new Date(event._def.extendedProps.item.dateOfReport)).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0]}</span>
                <span className="tab-address text-xs font-semibold">{event._def.extendedProps.item.address}</span>
            </div>
        )
    };

    const handleEvent = (info) => {
        onClickHandler()
        setFilterMinDate(info.event._def.extendedProps.item.dateOfReport)
        setFilterMaxDate(info.event._def.extendedProps.item.dateOfReport)
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: "prevYear,prev,today,next,nextYear",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            events={events}
            eventContent={eventContent}
            dayPopoverFormat={{ month: "long", day: "numeric", year: "numeric" }}
            weekends={true}
            selectable={true}
            dayMaxEventRows={true}
            editable={true}
            eventResizableFromStart={true}
            eventClick={(info) => handleEvent(info)}
            views={{
                dayGrid: {
                    dayMaxEventRows: 3,
                },
                timeGrid: {
                    dayMaxEventRows: 3,
                },
            }}
        />
    );
}

export default MyEventCalender;
