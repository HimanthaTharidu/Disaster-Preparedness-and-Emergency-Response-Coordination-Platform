const badgeStyles = {
  Critical: "bg-red-50 text-red-700",
  High: "bg-orange-50 text-orange-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
  Reported: "bg-blue-50 text-blue-700",
  Verified: "bg-emerald-50 text-emerald-700",
  Assigned: "bg-indigo-50 text-indigo-700",
  Resolved: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[value] || "bg-slate-100 text-slate-600"}`}>
      {value || "Unknown"}
    </span>
  );
}
