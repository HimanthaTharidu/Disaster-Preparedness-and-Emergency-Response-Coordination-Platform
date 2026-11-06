import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Plus,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { getIncidents } from "../api/incidents.js";
import { getCurrentUser } from "../api/auth.js";

const priorityStyles = {
  critical: "bg-[#c83e3e] text-white",
  high: "bg-[#b94e25] text-white",
  medium: "bg-[#e8b84c] text-slate-900",
  low: "bg-slate-100 text-slate-600",
};

const statusStyles = {
  new: "border-slate-400 text-slate-600",
  reported: "border-slate-400 text-slate-600",
  verified: "border-blue-400 text-blue-700",
  assigned: "border-amber-400 text-amber-700",
  resolved: "border-green-400 text-green-700",
};

function displayStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value === "new" || value === "reported") {
    return "Reported";
  }

  return value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "—";
}

function formatReported(date) {
  if (!date) return "—";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "—";

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 60000)
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hr ago`;

  return `${Math.floor(hours / 24)} days ago`;
}

function Filter({ label, value, onChange, options }) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1 block text-[11px] font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[38px] w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-[#293d64] focus:ring-1 focus:ring-[#293d64]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function exportCSV(incidents) {
  const headers = [
    "ID",
    "Hazard",
    "Area",
    "Priority",
    "Status",
    "Reported",
  ];

  const rows = incidents.map((item) => [
    item.id,
    item.hazard,
    item.place,
    item.priority,
    displayStatus(item.status),
    item.reportedAt,
  ]);

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "incident-queue.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export default function Incidents() {
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  console.log("Logged-in user:", currentUser);
  console.log("User role:", currentUser?.role);

  const [incidents, setIncidents] = useState([]);
  const [status, setStatus] = useState("");
  const [hazard, setHazard] = useState("");
  const [priority, setPriority] = useState("");
  const [area, setArea] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadIncidents() {
    try {
      setLoading(true);
      setError("");

      const data = await getIncidents({
        status: status || undefined,
        priority: priority || undefined,
      });

      setIncidents(data);
    } catch (err) {
      setError(err.message || "Unable to load incidents.");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, [status, priority]);

  const hazards = useMemo(
    () =>
      [...new Set(
        incidents.map((item) => item.hazard).filter(Boolean)
      )].sort(),
    [incidents]
  );

  const areas = useMemo(
    () =>
      [...new Set(
        incidents.map((item) => item.place).filter(Boolean)
      )].sort(),
    [incidents]
  );

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      return (
        (!hazard || item.hazard === hazard) &&
        (!area || item.place === area)
      );
    });
  }, [incidents, hazard, area]);

  return (
    <div className="space-y-3">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">
          Incident queue
        </h1>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          <Filter
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "", label: "All" },
              { value: "new", label: "Reported" },
              { value: "verified", label: "Verified" },
              { value: "assigned", label: "Assigned" },
              { value: "resolved", label: "Resolved" },
            ]}
          />

          <Filter
            label="Hazard"
            value={hazard}
            onChange={setHazard}
            options={[
              { value: "", label: "All" },
              ...hazards.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />

          <Filter
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={[
              { value: "", label: "All" },
              { value: "critical", label: "Critical" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />

          <Filter
            label="Area"
            value={area}
            onChange={setArea}
            options={[
              { value: "", label: "All" },
              ...areas.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => exportCSV(filteredIncidents)}
            disabled={!filteredIncidents.length}
            className="flex h-[38px] items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-[#293d64] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={14} />
            Export list
          </button>

          <button
  type="button"
  disabled
  className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#293d64] px-5 text-sm font-medium text-white transition hover:bg-[#203252] disabled:cursor-not-allowed"
>
  <Plus size={18} />
  <span>New incident</span>
</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f0f3f8] text-[11px] font-medium text-slate-600">
                <th className="px-3 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">Hazard</th>
                <th className="px-3 py-3 font-medium">Area</th>
                <th className="px-3 py-3 font-medium">Priority</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Reported</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <RefreshCw
                      size={18}
                      className="mx-auto mb-2 animate-spin text-[#293d64]"
                    />
                    <p className="text-xs text-slate-500">
                      Loading incidents...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <AlertTriangle
                      size={22}
                      className="mx-auto mb-2 text-red-500"
                    />
                    <p className="text-sm font-semibold text-red-700">
                      Unable to load incidents
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={loadIncidents}
                      className="mt-3 rounded-md bg-[#293d64] px-4 py-2 text-xs font-medium text-white"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : filteredIncidents.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-12 text-center text-xs text-slate-500"
                  >
                    No incidents found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/incidents/${item.id}`)}
                    className={`cursor-pointer text-[11px] text-slate-700 transition hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f0f3f8]"
                    }`}
                  >
                    <td className="px-3 py-3 font-semibold text-[#263653]">
                      {item.id}
                    </td>

                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3b75b5]" />
                        {item.hazard || "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      {item.place || "—"}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
                          priorityStyles[item.priority?.toLowerCase()] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.priority === "critical" && (
                          <AlertTriangle size={10} />
                        )}
                        {item.priority
                          ? item.priority.charAt(0).toUpperCase() +
                            item.priority.slice(1)
                          : "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${
                          statusStyles[item.status?.toLowerCase()] ||
                          "border-slate-300 text-slate-600"
                        }`}
                      >
                        <span className="h-1 w-1 rounded-full bg-current" />
                        {displayStatus(item.status)}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-slate-500">
                      {formatReported(item.reportedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && filteredIncidents.length > 0 && (
          <div className="border-t border-slate-100 px-3 py-3 text-[10px] text-slate-500">
            Showing 1 to {filteredIncidents.length} of{" "}
            {filteredIncidents.length} incidents.
          </div>
        )}
      </div>
    </div>
  );
}
