import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MapPin,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

import { getShelters } from "../api/shelters";
import ShelterMap from "../components/ShelterMap";

function getStatus(shelter) {
  return String(shelter.status || "").toLowerCase();
}

function getPercentage(shelter) {
  const capacity = Number(shelter.capacity) || 0;
  const occupancy = Number(shelter.occupancy) || 0;

  if (capacity <= 0) return 0;

  return Math.min(100, Math.max(0, (occupancy / capacity) * 100));
}

function getProgressColor(percentage) {
  if (percentage >= 90) return "bg-red-600";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-green-600";
}

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <Icon size={19} className="text-slate-400" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function ShelterCard({ shelter, selected, onClick }) {
  const percentage = getPercentage(shelter);
  const occupancy = Number(shelter.occupancy) || 0;
  const capacity = Number(shelter.capacity) || 0;
  const available = Math.max(0, capacity - occupancy);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg p-3 text-left transition ${
        selected
          ? "border border-[#293d64] bg-blue-50"
          : "border border-transparent hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-slate-800">
          {shelter.name}
        </h3>

        <span className="shrink-0 text-xs text-slate-500">
          {occupancy} / {capacity}
        </span>
      </div>

      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
        <MapPin size={12} />
        {shelter.place || "Location unavailable"}
      </p>

      <div className="mt-3 h-[6px] w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{Math.round(percentage)}% occupied</span>
        <span>{available} spaces available</span>
      </div>
    </button>
  );
}

function AddShelterModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    capacity: "",
    occupancy: "",
    lat: "",
    lng: "",
    status: "open",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Add New Shelter
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 text-sm text-slate-500">
          Enter the shelter location and capacity details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Shelter Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter shelter name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
              required
              disabled
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              name="place"
              value={formData.place}
              onChange={handleChange}
              placeholder="Enter shelter location"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
              required
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Maximum"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
                required
                disabled
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Occupancy
              </label>
              <input
                name="occupancy"
                type="number"
                min="0"
                value={formData.occupancy}
                onChange={handleChange}
                placeholder="Current"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
                required
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Latitude
              </label>
              <input
                name="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
                required
                disabled
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Longitude
              </label>
              <input
                name="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
                required
                disabled
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#293d64]"
              disabled
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Shelter creation is not available through the current backend.
            A POST /shelters endpoint is required to save new shelters.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled
              className="rounded-lg bg-[#293d64] px-5 py-2.5 text-sm font-medium text-white opacity-50"
            >
              Save Shelter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showAddShelter, setShowAddShelter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadShelters() {
    try {
      setLoading(true);
      setError("");

      const data = await getShelters();
      setShelters(data);

      setSelectedShelter((current) =>
        current
          ? data.find((item) => item.id === current.id) || null
          : null
      );
    } catch (err) {
      setError(err.message || "Unable to load shelters.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShelters();
  }, []);

  const locations = useMemo(() => {
    return [
      ...new Set(
        shelters.map((shelter) => shelter.place).filter(Boolean)
      ),
    ].sort();
  }, [shelters]);

  const filteredShelters = useMemo(() => {
    return shelters.filter((shelter) => {
      const matchesSearch =
        `${shelter.name || ""} ${shelter.place || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesLocation =
        locationFilter === "all" ||
        shelter.place === locationFilter;

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(shelter) === statusFilter;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [shelters, search, locationFilter, statusFilter]);

  const openCount = shelters.filter(
    (shelter) => getStatus(shelter) === "open"
  ).length;

  const closedCount = shelters.filter(
    (shelter) => getStatus(shelter) === "closed"
  ).length;

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + (Number(shelter.capacity) || 0),
    0
  );

  const totalOccupancy = shelters.reduce(
    (sum, shelter) => sum + (Number(shelter.occupancy) || 0),
    0
  );

  const availableSpaces = Math.max(
    0,
    totalCapacity - totalOccupancy
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Shelters
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage shelter locations and capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddShelter(true)}
          className="flex items-center gap-2 rounded-lg bg-[#293d64] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#203252]"
        >
          <Plus size={17} />
          Add shelter
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          title="Total shelters"
          value={shelters.length}
          icon={Building2}
        />

        <SummaryCard
          title="Open shelters"
          value={openCount}
          icon={CheckCircle}
        />

        <SummaryCard
          title="Closed shelters"
          value={closedCount}
          icon={XCircle}
        />

        <SummaryCard
          title="Available spaces"
          value={availableSpaces}
          icon={Users}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Search
          </label>

          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={16} className="text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shelter or location"
              className="w-full text-sm outline-none"
            />
          </div>
        </div>

        <div className="w-full md:w-44">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            District / Location
          </label>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All locations</option>

            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-40">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={loadShelters}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Loading shelters...
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">
          <section className="min-h-[470px] rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-800">
                {statusFilter === "open"
                  ? "Open shelters"
                  : "Shelters"}
              </h2>

              <span className="text-xs text-slate-500">
                {filteredShelters.length} shelters
              </span>
            </div>

            {filteredShelters.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                No shelters found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredShelters.map((shelter) => (
                  <ShelterCard
                    key={shelter.id}
                    shelter={shelter}
                    selected={selectedShelter?.id === shelter.id}
                    onClick={() => setSelectedShelter(shelter)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="min-h-[470px] rounded-xl border border-slate-200 bg-white p-2">
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <h2 className="text-sm font-semibold text-slate-800">
                Map of shelters
              </h2>

              <span className="text-xs text-slate-500">
                {filteredShelters.length} shelters
              </span>
            </div>

            <div className="h-[420px] overflow-hidden rounded-lg">
              <ShelterMap
                shelters={filteredShelters}
                selectedShelter={selectedShelter}
                onSelectShelter={setSelectedShelter}
              />
            </div>
          </section>
        </div>
      ) : null}

      {!loading && !error && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Total occupancy:{" "}
              <strong className="text-slate-800">
                {totalOccupancy}
              </strong>{" "}
              / {totalCapacity} spaces
            </span>

            <span>
              Overall occupancy:{" "}
              <strong className="text-slate-800">
                {totalCapacity > 0
                  ? Math.round(
                      (totalOccupancy / totalCapacity) * 100
                    )
                  : 0}
                %
              </strong>
            </span>
          </div>
        </div>
      )}

      {showAddShelter && (
        <AddShelterModal
          onClose={() => setShowAddShelter(false)}
        />
      )}
    </div>
  );
}
