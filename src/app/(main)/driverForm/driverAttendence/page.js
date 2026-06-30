"use client";

import { useState } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

export default function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025 default

  // ----- Static Attendance Data EXACT like screenshot -----
  const attendance = {
    "2025-07-01": "present",
    "2025-07-02": "present",
    "2025-07-03": "present",
    "2025-07-04": "present",
    "2025-07-05": "present",

    "2025-07-08": "present",
    "2025-07-09": "present",
    "2025-07-10": "absent",
    "2025-07-11": "present",
    "2025-07-12": "present",

    "2025-07-15": "present",
    "2025-07-16": "present",
    "2025-07-17": "present",
    "2025-07-18": "absent",
    "2025-07-19": "absent",

    "2025-07-22": "present",
    "2025-07-23": "present",
    "2025-07-24": "present",
    "2025-07-25": "present",
    "2025-07-26": "present",

    "2025-07-29": "present",
    "2025-07-30": "present",
    "2025-07-31": "present",
  };

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: firstDay,
    end: lastDay,
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2023 + i);

  const changeMonth = (e) => {
    const m = Number(e.target.value);
    const updated = new Date(currentDate);
    updated.setMonth(m);
    setCurrentDate(updated);
  };

  const changeYear = (e) => {
    const y = Number(e.target.value);
    const updated = new Date(currentDate);
    updated.setFullYear(y);
    setCurrentDate(updated);
  };

  return (
    <div className="w-full max-w-[660px]  shadow-md rounded-xl overflow-hidden bg-white ">

      {/* -------- HEADER (same blue as screenshot) ------- */}
      <div className="bg-[#053DEB] px-5 py-4 md:flex md:justify-between md:items-center ">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <MdOutlineCalendarMonth />
 Attendance History
        </h2>
        <div className="flex gap-2">
          <select
            className="bg-white text-black px-3 py-1 rounded-md"
            value={currentDate.getMonth()}
            onChange={changeMonth}
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <select
            className="bg-white text-black px-3 py-1 rounded-md"
            value={currentDate.getFullYear()}
            onChange={changeYear}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>








      {/* Month Title + Prev / Next Buttons */}
<div className="flex items-center justify-between py-3 px-5">

  {/* LEFT SIDE - Previous Month */}
  <button
    onClick={() => {
      const updated = new Date(currentDate);
      updated.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(new Date(updated));
    }}
    className="text-xl px-2 hover:text-blue-600"
  >
    ◀
  </button>

  {/* CENTER - Month Title */}
  <h3 className="text-lg font-medium text-center">
    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
  </h3>

  {/* RIGHT SIDE - Next Month */}
  <button
    onClick={() => {
      const updated = new Date(currentDate);
      updated.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(new Date(updated));
    }}
    className="text-xl px-2 hover:text-blue-600"
  >
    ▶
  </button>
</div>










      {/* -------- Calendar Box -------- */}
      <div className="border mx-5 rounded-xl p-5">
        
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold mb-3 text-[8px] md:text-[16px]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-5 text-center text-[15px]">

           {[...Array(firstDay.getDay())].map((_, i) => (
            <div key={i}></div>
          ))}

           {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const mark = attendance[key];

            return (
              <div key={key} className="relative">

                 {mark === "present" && (
                  <div className="w-3 h-3 bg-green-600 rounded-full absolute right-1 top-0"></div>
                )}
                {mark === "absent" && (
                  <div className="w-3 h-3 bg-red-600 rounded-full absolute right-1 top-0"></div>
                )}

                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>

      {/* -------- Footer -------- */}
      <div className="py-4 text-center text-sm flex justify-center gap-5">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-600 rounded-full"></span> Present
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full"></span> Absent
        </span>
      </div>
    </div>
  );
}
