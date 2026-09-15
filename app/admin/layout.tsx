"use client";

import { useAdminAuth } from "@/lib/admin/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAdminAuth();

  if (!isAuthed) return <AdminLogin />;

  return <AdminShell>{children}</AdminShell>;
}
