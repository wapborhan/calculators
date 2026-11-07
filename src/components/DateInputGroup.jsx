import React, { useMemo } from "react";
import { MONTHS, getDaysInMonth } from "../utils/ageCalculator";

export default function DateInputGroup({
  label,
  value,
  onChange,
  idPrefix,
  maxYear = 2099,
  minYear = 1900,
}) {
  const daysInMonth = useMemo(() => {
    return getDaysInMonth(value.year, value.month);
  }, [value.year, value.month]);

  const handleDayChange = (e) => {
    onChange({ ...value, day: parseInt(e.target.value, 10) });
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    const maxDays = getDaysInMonth(value.year, newMonth);
    const adjustedDay = value.day > maxDays ? maxDays : value.day;
    onChange({ ...value, month: newMonth, day: adjustedDay });
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    const maxDays = getDaysInMonth(newYear, value.month);
    const adjustedDay = value.day > maxDays ? maxDays : value.day;
    onChange({ ...value, year: newYear, day: adjustedDay });
  };

  const dayOptions = useMemo(() => {
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [daysInMonth]);

  return (
    <div className="date-input-group">
      {label && <div className="fw-semibold mb-2">{label}</div>}
      <div className="d-flex flex-wrap gap-2 align-items-center">
        {/* Date picker (1-31) */}
        <div className="flex-fill" style={{ minWidth: "80px" }}>
          <select
            id={`${idPrefix}-day`}
            className="form-select"
            value={value.day}
            onChange={handleDayChange}
            aria-label="Select Date"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Month picker (Jan-Dec) */}
        <div className="flex-fill" style={{ minWidth: "100px" }}>
          <select
            id={`${idPrefix}-month`}
            className="form-select"
            value={value.month}
            onChange={handleMonthChange}
            aria-label="Select Month"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.short}
              </option>
            ))}
          </select>
        </div>

        {/* Year input (number) */}
        <div className="flex-fill" style={{ minWidth: "100px" }}>
          <input
            id={`${idPrefix}-year`}
            type="number"
            className="form-control"
            placeholder="Year"
            value={value.year}
            onChange={handleYearChange}
            min={minYear}
            max={maxYear}
            aria-label="Input Year"
          />
        </div>
      </div>
    </div>
  );
}

