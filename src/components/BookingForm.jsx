import { useState } from "react";
import { X, CalendarDays, Clock3, UserRound } from "lucide-react";
import { formatDate } from "../utils/dates";


export default function BookingForm({date, mentor, session, onClose, onSubmit,}) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await onSubmit({ studentName: name, topic });
      if (!result.ok) setError(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 sm:p-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-brand uppercase tracking-wider">
              Almost there
            </p>
            <h2
              id="booking-title"
              className="text-2xl font-extrabold text-ink mt-1"
            >
              Confirm your booking
            </h2>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="rounded-xl bg-violet-50 p-4 mt-5 text-sm text-slate-700 space-y-2">
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="text-brand" />
            {formatDate(date)}
          </p>
          <p className="flex items-center gap-2">
            <UserRound size={16} className="text-brand" />
            {mentor.name}
          </p>
          <p className="flex items-center gap-2">
            <Clock3 size={16} className="text-brand" />
            {session.label} · {session.time}
          </p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Your full name
            <input
              autoFocus
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mercy"
              className="form-field mt-2"
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Discussion topic
            <textarea
              required
              maxLength={240}
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What would you like help with?"
              className="form-field mt-2 resize-none"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand text-white font-bold py-3.5"
          >
            {submitting ? "Saving…" : "Confirm appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
