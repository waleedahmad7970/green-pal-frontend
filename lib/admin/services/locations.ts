import type { Location } from "../types";
import apiClient from "../../apiClient";
import { normalize, normalizeList } from "./utils";

export async function listLocations(): Promise<Location[]> {
  const response = await apiClient.get("/locations");
  return normalizeList<Location>(response.data);
}

export async function createLocation(
  input: Omit<Location, "id">
): Promise<Location> {
  const response = await apiClient.post("/locations", input);
  return normalize<Location>(response.data);
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
