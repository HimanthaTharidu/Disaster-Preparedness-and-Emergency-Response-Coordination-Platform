import { getAccessToken } from "./auth.js";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
).replace(/\/+$/, "");

async function request(path) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in to view incidents.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session is invalid or expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to view incidents.");
    }

    if (response.status === 404) {
      throw new Error("Incident not found.");
    }

    throw new Error(`Request failed (${response.status}).`);
  }

  return response.json();
}

export async function getIncidents(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.priority) {
    params.set("priority", filters.priority);
  }

  const query = params.toString();
  const data = await request(`/incidents${query ? `?${query}` : ""}`);

  return Array.isArray(data.incidents) ? data.incidents : [];
}

export async function getIncident(id) {
  if (!id) {
    throw new Error("Incident ID is required.");
  }

  const data = await request(`/incidents/${encodeURIComponent(id)}`);

  if (!data.incident) {
    throw new Error("Incident details could not be found.");
  }

  return data.incident;
}