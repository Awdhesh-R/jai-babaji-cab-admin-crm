"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function DateRangePicker({
  id = "daterange",
  placeholder = "Select date range",
  onChange,
  className = "",
  startDate = null,   // 👈 allow parent to pass a start date
  endDate = null,     // 👈 optional: allow parent to pass end date too
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      defaultDate: startDate
        ? endDate
          ? [startDate, endDate] // if both provided
          : [startDate]          // if only start date provided
        : null,
      onChange: (selectedDates) => {
        if (onChange) onChange({
            startDate: selectedDates[0],
            endDate: selectedDates[1],
        });
      },
    });

    return () => {
      fp.destroy(); // cleanup
    };
  }, [onChange, startDate, endDate]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      // className={`border rounded-md px-3 py-2 w-full cursor-pointer ${className}`}
      className={`border rounded-md px-3 py-2 w-60 cursor-pointer ${className}`}
      placeholder={placeholder}
      readOnly
    />
  );
}
