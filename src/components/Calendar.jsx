import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { nextBookableDate, toDateKey } from "../utils/dates";
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];


export default function Calendar({ value, onChange, appointmentDates = [] }) {

  const selected = new Date(`${value}T12:00:00`);
  const [view, setView] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  const today = toDateKey(new Date());
  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = Array.from(
    { length: Math.ceil((firstDay + count) / 7) * 7 },
    (_, i) => i - firstDay + 1,
  );

  const isCurrentMonth =
    view.getFullYear() === new Date().getFullYear() &&
    view.getMonth() === new Date().getMonth();
  
    function shiftMonth(offset) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + offset, 1));
  }
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-ink">
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-2">
          <button
            aria-label="Previous month"
            disabled={isCurrentMonth}
            onClick={() => shiftMonth(-1)}
            className="calendar-arrow"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
            className="calendar-arrow"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {weekdays.map((d) => (
          <span key={d} className="text-xs font-semibold text-slate-400 pb-2">
            {d}
          </span>
        ))}
        {cells.map((day, index) => {
          if (day < 1 || day > count) return <span key={index} />;
          const key = toDateKey(
            new Date(view.getFullYear(), view.getMonth(), day),
          );
          const weekend = [0, 6].includes(new Date(`${key}T12:00:00`).getDay());
          const past = key < today;
          const disabled = past || weekend;
          const active = key === value;
          return (
            <button
              key={key}
              disabled={disabled}
              title={
                weekend
                  ? "No appointments on weekends"
                  : past
                    ? "Past date"
                    : undefined
              }
              onClick={() => onChange(key)}
              aria-label={key}
              aria-pressed={active}
              className={`relative mx-auto w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${active ? "bg-brand text-white shadow-md shadow-violet-200" : disabled ? "text-slate-300 cursor-not-allowed bg-slate-50" : key === today ? "bg-violet-50 text-brand hover:bg-violet-100" : "text-slate-700 hover:bg-slate-100"}`}
            >
              {day}
              {appointmentDates.includes(key) && !active && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand" />
          Dates with bookings · Weekends unavailable
        </span>
        <button
          onClick={() => {
            const key = nextBookableDate();
            const d = new Date(`${key}T12:00:00`);
            onChange(key);
            setView(new Date(d.getFullYear(), d.getMonth(), 1));
          }}
          className="text-brand font-semibold"
        >
          Next bookable day
        </button>
      </div>
    </div>
  );
}
