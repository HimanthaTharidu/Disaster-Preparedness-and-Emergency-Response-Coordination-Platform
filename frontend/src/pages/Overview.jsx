import { AlertTriangle, ClipboardList, House, Users, MapPin } from "lucide-react";
import StatusBadge from "../components/StatusBadge";


const cards = [
  { title: "Active incidents", icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  { title: "Active tasks", icon: ClipboardList, color: "bg-blue-50 text-blue-700" },
  { title: "Open shelters",  icon: House, color: "bg-emerald-50 text-emerald-700" },
  { title: "Active volunteers", icon: Users, color: "bg-amber-50 text-amber-700" }
];

export default function Overview() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Current emergency response situation across the district.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, note, icon: Icon, color }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <span className={`rounded-lg p-3 ${color}`}><Icon size={21} /></span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-800">{value}</p>
            <p className="mt-2 text-xs text-slate-500">{note}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-800">Recent incidents</h2>
        <p className="mt-1 text-xs text-slate-500">Latest reported emergencies</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3">Incident</th>
                <th className="p-3">Location</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            
          </table>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-800">Location map</h2>
          <p className="mt-1 text-xs text-slate-500">Incident map and nearest open shelter</p>
        </div>
        <div className="flex min-h-48 flex-col items-center justify-center bg-slate-100 text-slate-500">
          
        </div>
      </section>
    </div>
  );
}
