"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader, StatCard, StatusBadge, AdminModal } from "@/components/admin/ui";
import {
  fetchContacts,
  updateContactStatus,
  CONTACT_STATUSES,
  type ContactMessage,
  type ContactStatus,
} from "@/lib/admin/services/contactAdminService";
import { downloadContactPdf } from "@/lib/admin/utils/contactPdf";

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </svg>
);

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setContacts(await fetchContacts(filterStatus || undefined));
    } catch {
      toast.error("Failed to fetch contact messages");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    try {
      await updateContactStatus(id, status);
      toast.success("Status updated");
      setSelected((s) => (s && s._id === id ? { ...s, status } : s));
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  // Opening a message marks it as read, so the unread count stays honest
  const openMessage = (c: ContactMessage) => {
    setSelected(c);
    if (c.status === "unread") handleStatusChange(c._id, "read");
  };

  const unread = contacts.filter((c) => c.status === "unread").length;
  const replied = contacts.filter((c) => c.status === "replied").length;

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        description="Messages sent from the Contact Us page, with the customer's phone and preferred availability."
        action={
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm font-body border border-sand/15 rounded-lg px-3 py-2 outline-none cursor-pointer text-sand"
          >
            <option value="" className="bg-ink">All statuses</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-ink">
                {s}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Messages" value={String(contacts.length)} />
        <StatCard
          label="Unread"
          value={String(unread)}
          delta={unread ? "needs a reply" : undefined}
        />
        <StatCard label="Replied" value={String(replied)} />
      </div>

      {loading && contacts.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">Loading messages…</p>
      ) : contacts.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">No messages found.</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Phone</th>
                <th className="p-4 font-normal">Availability</th>
                <th className="p-4 font-normal">Message</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal"></th>
                <th className="p-4 font-normal">PDF</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c._id}
                  className={`border-b border-sand/5 last:border-0 ${
                    c.status === "unread" ? "bg-signal/[0.04]" : ""
                  }`}
                >
                  <td className="p-4 text-sand/50 text-xs whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-sand">
                    {c.name}
                    <div className="text-sand/40 text-xs">
                      <a href={`mailto:${c.email}`} className="hover:text-signal">
                        {c.email}
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-sand/70 whitespace-nowrap">
                    {c.phone ? (
                      <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="hover:text-signal">
                        {c.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4 text-sand/70">{c.availability || "—"}</td>
                  <td className="p-4 text-sand/50 max-w-[260px] truncate">{c.message}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                      <StatusBadge status={c.status} />
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value as ContactStatus)}
                        className="bg-transparent text-xs font-body border border-sand/15 rounded-full px-2.5 py-1 outline-none cursor-pointer text-sand"
                      >
                        {CONTACT_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-ink">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => openMessage(c)}
                      className="text-signal text-xs hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => downloadContactPdf(c)}
                      title="Download message as PDF"
                      aria-label="Download message as PDF"
                      className="w-9 h-9 rounded-lg border border-sand/15 text-sand/70 hover:text-signal hover:border-signal transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <DownloadIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Contact message">
        {selected && (
          <div className="space-y-4 font-body text-sm">
            <div>
              <p className="text-sand/40 text-xs mb-1">From</p>
              <p className="text-sand">{selected.name}</p>
              <p className="text-sand/60">{selected.email}</p>
              {selected.phone && <p className="text-sand/60">{selected.phone}</p>}
            </div>
            {selected.availability && (
              <div>
                <p className="text-sand/40 text-xs mb-1">Preferred availability</p>
                <p className="text-sand">{selected.availability}</p>
              </div>
            )}
            <div>
              <p className="text-sand/40 text-xs mb-1">Subject</p>
              <p className="text-sand">{selected.subject}</p>
            </div>
            <div>
              <p className="text-sand/40 text-xs mb-1">Message</p>
              <p className="text-sand/80 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
            <button
              type="button"
              onClick={() => downloadContactPdf(selected)}
              className="inline-flex items-center gap-2 text-xs font-body border border-sand/15 rounded-lg px-3 py-2 text-sand/80 hover:text-signal hover:border-signal transition-colors cursor-pointer"
            >
              <DownloadIcon />
              Download PDF
            </button>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sand/40 text-xs">Status</span>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected._id, e.target.value as ContactStatus)}
                className="bg-transparent text-xs border border-sand/15 rounded-full px-2.5 py-1 outline-none cursor-pointer text-sand"
              >
                {CONTACT_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-ink">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
