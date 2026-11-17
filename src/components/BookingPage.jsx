import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAppointments } from "../context/AppointmentContext";
import { nextBookableDate } from "../utils/dates";

export default function BookingPage({ onNavigate }) {
  const [date, setDate] = useState(nextBookableDate);
  const [mentorId, setMentorId] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [success, setSuccess] = useState(false);
  const { appointments, mentors, loading, error, getBooking, book, refresh } = useAppointments();
  const selectedMentorId = mentors.some((m) => m.id === mentorId)
    ? mentorId
    : mentors[0]?.id || "";
  const mentor = mentors.find((m) => m.id === selectedMentorId);

  async function confirm(values) {
    const result = await book({
      date,
      mentorId: selectedMentorId,
      sessionId: selectedSession.id,
      ...values,
    });
    if (result.ok) {
      setSelectedSession(null);
      setSuccess(true);
    }
    return result;
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-16">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-9">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4 tracking-tight">
              Book a mentor session <span className="inline-block">✦</span>
            </h1>
            <p className="text-slate-500 mt-3 max-w-xl">
              Stuck on a bug or need a second opinion? Find a time with one of
              our technical mentors.
            </p>
          </div>
          <button
            onClick={() => onNavigate("appointments")}
            className="text-sm font-bold text-brand flex items-center gap-2 hover:underline"
          >
            View appointments <ArrowRight size={16} />
          </button>
        </div>
        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}{" "}
            <button className="underline ml-2" onClick={refresh}>Retry</button>
          </div>
        )}
        {loading && <p className="mb-5 text-slate-500">Loading mentors and appointments…</p>}
        {success && (
          <div role="status" className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 size={18} />
              Appointment confirmed! See it under My appointments.
            </span>
            <button onClick={() => setSuccess(false)} aria-label="Dismiss" className="text-lg">×</button>
          </div>
        )}
      </section>
    </>
  );
}