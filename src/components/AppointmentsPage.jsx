import { useMemo, useState } from 'react';
import { CalendarPlus2, ClipboardList } from 'lucide-react';

import { useAppointments } from '../context/AppointmentContext';
import { sessions } from '../data/sessions';
import { isSessionPast } from '../utils/dates';

export default function AppointmentsPage({ onNavigate }) {
  const {
    appointments,
    mentors,
    loading,
    error,
    refresh,
    updateAppointment,
    deleteAppointment,
  } = useAppointments();

  // Search and filter state
  const [search, setSearch] = useState('');
  const [mentorFilter, setMentorFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');

  // Edit modal state
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Upcoming appointments
  const upcoming = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const session = sessions.find(
          (s) => s.id === appointment.sessionId
        );

        return (
          session &&
          !isSessionPast(appointment.date, session.hour)
        );
      })
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          sessions.findIndex((s) => s.id === a.sessionId) -
            sessions.findIndex((s) => s.id === b.sessionId)
      );
  }, [appointments]);

  // Apply search and filters
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return upcoming.filter((appointment) => {
      const mentor = mentors.find(
        (m) => m.id === appointment.mentorId
      );

      const matchesSearch =
        appointment.studentName.toLowerCase().includes(query) ||
        appointment.topic.toLowerCase().includes(query) ||
        (mentor?.name.toLowerCase().includes(query) ?? false);

      const matchesMentor =
        mentorFilter === 'all' ||
        appointment.mentorId === mentorFilter;

      const matchesSession =
        sessionFilter === 'all' ||
        appointment.sessionId === sessionFilter;

      return matchesSearch && matchesMentor && matchesSession;
    });
  }, [upcoming, mentors, search, mentorFilter, sessionFilter]);

  async function handleDelete(appointment) {
    const confirmed = window.confirm(
      `Delete the appointment for ${appointment.studentName}?`
    );

    if (!confirmed) return;

    setActionError('');
    setDeletingId(appointment.id);

    try {
      const result = await deleteAppointment(appointment.id);

      if (!result.ok) {
        setActionError(result.message);
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-16">
      <span className="inline-flex items-center gap-2 text-xs font-bold text-brand bg-violet-100 px-3 py-1.5 rounded-full">
        <ClipboardList size={15} />
        YOUR SCHEDULE
      </span>

      <div className="flex flex-wrap items-end justify-between gap-4 mt-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Upcoming appointments
          </h1>

          <p className="text-slate-500 mt-3">
            Manage confirmed mentor sessions across the bootcamp.
          </p>
        </div>

        <button
          onClick={() => onNavigate('book')}
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-3 rounded-xl font-bold text-sm"
        >
          <CalendarPlus2 size={17} />
          Book another session
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing {filteredAppointments.length} of {upcoming.length}
            {' '}upcoming appointments
          </p>
        </div>

        <span className="text-2xl font-extrabold text-ink">
          {upcoming.length}
        </span>
      </div>
    </section>
  );
}