"use client";

export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
      <p className="text-sm text-sand/50 font-body mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <span className="font-display text-3xl font-bold text-sand">{value}</span>
        {delta && <span className="text-xs text-signal font-body">{delta}</span>}
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  live: "bg-signal/15 text-signal",
  active: "bg-signal/15 text-signal",
  paid: "bg-signal/15 text-signal",
  received: "bg-signal/15 text-signal",
  pending: "bg-amber-400/15 text-amber-300",
  installing: "bg-amber-400/15 text-amber-300",
  sent: "bg-amber-400/15 text-amber-300",
  draft: "bg-sand/10 text-sand/60",
  returned: "bg-sand/10 text-sand/60",
  offline: "bg-red-400/15 text-red-300",
  cancelled: "bg-red-400/15 text-red-300",
  overdue: "bg-red-400/15 text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body capitalize ${statusStyles[status] || "bg-sand/10 text-sand/60"
        }`}
    >
      {status}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-sand mb-1">{title}</h1>
        {description && <p className="text-sand/50 font-body text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      {...props}
      onClick={onClick}
      className="bg-signal text-ink font-body font-medium text-sm px-5 py-2.5 rounded-lg whitespace-nowrap"
    >
      {children}
    </button>
  );
}

export function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-ink border border-sand/15 rounded-xl w-full max-w-lg p-6 md:p-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-sand">{title}</h2>
          <button onClick={onClose} className="text-sand/50 hover:text-sand text-xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm text-sand/50 mb-1.5 font-body">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full bg-sand/5 border border-sand/15 focus:border-signal outline-none rounded-lg px-3.5 py-2.5 font-body text-sand text-sm transition-colors duration-300";
