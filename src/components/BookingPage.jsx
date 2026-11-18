import { useState } from "react";
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3,} from "lucide-react";
import Calendar from "../components/Calendar";
import MentorSelector from "../components/MentorSelector";
import SessionCard from "../components/SessionCard";
import BookingForm from "../components/BookingForm";
import { useAppointments } from "../context/AppointmentContext";
import { sessions } from "../data/sessions";
import { formatDate, isSessionPast, nextBookableDate } from "../utils/dates";


export default function BookingPage({ onNavigate }) {
  const [date, setDate] = useState(nextBookableDate);
  const [mentorId, setMentorId] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [success, setSuccess] = useState(false);
  const { appointments, mentors, loading, error, getBooking, book, refresh } =  useAppointments();
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
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700"
          >
            {error}{" "}
            <button className="underline ml-2" onClick={refresh}>
              Retry
            </button>
          </div>
        )}
        {loading && (
          <p className="mb-5 text-slate-500">
            Loading mentors and appointments…
          </p>
        )}
        {success && (
          <div
            role="status"
            className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 size={18} />
              Appointment confirmed! See it under My appointments.
            </span>
            <button
              onClick={() => setSuccess(false)}
              aria-label="Dismiss"
              className="text-lg"
            >
              ×
            </button>
          </div>
        )}
        <div className="grid lg:grid-cols-[0.94fr_1.06fr] gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="step-number">1</span>
              <div>
                <h2 className="font-bold text-ink">Pick a date</h2>
                <p className="text-xs text-slate-400">
                  Choose a day that works for you
                </p>
              </div>
            </div>
            <Calendar
              value={date}
              onChange={(d) => {
                setDate(d);
                setSuccess(false);
              }}
              appointmentDates={[...new Set(appointments.map((a) => a.date))]}
            />
            <div className="mt-5 rounded-2xl bg-violet-50 border border-violet-100 p-5 flex items-start gap-3">
              <span className="rounded-xl bg-white p-2 text-brand">
                <CalendarCheck2 size={20} />
              </span>
              <div>
                <p className="font-bold text-sm text-ink">
                  One session at a time
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-5">
                  Each mentor offers two sessions daily. Book an available slot
                  to get dedicated help with your learning journey.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="step-number">2</span>
              <div>
                <h2 className="font-bold text-ink">Choose a mentor & time</h2>
                <p className="text-xs text-slate-400">
                  Check availability for your selected date
                </p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-6">
              <MentorSelector
                mentors={mentors}
                value={selectedMentorId}
                onChange={(id) => {
                  setMentorId(id);
                  setSuccess(false);
                }}
              />
              <div className="flex items-center justify-between mt-7 mb-4">
                <div>
                  <h3 className="font-bold text-ink">Available sessions</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(date, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock3 size={14} />2 slots / day
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {sessions.map((s) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    booking={getBooking(date, selectedMentorId, s.id)}
                    passed={
                      loading ||
                      !selectedMentorId ||
                      isSessionPast(date, s.hour)
                    }
                    onBook={() => setSelectedSession(s)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {selectedSession && mentor && (
        <BookingForm
          date={date}
          mentor={mentor}
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSubmit={confirm}
        />
      )}
    </>
  );
}