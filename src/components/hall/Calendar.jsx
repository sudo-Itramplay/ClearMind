import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { useCalendarDays } from '../../hooks/useCalendarDays';
import Day from './Day';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const LEGEND = [
  { level: "none", label: "None" },
  { level: "low",  label: "Low" },
  { level: "med",  label: "Med" },
  { level: "high", label: "High" },
];

const Calendar = () => {
  const { todos, isLoading } = useTodos();
  const { days, meanPending, totalCells } = useCalendarDays(todos);
  const [openKey, setOpenKey] = useState(null);
  const now = new Date();

  const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key));
  const meanLabel = meanPending.toFixed(1).replace(/\.0$/, "");

  return (
    <div className="calendar">
      <h2 className="calendar-label">{MONTHS[now.getMonth()]} {now.getFullYear()}</h2>
      <div className="calendar-days" aria-hidden="true">
        {DOW.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar-grid" role="group" aria-label="Daily activity: last week, this week, next two weeks">
        {isLoading
          ? Array.from({ length: totalCells }).map((_, i) => (
              <div key={i} className="day"><span className="sphere sphere-none" aria-hidden="true" /></div>
            ))
          : days.map((d) => (
              <Day key={d.key} day={d} isOpen={openKey === d.key} onToggle={() => toggle(d.key)} />
            ))}
      </div>
      <div
        className="calendar-legend"
        aria-label={`Pending intensity (window mean ${meanLabel}/day)`}
      >
        <span className="legend-caption">Less</span>
        {LEGEND.map((it) => (
          <span key={it.level} className="legend-item">
            <span className={`lg-dot lg-${it.level}`} aria-hidden="true" />
          </span>
        ))}
        <span className="legend-caption">More to do</span>
      </div>
    </div>
  );
};

export default Calendar;
