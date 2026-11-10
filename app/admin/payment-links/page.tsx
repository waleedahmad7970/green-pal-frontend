"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { FormField, PageHeader, PrimaryButton, inputClass } from "@/components/admin/ui";
import {
  cancelPaymentLink,
  createPaymentLink,
  fetchPaymentLinks,
  type CustomPaymentLink,
} from "@/lib/admin/services/paymentLinkAdminService";

const money = (l: CustomPaymentLink) => `$${l.amount.toFixed(2)} ${l.currency.toUpperCase()}`;

const STATUS_STYLE: Record<CustomPaymentLink["status"], string> = {
  active: "bg-emerald-400/15 text-emerald-300",
  paid: "bg-sky-400/15 text-sky-300",
  cancelled: "bg-sand/10 text-sand/50",
};

const emptyForm = {
  title: "",
  amount: "",
  currency: "cad" as "cad" | "usd",
  description: "",
  note: "",
  customerName: "",
  customerEmail: "",
  reusable: false,
};

async function copyText(text: string, okMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(okMessage);
  } catch {
    toast.error("Could not copy. Select the link and copy it manually.");
  }
}

function QrBlock({ link }: { link: CustomPaymentLink }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(link.url, { width: 600, margin: 2, errorCorrectionLevel: "M" })
      .then((u) => !cancelled && setDataUrl(u))
      .catch(() => !cancelled && setDataUrl(""));
    return () => {
      cancelled = true;
    };
  }, [link.url]);

  if (!dataUrl) return <p className="text-sand/40 text-xs">Preparing QR…</p>;

  const fileName = `greenpal-payment-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* White background so the code scans in dark mode too */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="Payment QR code" className="w-44 h-44 rounded-lg bg-white p-1" />
      <a
        href={dataUrl}
        download={fileName}
        className="text-signal text-xs font-body hover:underline"
      >
        Download QR (PNG)
      </a>
    </div>
  );
}

export default function AdminPaymentLinksPage() {
  const [links, setLinks] = useState<CustomPaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<CustomPaymentLink | null>(null);
  const [openQrId, setOpenQrId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLinks(await fetchPaymentLinks());
    } catch {
      toast.error("Failed to fetch payment links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key: keyof typeof emptyForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount < 1) {
      toast.error("Enter an amount of at least 1");
      return;
    }
    try {
      setSaving(true);
      const link = await createPaymentLink({
        title: form.title.trim(),
        amount,
        currency: form.currency,
        description: form.description.trim(),
        note: form.note.trim(),
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        reusable: form.reusable,
      });
      setCreated(link);
      setForm(emptyForm);
      toast.success("Payment link created");
      load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || (typeof error === "string" ? error : "Failed to create link"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (link: CustomPaymentLink) => {
    if (!window.confirm(`Stop this link from working?\n${link.title} — ${money(link)}`)) return;
    try {
      await cancelPaymentLink(link._id);
      toast.success("Link cancelled");
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel link");
    }
  };

  return (
    <div>
      <PageHeader
        title="Payment Links"
        description="Create a custom-amount payment link, then share the link or the QR code. Payments appear in Deposits as “Custom”."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        <form
          onSubmit={handleCreate}
          className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6"
        >
          <h2 className="font-display text-lg font-bold text-sand mb-4">New payment link</h2>

          <FormField label="Title (shown to the customer)">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Installation payment"
              maxLength={100}
              required
            />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <FormField label="Amount">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  placeholder="1500.00"
                  required
                />
              </FormField>
            </div>
            <FormField label="Currency">
              <select
                className={inputClass}
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                <option value="cad" className="bg-ink">CAD</option>
                <option value="usd" className="bg-ink">USD</option>
              </select>
            </FormField>
          </div>

          <FormField label="Description (shown to the customer, optional)">
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={500}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Customer name (optional)">
              <input
                className={inputClass}
                value={form.customerName}
                onChange={(e) => set("customerName", e.target.value)}
              />
            </FormField>
            <FormField label="Customer email (optional, pre-fills checkout)">
              <input
                className={inputClass}
                type="email"
                value={form.customerEmail}
                onChange={(e) => set("customerEmail", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Internal note / reference (optional, saved on the deposit)">
            <input
              className={inputClass}
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              maxLength={200}
            />
          </FormField>

          <label className="flex items-start gap-2 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.reusable}
              onChange={(e) => set("reusable", e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-sand/60 font-body">
              Reusable link. Leave unticked for a one-time link that stops working after the first
              payment.
            </span>
          </label>

          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create payment link"}
          </PrimaryButton>
        </form>

        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-sand mb-4">Share</h2>
          {created ? (
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <QrBlock link={created} />
              <div className="min-w-0 flex-1">
                <div className="text-sand font-body font-semibold">{created.title}</div>
                <div className="text-signal font-body text-xl mb-3">{money(created)}</div>
                <input
                  readOnly
                  value={created.url}
                  onFocus={(e) => e.currentTarget.select()}
                  className={`${inputClass} mb-3 text-xs`}
                />
                <button
                  type="button"
                  onClick={() => copyText(created.url, "Link copied")}
                  className="bg-sand/10 text-sand font-body text-sm px-4 py-2 rounded-lg hover:bg-sand/15"
                >
                  Copy link
                </button>
                <p className="text-sand/40 text-xs font-body mt-3">
                  {created.reusable ? "Reusable link." : "One-time link: it stops working after the first payment."}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sand/40 font-body text-sm">
              The link and QR code appear here after you create one. You can also find every link
              below.
            </p>
          )}
        </div>
      </div>

      <h2 className="font-display text-lg font-bold text-sand mb-4">Created links</h2>
      {loading ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : links.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">No links created yet.</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Title</th>
                <th className="p-4 font-normal">Amount</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Created</th>
                <th className="p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l._id} className="border-b border-sand/5 last:border-0 align-top">
                  <td className="p-4 text-sand">
                    {l.title}
                    {l.note && <div className="text-sand/40 text-xs">{l.note}</div>}
                  </td>
                  <td className="p-4 text-sand/70 whitespace-nowrap">{money(l)}</td>
                  <td className="p-4 text-sand/70">
                    {l.customerName || l.customerEmail ? (
                      <>
                        {l.customerName}
                        <div className="text-sand/40 text-xs">{l.customerEmail}</div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[l.status]}`}
                    >
                      {l.status}
                    </span>
                    {l.reusable && (
                      <div className="text-sand/40 text-xs mt-1">
                        reusable · {l.paidCount} paid
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sand/50 text-xs whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      <button
                        type="button"
                        onClick={() => copyText(l.url, "Link copied")}
                        className="text-signal text-xs hover:underline"
                      >
                        Copy link
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenQrId(openQrId === l._id ? null : l._id)}
                        className="text-signal text-xs hover:underline"
                      >
                        {openQrId === l._id ? "Hide QR" : "QR"}
                      </button>
                      {l.status === "active" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(l)}
                          className="text-rose-300 text-xs hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    {openQrId === l._id && (
                      <div className="mt-3">
                        <QrBlock link={l} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
