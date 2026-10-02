"use client";

import { useEffect, useState } from "react";
import { useAdminInquiryStore } from "@/lib/admin/slices/useAdminInquiryStore";
import {
  PageHeader,
  StatusBadge,
  AdminModal,
  FormField,
  PrimaryButton,
  inputClass,
} from "@/components/admin/ui";

const statusOptions = ["pending", "meeting_scheduled", "cancelled"];

export default function AdminInquiriesPage() {
  const { inquiries, isLoading, fetchInquiries, updateStatus, generateLink } =
    useAdminInquiryStore();

  const [linkModal, setLinkModal] = useState<string | null>(null); // inquiryId
  const [priceInput, setPriceInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchInquiries(filterStatus || undefined);
  }, [fetchInquiries, filterStatus]);

  const handleGenerateLink = async () => {
    if (!linkModal) return;
    const cents = Math.round(parseFloat(priceInput) * 100);
    if (!cents || cents <= 0) return;
    setGenerating(true);
    try {
      await generateLink(linkModal, cents);
      setLinkModal(null);
      setPriceInput("");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Inquiries"
        description="Product inquiries from customers. Review, schedule meetings, and generate payment links."
        action={
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm font-body border border-sand/15 rounded-lg px-3 py-2 outline-none cursor-pointer text-sand"
          >
            <option value="" className="bg-ink">All statuses</option>
            <option value="pending" className="bg-ink">Pending</option>
            <option value="meeting_scheduled" className="bg-ink">Meeting Scheduled</option>
            <option value="link_sent" className="bg-ink">Link Sent</option>
            <option value="completed" className="bg-ink">Completed</option>
            <option value="cancelled" className="bg-ink">Cancelled</option>
          </select>
        }
      />

      {isLoading && inquiries.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">Loading inquiries…</p>
      ) : inquiries.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">No inquiries found.</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">ID</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Product</th>
                <th className="p-4 font-normal">Message</th>
                <th className="p-4 font-normal">Price</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => {
                const id = inq._id;
                const userName =
                  typeof inq.user === "object" ? inq.user?.name : "—";
                const userEmail =
                  typeof inq.user === "object" ? inq.user?.email : "";
                const productName =
                  typeof inq.product === "object"
                    ? inq.product?.productName || inq.product?.name
                    : inq.productName;

                return (
                  <tr key={id} className="border-b border-sand/5 last:border-0">
                    <td className="p-4 text-sand/70 font-mono text-xs">
                      {id.slice(-6)}
                    </td>
                    <td className="p-4 text-sand">
                      {userName}
                      {userEmail && (
                        <div className="text-sand/40 text-xs">{userEmail}</div>
                      )}
                    </td>
                    <td className="p-4 text-sand/70">{productName || "—"}</td>
                    <td className="p-4 text-sand/50 max-w-[200px] truncate">
                      {inq.message}
                    </td>
                    <td className="p-4 text-sand/70">
                      {inq.customPrice
                        ? `$${(inq.customPrice / 100).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="p-4 text-sand/50 text-xs">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {["completed", "cancelled", "link_sent"].includes(inq.status) ? (
                        <StatusBadge status={inq.status.replace("_", " ")} />
                      ) : (
                        <select
                          value={inq.status}
                          onChange={(e) => updateStatus(id, e.target.value)}
                          className="bg-transparent text-xs font-body border border-sand/15 rounded-full px-2.5 py-1 outline-none cursor-pointer text-sand"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s} className="bg-ink">
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-4">
                      {!["completed", "cancelled"].includes(inq.status) && (
                        <PrimaryButton
                          onClick={() => {
                            setLinkModal(id);
                            setPriceInput(
                              inq.customPrice
                                ? (inq.customPrice / 100).toFixed(2)
                                : ""
                            );
                          }}
                        >
                          {inq.status === "link_sent"
                            ? "Resend Link"
                            : "Generate Link"}
                        </PrimaryButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate checkout link modal */}
      <AdminModal
        open={!!linkModal}
        onClose={() => setLinkModal(null)}
        title="Generate Payment Link"
      >
        <FormField label="Custom Price (USD)">
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g. 500.00"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className={inputClass}
          />
        </FormField>
        <p className="text-sand/40 text-xs font-body mb-6">
          This will create a Stripe Checkout link and send it to the customer.
          The link expires in 24 hours.
        </p>
        <PrimaryButton
          onClick={handleGenerateLink}
          disabled={generating || !priceInput || parseFloat(priceInput) <= 0}
        >
          {generating ? "Generating…" : "Generate & Send"}
        </PrimaryButton>
      </AdminModal>
    </div>
  );
}
