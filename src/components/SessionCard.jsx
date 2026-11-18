import {
  Clock3,
  LockKeyhole,
  Sun,
  Sunset,
  UserRound,
  MessageSquareText,
} from "lucide-react";
import StatusBadge from "./StatusBadge";


export default function SessionCard({ session, booking, passed, onBook }) {
  const status = booking ? "booked" : passed ? "passed" : "available";
  const Icon = session.id === "morning" ? Sun : Sunset;
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-colors ${booking ? "border-rose-200 bg-rose-50/30" : passed ? "border-slate-200 bg-slate-50/60" : "border-slate-200 bg-white hover:border-brand/40"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${booking ? "bg-rose-100 text-rose-500" : "bg-violet-50 text-brand"}`}
        >
          <Icon size={21} />
        </span>
        <StatusBadge status={status} />
      </div>
      <h4 className="font-bold text-ink mt-4">{session.label}</h4>
      <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
        <Clock3 size={14} />
        {session.time}
      </p>
      {booking ? (
        <div className="mt-4 pt-4 border-t border-rose-100 space-y-2">
          <p className="flex gap-2 items-center text-xs text-slate-600">
            <UserRound size={14} className="text-rose-400" />
            <span className="font-semibold">{booking.studentName}</span>
          </p>
          <p className="flex gap-2 items-start text-xs text-slate-500">
            <MessageSquareText size={14} className="shrink-0 text-rose-400" />
            {booking.topic}
          </p>
          <div className="text-xs font-semibold text-rose-500 flex gap-1.5 items-center pt-1">
            <LockKeyhole size={13} />
            Slot already reserved
          </div>
        </div>
      ) : (
        <button
          disabled={passed}
          onClick={onBook}
          className="mt-5 w-full flex justify-center items-center gap-2 rounded-xl py-2.5 text-sm font-bold bg-brand text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {passed ? "Session passed" : "Book this slot"}
          {!passed}
        </button>
      )}
    </div>
  );
}