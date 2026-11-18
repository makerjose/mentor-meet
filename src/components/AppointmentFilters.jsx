import { Search, X } from 'lucide-react';

export default function AppointmentFilters({
  search,
  setSearch,
  mentorFilter,
  setMentorFilter,
  sessionFilter,
  setSessionFilter,
  mentors,
}) {
  const hasFilters =
    search || mentorFilter !== 'all' || sessionFilter !== 'all';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search student, mentor or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        {/* Mentor filter */}
        <select
          value={mentorFilter}
          onChange={(e) => setMentorFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-3 bg-white"
        >
          <option value="all">All mentors</option>

          {mentors.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>
              {mentor.name}
            </option>
          ))}
        </select>

        {/* Session filter */}
        <select
          value={sessionFilter}
          onChange={(e) => setSessionFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-3 bg-white"
        >
          <option value="all">All sessions</option>
          <option value="morning">Morning - 7:00 AM</option>
          <option value="afternoon">Afternoon - 3:00 PM</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setSearch('');
            setMentorFilter('all');
            setSessionFilter('all');
          }}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800"
        >
          <X size={16} />
          Clear filters
        </button>
      )}
    </div>
  );
}