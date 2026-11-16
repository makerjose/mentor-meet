import {
  CalendarDays,
  Clock3,
  MessageSquareText,
  UserRound,
  Pencil,
  Trash2,
} from 'lucide-react';

import { sessions } from '../data/sessions';
import { formatDate } from '../utils/dates';
import { MentorAvatar } from './MentorSelector';

export default function AppointmentCard({
  appointment,
  mentors = [],
  onEdit,
  onDelete,
  deleting = false,
}) {
  const mentor = mentors.find(
    (m) => m.id === appointment.mentorId
  );

  const session = sessions.find(
    (s) => s.id === appointment.sessionId
  );

  if (!mentor || !session) return null;

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center gap-3">
        <MentorAvatar mentor={mentor} size="sm" />

        <div>
          <h3 className="font-bold text-ink">{mentor.name}</h3>
          <p className="text-xs text-slate-500">
            {mentor.specialty}
          </p>
        </div>

        <span className="ml-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          Confirmed
        </span>
      </div>

      <div className="border-t border-slate-100 mt-4 pt-4 space-y-3 text-sm text-slate-600 flex-1">
        <p className="flex items-center gap-2">
          <CalendarDays size={16} className="text-brand" />
          {formatDate(appointment.date)}
        </p>

        <p className="flex items-center gap-2">
          <Clock3 size={16} className="text-brand" />
          {session.label} · {session.time}
        </p>

        <p className="flex items-center gap-2">
          <UserRound size={16} className="text-brand" />
          {appointment.studentName}
        </p>

        <p className="flex items-start gap-2">
          <MessageSquareText
            size={16}
            className="text-brand shrink-0 mt-0.5"
          />
          {appointment.topic}
        </p>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onEdit(appointment)}
          disabled={deleting}
          className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 font-semibold text-sm"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(appointment)}
          disabled={deleting}
          className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  );
}