import apiClient from "@/lib/apiClient";

const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
}

export async function fetchUsers(): Promise<AdminUser[]> {
    const v = unwrap(await apiClient.get("/users"));
    return Array.isArray(v) ? v : [];
}

export async function createAdmin(body: { name: string; email: string; password: string }) {
    return unwrap(await apiClient.post("/users/admin", body));
}