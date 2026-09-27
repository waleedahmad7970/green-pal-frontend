// services/locationService.ts
import apiClient from "@/lib/apiClient";

export interface LocationItem {
  _id?: string;
  id?: string;
  name: string;
  venue: string;
  image: string;
  city: string;
  address: string;
  bays: number;
  status: "live" | "installing" | "offline";
  installedAt: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export async function fetchLocations() {
  const response = await apiClient.get("/locations");
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function createLocation(data: LocationItem) {
  const response = await apiClient.post("/locations", data);
  const body = response?.data || response;
  return body?.data || body;
}

export async function updateLocation(id: string, data: Partial<LocationItem>) {
  const response = await apiClient.put(`/locations/${id}`, data);
  const body = response?.data || response;
  return body?.data || body;
}

export async function deleteLocation(id: string) {
  const response = await apiClient.delete(`/locations/${id}`);
  return response?.data || response;
}