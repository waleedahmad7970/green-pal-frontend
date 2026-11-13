"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  fetchBookingConfig,
  fetchBookingSlots,
  createBooking,
  type BookingConfig,
  type BookingResult,
  type BookingSlot,
} from "@/lib/site/services/bookings";
import { formatCanadianPhone, isValidCanadianPhone } from "@/lib/helpers/canadianPhone";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const EASE = [0.16, 1, 0.3, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const toDateString = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`; // m is 0-based

// "Today" as a calendar date in the business time zone, so the calendar agrees with the server
const todayInZone = (tz: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = parts.split("-").map(Number);
  return { y, m: m - 1, d };
};

const dayNumber = (y: number, m: number, d: number) => Math.round(Date.UTC(y, m, d) / 86400000);

const formatLongDate = (y: number, m: number, d: number) => {
  const weekday = WEEKDAY_NAMES[new Date(Date.UTC(y, m, d)).getUTCDay()];
  return `${weekday}, ${MONTHS[m]} ${d}`;
};

export default function BookCall() {
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slot, setSlot] = useState<BookingSlot | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  // Show the section only when the backend says booking is switched on
  useEffect(() => {
    let alive = true;
    fetchBookingConfig().then((c) => {
      if (!alive || !c?.enabled) return;
      setConfig(c);
      const t = todayInZone(c.timeZone);
      setCursor({ y: t.y, m: t.m });
    });
    return () => {
      alive = false;
    };
  }, []);

  const today = useMemo(() => (config ? todayInZone(config.timeZone) : null), [config]);

  const loadSlots = async (d: { y: number; m: number; d: number }) => {
    setLoadingSlots(true);
    setSlotsError(null);
    setSlots([]);
    try {
      setSlots(await fetchBookingSlots(toDateString(d.y, d.m, d.d)));
    } catch (e: any) {
      setSlotsError(e.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const pickDay = (d: { y: number; m: number; d: number }) => {
    setSelected(d);
    setSlot(null);
    setFormError(null);
    loadSlots(d);
  };

  if (!config || !cursor || !today) return null;

  const todayNum = dayNumber(today.y, today.m, today.d);
  const lastNum = todayNum + config.maxDaysAhead;

  const firstWeekday = new Date(Date.UTC(cursor.y, cursor.m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const canGoPrev = cursor.y > today.y || cursor.m > today.m;
  const nextMonthStart = dayNumber(cursor.m === 11 ? cursor.y + 1 : cursor.y, (cursor.m + 1) % 12, 1);
  const canGoNext = nextMonthStart <= lastNum;

  const goMonth = (delta: number) => {
    const m = cursor.m + delta;
    setCursor({ y: cursor.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 });
  };

  const isBookable = (d: number) => {
    const n = dayNumber(cursor.y, cursor.m, d);
    if (n < todayNum || n > lastNum) return false;
    return config.workdays.includes((firstWeekday + d - 1) % 7);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot || !selected) return;

    if (!isValidCanadianPhone(phone)) {
      setPhoneError("Enter a valid Canadian phone number, e.g. (780) 555-1234");
      return;
    }
    setPhoneError(null);
    setFormError(null);
    setSubmitting(true);
    try {
      const booked = await createBooking({
        name: name.trim(),
        email: email.trim(),
        phone: `+1 ${phone}`,
        startsAt: slot.start,
      });
      setResult(booked);
    } catch (err: any) {
      setFormError(err.message);
      // The time may have just been taken, so refresh the list
      setSlot(null);
      loadSlots(selected);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSlot(null);
    setSelected(null);
    setSlots([]);
    setName("");
    setEmail("");
    setPhone("");
    setFormError(null);
  };

  const inputClass =
    "w-full bg-transparent border-b-2 border-ink/25 focus:border-[#02d683] outline-none pb-2 font-body text-ink placeholder:text-ink/30 transition-colors duration-300";

  return (
    <section className="relative py-20 md:py-28 bg-white text-ink border-t border-ink/10">
      <div className="container-edit max-w-5xl">
        <div className="max-w-xl mb-12">
          <span className="font-mono text-xs uppercase tracking-wider text-signal-dim font-semibold">
            Book a call
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-3 mb-4">
            Pick a time that suits you
          </h2>
          <p className="font-body text-muted leading-relaxed">
            Choose a day and a time and we will set up a Google Meet call. You get the details by
            email and WhatsApp straight away.
          </p>
        </div>

        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-2xl border border-ink/10 shadow-lg p-8 sm:p-10 max-w-xl"
          >
            <div className="w-12 h-12 rounded-full bg-signal text-ink flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-semibold mb-2">Your call is booked</h3>
            <p className="font-body text-ink/80 mb-1">{result.when}</p>
            <p className="font-body text-sm text-muted mb-8">
              {result.emailSent
                ? "We emailed you the details"
                : "We will email you the details shortly"}
              {result.whatsappSent ? " and sent them to your WhatsApp." : "."}
            </p>
            <div className="flex flex-wrap gap-3">
              {result.meetLink && (
                <a
                  href={result.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#02d683] text-ink font-body font-bold px-7 py-3.5 rounded-full hover:bg-[#02bc73] transition-colors shadow-lg shadow-[#02d683]/20"
                >
                  Join Google Meet
                </a>
              )}
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center border border-ink/20 text-ink font-body font-medium px-7 py-3.5 rounded-full hover:border-[#02d683] hover:text-signal-dim transition-colors cursor-pointer"
              >
                Book another time
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-start">
            {/* ---------- Calendar ---------- */}
            <div className="rounded-2xl border border-ink/10 shadow-lg p-5 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold">
                  {MONTHS[cursor.m]} {cursor.y}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => goMonth(-1)}
                    disabled={!canGoPrev}
                    aria-label="Previous month"
                    className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:border-[#02d683] hover:text-signal-dim transition-colors disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:text-inherit disabled:cursor-not-allowed cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => goMonth(1)}
                    disabled={!canGoNext}
                    aria-label="Next month"
                    className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:border-[#02d683] hover:text-signal-dim transition-colors disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:text-inherit disabled:cursor-not-allowed cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="text-center text-xs font-mono uppercase text-ink/40 py-1">
                    {w}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstWeekday }).map((_, i) => (
                  <span key={`pad-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                  const bookable = isBookable(d);
                  const isSelected =
                    selected?.y === cursor.y && selected?.m === cursor.m && selected?.d === d;
                  const isToday = today.y === cursor.y && today.m === cursor.m && today.d === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={!bookable}
                      aria-pressed={isSelected}
                      aria-label={formatLongDate(cursor.y, cursor.m, d)}
                      onClick={() => pickDay({ y: cursor.y, m: cursor.m, d })}
                      className={`aspect-square rounded-full text-sm font-body transition-colors flex items-center justify-center ${
                        isSelected
                          ? "bg-signal text-ink font-bold shadow-md shadow-signal/30"
                          : bookable
                            ? "text-ink font-medium hover:bg-signal/15 cursor-pointer"
                            : "text-ink/25 cursor-not-allowed"
                      } ${isToday && !isSelected ? "ring-1 ring-signal" : ""}`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <p className="font-body text-xs text-muted mt-5">
                Mon–Fri, {config.startHour > 12 ? config.startHour - 12 : config.startHour}
                {config.startHour >= 12 ? " PM" : " AM"} –{" "}
                {config.endHour > 12 ? config.endHour - 12 : config.endHour}
                {config.endHour >= 12 ? " PM" : " AM"} MT (Edmonton), {config.slotMinutes}-minute calls.
              </p>
            </div>

            {/* ---------- Times and details ---------- */}
            <div className="min-h-[18rem]">
              <AnimatePresence mode="wait">
                {!selected ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-body text-muted pt-2"
                  >
                    Select a day on the calendar to see the available times.
                  </motion.p>
                ) : slot ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    <div>
                      <p className="font-display text-xl font-semibold">
                        {formatLongDate(selected.y, selected.m, selected.d)}
                      </p>
                      <p className="font-body text-sm text-muted mt-1">
                        {slot.label} – {slot.endLabel} MT ·{" "}
                        <button
                          type="button"
                          onClick={() => setSlot(null)}
                          className="text-signal-dim underline underline-offset-2 cursor-pointer"
                        >
                          change time
                        </button>
                      </p>
                    </div>

                    <label className="block">
                      <span className="block text-sm text-ink/70 mb-2 font-body font-medium">Name</span>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        maxLength={100}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm text-ink/70 mb-2 font-body font-medium">Email</span>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm text-ink/70 mb-2 font-body font-medium">
                        WhatsApp / phone (Canada)
                      </span>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(780) 555-1234"
                        value={phone}
                        onChange={(e) => {
                          setPhone(formatCanadianPhone(e.target.value));
                          if (phoneError) setPhoneError(null);
                        }}
                        className={`${inputClass} ${phoneError ? "!border-red-500" : ""}`}
                      />
                      {phoneError && (
                        <span className="block text-xs text-red-500 mt-1.5 font-body">{phoneError}</span>
                      )}
                    </label>

                    {formError && <p className="text-sm text-red-500 font-body">{formError}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#02d683] text-ink font-body font-bold px-8 py-4 rounded-full cursor-pointer hover:bg-[#02bc73] transition-colors shadow-lg shadow-[#02d683]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Booking..." : "Confirm booking"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key={`slots-${selected.y}-${selected.m}-${selected.d}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <p className="font-display text-xl font-semibold mb-1">
                      {formatLongDate(selected.y, selected.m, selected.d)}
                    </p>
                    <p className="font-body text-sm text-muted mb-5">Times shown in Mountain Time (Edmonton).</p>

                    {formError && <p className="text-sm text-red-500 font-body mb-4">{formError}</p>}

                    {loadingSlots ? (
                      <p className="font-body text-muted">Loading times…</p>
                    ) : slotsError ? (
                      <p className="font-body text-sm text-red-500">{slotsError}</p>
                    ) : slots.length === 0 ? (
                      <p className="font-body text-muted">
                        No times left on this day. Please pick another day.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.map((s) => (
                          <button
                            key={s.start}
                            type="button"
                            onClick={() => {
                              setSlot(s);
                              setFormError(null);
                            }}
                            className="py-3 rounded-full border border-ink/15 font-body text-sm font-medium text-ink hover:border-[#02d683] hover:bg-signal/10 transition-colors cursor-pointer"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
