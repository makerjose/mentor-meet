import { useState } from 'react';
import { X } from 'lucide-react';
import Calendar from './Calendar';
import { sessions } from '../data/sessions';
import { isSessionPast, isWeekend } from '../utils/dates';

export default function EditAppointmentModal({
  appointment,
  mentors,
  appointments,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    date: appointment.date,
    mentorId: appointment.mentorId,
    sessionId: appointment.sessionId,
    studentName: appointment.studentName,
    topic: appointment.topic,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedSession = sessions.find(
    (session) => session.id === form.sessionId
  );

  const invalidDate =
    !selectedSession ||
    isWeekend(form.date) ||
    isSessionPast(form.date, selectedSession.hour);

  const conflictingAppointment = appointments.find(
    (item) =>
      item.id !== appointment.id &&
      item.date === form.date &&
      item.mentorId === form.mentorId &&
      item.sessionId === form.sessionId
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (invalidDate || conflictingAppointment) {
      setError('Please choose an available future session.');
      return;
    }

    setSaving(true);

    try {
      const result = await onSave(appointment.id, form);

      if (result.ok) {
        onClose();
      } else {
        setError(result.message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-appointment-title"
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="edit-appointment-title"
            className="text-xl font-bold text-slate-900"
          >
            Edit Appointment
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Student Name
            </label>
            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Discussion Topic
            </label>
            <textarea
              name="topic"
              value={form.topic}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Appointment Date
            </label>

            <Calendar
              value={form.date}
              onChange={(date) =>
                setForm((prev) => ({ ...prev, date }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Technical Mentor
            </label>
            <select
              name="mentorId"
              value={form.mentorId}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Session
            </label>

            <div className="grid grid-cols-2 gap-3">
              {sessions.map((session) => {
                const booked = appointments.some(
                  (item) =>
                    item.id !== appointment.id &&
                    item.date === form.date &&
                    item.mentorId === form.mentorId &&
                    item.sessionId === session.id
                );

                const unavailable =
                  booked ||
                  isWeekend(form.date) ||
                  isSessionPast(form.date, session.hour);

                return (
                  <button
                    key={session.id}
                    type="button"
                    disabled={unavailable || saving}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        sessionId: session.id,
                      }))
                    }
                    className={`p-3 rounded-xl border text-sm font-semibold ${
                      booked
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : unavailable
                          ? 'bg-slate-100 text-slate-400'
                          : form.sessionId === session.id
                            ? 'bg-violet-100 border-violet-500 text-violet-700'
                            : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="block">{session.label}</span>
                    <span className="block text-xs mt-1">
                      {booked ? 'Booked' : session.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-3 border rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || invalidDate || !!conflictingAppointment}
              className="px-5 py-3 bg-violet-600 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}