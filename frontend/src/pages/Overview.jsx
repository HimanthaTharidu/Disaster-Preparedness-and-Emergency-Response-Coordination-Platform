import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { getIncidents } from "../api/incidents.js";
import { getShelters } from "../api/shelters.js";

const priorityColors = {
  critical: "#c83e3e",
  high: "#c65a24",
  medium: "#e5a832",
  low: "#64748b",
};

function formatTime(date) {
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

function displayStatus(status) {
  if (status === "new" || status === "reported") {
    return "Reported";
  }

  return status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";
}

function SummaryCard({ title, value, note }) {
  return (
    <div className="min-h-[112px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-800">
        {value}
      </p>

      {note && (
        <p className="mt-1 text-xs text-slate-500">
          {note}
        </p>
      )}
    </div>
  );
}

export default function Overview() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [shelters, setShelters] = useState([]);

  const [incidentError, setIncidentError] = useState("");
  const [shelterError, setShelterError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    setIncidentError("");
    setShelterError("");

    const [incidentResult, shelterResult] =
      await Promise.allSettled([
        getIncidents(),
        getShelters(),
      ]);

    if (incidentResult.status === "fulfilled") {
      setIncidents(incidentResult.value);
    } else {
      setIncidents([]);
      setIncidentError(
        incidentResult.reason?.message ||
          "Unable to load incidents."
      );
    }

    if (shelterResult.status === "fulfilled") {
      setShelters(shelterResult.value);
    } else {
      setShelters([]);
      setShelterError(
        shelterResult.reason?.message ||
          "Unable to load shelters."
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const activeIncidents = incidents.filter(
    (incident) =>
      String(incident.status).toLowerCase() !== "resolved"
  ).length;

  const openShelters = shelters.filter(
    (shelter) =>
      String(shelter.status).toLowerCase() === "open"
  ).length;

  const recentIncidents = useMemo(() => {
    return [...incidents]
      .sort(
        (a, b) =>
          new Date(b.reportedAt).getTime() -
          new Date(a.reportedAt).getTime()
      )
      .slice(0, 5);
  }, [incidents]);

  const cards = [
    {
      title: "Active incidents",
      value: loading
        ? "..."
        : incidentError
          ? "—"
          : activeIncidents,
      note: incidentError || "Unresolved emergency incidents",
    },
    {
      title: "Active tasks",
      value: "—",
    },
    {
      title: "Open shelters",
      value: loading
        ? "..."
        : shelterError
          ? "—"
          : openShelters,
      note: shelterError || "Currently open shelters",
    },
    {
      title: "Active volunteers",
      value: "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Current emergency response situation across the district.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <SummaryCard
            key={card.title}
            {...card}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.8fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h2 className="font-bold text-slate-800">
                Incident location map
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Incident locations and priority levels
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {incidents.length} incidents
            </span>
          </div>

          <div className="h-[430px] overflow-hidden rounded-lg">
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {incidents.map((incident) => {
                const lat = Number(incident.lat);
                const lng = Number(incident.lng);

                if (
                  !Number.isFinite(lat) ||
                  !Number.isFinite(lng)
                ) {
                  return null;
                }

                const priority = String(
                  incident.priority || "low"
                ).toLowerCase();

                const markerColor =
                  priorityColors[priority] || "#64748b";

                return (
                  <CircleMarker
                    key={incident.id}
                    center={[lat, lng]}
                    radius={
                      priority === "critical" ? 11 : 8
                    }
                    pathOptions={{
                      color: "#ffffff",
                      weight: 2,
                      fillColor: markerColor,
                      fillOpacity: 0.95,
                    }}
                  >
                    <Popup>
                      <div className="min-w-[150px]">
                        <strong>{incident.title}</strong>

                        <p className="mt-1 text-sm">
                          {incident.place}
                        </p>

                        <p className="mt-1 text-sm">
                          Priority: {priority}
                        </p>

                        <p className="text-sm">
                          Status: {displayStatus(incident.status)}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/incidents/${incident.id}`)
                          }
                          className="mt-2 text-sm font-semibold text-blue-700"
                        >
                          View incident
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {shelters.map((shelter) => {
                const lat = Number(shelter.lat);
                const lng = Number(shelter.lng);

                if (
                  !Number.isFinite(lat) ||
                  !Number.isFinite(lng)
                ) {
                  return null;
                }

                return (
                  <CircleMarker
                    key={`shelter-${shelter.id}`}
                    center={[lat, lng]}
                    radius={6}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 2,
                      fillColor: "#25865b",
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <strong>{shelter.name}</strong>
                      <p>{shelter.place}</p>
                      <p>Status: {shelter.status}</p>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 px-2 pt-3 text-xs text-slate-600">
            {Object.entries(priorityColors).map(
              ([priority, color]) => (
                <span
                  key={priority}
                  className="flex items-center gap-2"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />

                  {priority.charAt(0).toUpperCase() +
                    priority.slice(1)}
                </span>
              )
            )}

            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              Shelter
            </span>
          </div>

          {incidentError && (
            <p className="px-2 pt-2 text-xs text-red-600">
              Incident map unavailable: {incidentError}
            </p>
          )}

          {shelterError && (
            <p className="px-2 pt-2 text-xs text-red-600">
              Shelter markers unavailable: {shelterError}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-slate-800">
              Latest reports
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Most recently reported emergencies
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading reports...
            </p>
          ) : incidentError ? (
            <p className="py-8 text-center text-sm text-red-600">
              {incidentError}
            </p>
          ) : recentIncidents.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No incident reports available.
            </p>
          ) : (
            <div className="space-y-4">
              {recentIncidents.map((incident) => {
                const priority = String(
                  incident.priority || "low"
                ).toLowerCase();

                const color =
                  priorityColors[priority] || "#64748b";

                return (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() =>
                      navigate(`/incidents/${incident.id}`)
                    }
                    className="w-full rounded-lg p-2 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {priority.toUpperCase()}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {incident.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {incident.place || "Location unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatTime(incident.reportedAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/incidents")}
            className="mt-4 w-full border-t border-slate-100 pt-3 text-center text-xs font-semibold text-[#293d64] hover:underline"
          >
            View all incidents
          </button>
        </section>
      </div>
    </div>
  );
}
