"use client";

import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";
import AdminLogin from "./(auth)/login/page";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthed } = useAdminAuth();

  // Allow register (and login) pages to render freely without being blocked by the layout gate
  const isAuthPage =
    pathname?.includes("/admin/register") || pathname?.includes("/admin/login");

  if (!isAuthed && !isAuthPage) {
    return <AdminLogin />;
  }

  // If it's an auth page, skip the shell and just render the page component directly
  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
