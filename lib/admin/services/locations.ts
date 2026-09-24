import type { Location } from "../types";
import apiClient from "../../apiClient";
import { normalize, normalizeList } from "./utils";

export async function listLocations(): Promise<Location[]> {
  const response: any = await apiClient.get("/locations");

  // Safely extract the array whether apiClient returns the Axios response or just the JSON
  const responseData = response.data?.data || response.data || response;
  const itemsArray = Array.isArray(responseData) ? responseData : [];

  return normalizeList<Location>(itemsArray);
}

export async function createLocation(
  input: Omit<Location, "id">
): Promise<Location> {
  const response: any = await apiClient.post("/locations", input);

  // Extract the single object safely
  const item = response.data?.data || response.data || response;
  return normalize<Location>(item);
}

export async function updateLocation(
  locationId: string,
  patch: Partial<Location>
): Promise<void> {
  await apiClient.put(`/locations/${locationId}`, patch);
}

export async function deleteLocation(locationId: string): Promise<void> {
  await apiClient.delete(`/locations/${locationId}`);
}