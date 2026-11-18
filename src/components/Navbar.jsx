import { CalendarDays, GraduationCap } from "lucide-react";


export default function Navbar({ page, onNavigate }) {
  return (
    <header className="bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate("book")}
          className="flex items-center gap-3 text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center">
            <GraduationCap size={21} />
          </span>
          <span>
            <span className="block text-[19px] font-extrabold tracking-tight text-ink leading-5">
              mentor<span className="text-brand">meet.</span>
            </span>
            <span className="text-[11px] text-slate-400 font-semibold tracking-wide">
              BOOTCAMP SUPPORT
            </span>
          </span>
        </button>
        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Main navigation"
        >
          <button
            onClick={() => onNavigate("book")}
            className={`nav-link ${page === "book" ? "nav-active" : ""}`}
          >
            <CalendarDays size={17} />
            <span className="hidden sm:inline">Book appointment</span>
            <span className="sm:hidden">Book</span>
          </button>
          <button
            onClick={() => onNavigate("appointments")}
            className={`nav-link ${page === "appointments" ? "nav-active" : ""}`}
          >
            <span className="hidden sm:inline">My appointments</span>
            <span className="sm:hidden">Upcoming</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
