"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GPMark from "@/components/GPMark";
import { useAdminAuth } from "@/lib/admin/auth";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Locations", href: "/admin/locations" },
  { label: "Purchases", href: "/admin/purchases" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen flex bg-ink text-sand">
      <aside className="w-64 shrink-0 border-r border-sand/10 flex flex-col bg-ink">
        <div className="h-20 flex items-center gap-2.5 px-6 border-b border-sand/10">
          <GPMark className="w-7 h-5 text-signal" />
          <span className="font-display font-extrabold text-base tracking-tight">GREENPAL</span>
          <span className="ml-auto text-[10px] font-body text-sand/40 border border-sand/20 rounded px-1.5 py-0.5">
            admin
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-body text-sm px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  active ? "bg-signal text-ink font-medium" : "text-sand/70 hover:bg-sand/10 hover:text-sand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sand/10">
          <Link
            href="/"
            className="block font-body text-sm text-sand/50 hover:text-sand px-3 py-2 transition-colors"
          >
            ← Back to site
          </Link>
          <button
            onClick={logout}
            className="w-full text-left font-body text-sm text-sand/50 hover:text-sand px-3 py-2 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 bg-[#08150F]">
        <main className="p-6 md:p-10 max-w-[1400px]">{children}</main>
      </div>
    </div>
  );
}
