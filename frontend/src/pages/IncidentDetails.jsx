import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  FileText,
  RefreshCw,
  Navigation,
} from "lucide-react";

import { getIncident } from "../api/incidents.js";

const priorityStyles = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-green-100 text-green-700",
};

const statusStyles = {
  new: "bg-slate-100 text-slate-700",
  reported: "bg-slate-100 text-slate-700",
  verified: "bg-blue-100 text-blue-700",
  assigned: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
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

function formatDate(date) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "—";

  return value.toLocaleString("en-LK", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {Icon && <Icon size={15} />}
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function IncidentDetails() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadIncident() {
    try {
      setLoading(true);
      setError("");

      const data = await getIncident(id);

      setIncident(data);
    } catch (err) {
      setError(err.message || "Unable to load incident details.");
      setIncident(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncident();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={25}
            className="mx-auto mb-3 animate-spin text-[#293d64]"
          />
          <p className="text-sm text-slate-500">
            Loading incident details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertTriangle
          size={28}
          className="mx-auto mb-3 text-red-500"
        />

        <h2 className="font-semibold text-slate-800">
          Unable to load incident
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || "Incident not found."}
        </p>

        <button
          type="button"
          onClick={loadIncident}
          className="mt-5 rounded-lg bg-[#293d64] px-4 py-2 text-sm font-medium text-white hover:bg-[#203252]"
        >
          Try again
        </button>

        <div>
          <Link
            to="/incidents"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#293d64] hover:underline"
          >
            <ArrowLeft size={15} />
            Back to incidents
          </Link>
        </div>
      </div>
    );
  }

  const latitude = Number(incident.lat);
  const longitude = Number(incident.lng);

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  return (
    <div className="space-y-5">
      <Link
        to="/incidents"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#293d64] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to incidents
      </Link>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-medium text-slate-400">
              INCIDENT DETAILS
            </p>

            <h1 className="mt-2 text-xl font-bold text-slate-800">
              {incident.title || "Untitled incident"}
            </h1>

            <p className="mt-2 text-xs text-slate-500">
              Incident ID: {incident.id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                priorityStyles[incident.priority?.toLowerCase()] ||
                "bg-slate-100 text-slate-600"
              }`}
            >
              {incident.priority || "Priority unavailable"}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                statusStyles[incident.status?.toLowerCase()] ||
                "bg-slate-100 text-slate-600"
              }`}
            >
              {displayStatus(incident.status)}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
          <FileText size={18} className="text-[#293d64]" />
          Incident information
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <DetailItem
            label="Hazard type"
            value={incident.hazard}
            icon={AlertTriangle}
          />

          <DetailItem
            label="Location"
            value={incident.place}
            icon={MapPin}
          />

          <DetailItem
            label="People at risk"
            value={incident.peopleAtRisk}
            icon={Users}
          />

          <DetailItem
            label="Reported date and time"
            value={formatDate(incident.reportedAt)}
            icon={Calendar}
          />

          <DetailItem
            label="Latitude"
            value={incident.lat}
            icon={Navigation}
          />

          <DetailItem
            label="Longitude"
            value={incident.lng}
            icon={Navigation}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-800">
          Incident description
        </h2>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {incident.description || "No description available."}
        </p>
      </section>

      {hasCoordinates && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">
            Incident location
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {incident.place || "Reported location"}
          </p>

          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#293d64] px-4 py-2 text-sm font-medium text-white hover:bg-[#203252]"
          >
            <MapPin size={16} />
            View on OpenStreetMap
          </a>
        </section>
      )}
    </div>
  );
}
