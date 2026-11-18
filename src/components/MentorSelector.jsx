import { ChevronDown, Code2 } from "lucide-react";


export const avatarColors = {
  violet: "bg-violet-100 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
  teal: "bg-teal-100 text-teal-700",
};

export function MentorAvatar({ mentor, size = "md" }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center rounded-xl font-bold ${avatarColors[mentor.color] || avatarColors.violet} ${size === "sm" ? "w-10 h-10 text-xs" : "w-12 h-12 text-sm"}`}
    >
      {mentor.initials}
    </span>
  );
}

export default function MentorSelector({ value, onChange, mentors = [] }) {
  const active = mentors.find((m) => m.id === value);
  if (!active)
    return <p className="text-sm text-slate-500">No mentors available.</p>;
  return (
    <div className="relative">
      <label
        htmlFor="mentor"
        className="block text-sm font-semibold text-slate-700 mb-3"
      >
        Choose your technical mentor
      </label>
      <div className="relative">
        <select
          id="mentor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-4 pl-5 pr-12 font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
        >
          {mentors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.specialty}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-slate-50">
        <MentorAvatar mentor={active} />
        <div>
          <p className="text-sm font-bold text-ink">{active.name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Code2 size={12} />
            {active.specialty}
          </p>
        </div>
        <span className="ml-auto text-[11px] font-bold bg-white text-emerald-600 border border-emerald-100 px-2 py-1 rounded-full">
          Active TM
        </span>
      </div>
    </div>
  );
}