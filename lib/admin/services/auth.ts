import apiClient from "@/lib/apiClient";
import { normalize } from "./utils";

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user?: any }> {
  const response = await apiClient.post("/users/login", { email, password });
  return normalize<{ token: string; user?: any }>(response as any);
}

export async function register(
  email: string,
  password: string,
): Promise<{ token: string; user?: any }> {
  const response = await apiClient.post("/auth/register", { email, password });
  return normalize<{ token: string; user?: any }>(response as any);
}

export async function getCurrentUser(): Promise<any> {
  const response = await apiClient.get("/auth/me");
  return normalize<any>(response as any);
}
