export default function StatusBadge({ status }) {
    // Define styles for different statuses
  const styles = {
    available: "bg-emerald-50 text-emerald-700",
    booked: "bg-rose-50 text-rose-600",
    passed: "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${styles[status]}`}
    >
      {status === "passed" ? "Unavailable" : status}
    </span>
  );
}
