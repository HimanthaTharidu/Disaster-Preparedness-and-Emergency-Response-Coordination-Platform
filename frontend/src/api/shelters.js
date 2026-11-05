import { getAccessToken } from "./auth";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
).replace(/\/+$/, "");

export async function getShelters() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in to view shelters.");
  }

  const response = await fetch(`${API_BASE_URL}/shelters`, {
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
      throw new Error("You do not have permission to view shelters.");
    }

    throw new Error(`Failed to load shelters (${response.status}).`);
  }

  const data = await response.json();

  return Array.isArray(data.shelters) ? data.shelters : [];
}
