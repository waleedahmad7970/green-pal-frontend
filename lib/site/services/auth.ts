import { normalize } from "@/lib/admin/services/utils";
import apiClient from "@/lib/apiClient";

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user?: any }> {
  const response = await apiClient.post("/users/login", { email, password });
  return normalize<{ token: string; user?: any }>(response as any);
}

// Parameter order fixed to (name, email, password) — this matches how
// RegisterPage.tsx actually calls it: register(values.name, values.email,
// values.password). It previously expected (email, name, password), so
// the two fields were being swapped in the request body: the typed name
// was sent as "email" and the typed email was sent as "name", which is why
// the backend's email-format check failed even for genuinely valid emails.
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ token: string; user?: any }> {
  const response = await apiClient.post("/users/register", { name, email, password });
  return normalize<{ token: string; user?: any }>(response as any);
}

export async function getCurrentUser(): Promise<any> {
  const response = await apiClient.get("/auth/me");
  return normalize<any>(response as any);
}