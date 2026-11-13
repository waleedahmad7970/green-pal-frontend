import axios from "axios";

// A plain client on purpose: the shared apiClient pops a toast for every request,
// and the booking section shows its own inline messages.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export interface BookingConfig {
  enabled: boolean;
  timeZone: string;
  slotMinutes: number;
  maxDaysAhead: number;
  workdays: number[]; // 0 = Sunday ... 6 = Saturday
  startHour: number;
  endHour: number;
}

export interface BookingSlot {
  start: string; // ISO
  end: string;
  label: string; // e.g. "9:00 AM", already in the business time zone
  endLabel: string;
}

export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  startsAt: string;
  notes?: string;
}

export interface BookingResult {
  startsAt: string;
  endsAt: string;
  when: string;
  meetLink: string;
  emailSent: boolean;
  whatsappSent: boolean;
}

const messageFrom = (error: any, fallback: string): string =>
  error?.response?.data?.message || error?.message || fallback;

// Design preview only: run `NEXT_PUBLIC_BOOKING_PREVIEW=1 npm run dev` to see the calendar
// with made-up times and no backend. Leave it unset everywhere else (never set it in Vercel).
const PREVIEW = process.env.NEXT_PUBLIC_BOOKING_PREVIEW === "1";

const previewConfig: BookingConfig = {
  enabled: true,
  timeZone: "America/Edmonton",
  slotMinutes: 30,
  maxDaysAhead: 30,
  workdays: [1, 2, 3, 4, 5],
  startHour: 9,
  endHour: 18,
};

const previewTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  return `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? "PM" : "AM"}`;
};

function previewSlots(date: string): BookingSlot[] {
  const [y, mo, d] = date.split("-").map(Number);
  const out: BookingSlot[] = [];
  for (let min = 9 * 60; min < 18 * 60; min += 30) {
    if ((min / 30 + d) % 5 === 0) continue; // a few "taken" times so it looks real
    const start = new Date(Date.UTC(y, mo - 1, d, 0, min)).toISOString();
    const end = new Date(Date.UTC(y, mo - 1, d, 0, min + 30)).toISOString();
    out.push({ start, end, label: previewTime(min), endLabel: previewTime(min + 30) });
  }
  return out;
}

export async function fetchBookingConfig(): Promise<BookingConfig | null> {
  if (PREVIEW) return previewConfig;
  try {
    const res = await api.get("/bookings/config");
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchBookingSlots(date: string): Promise<BookingSlot[]> {
  if (PREVIEW) return previewSlots(date);
  try {
    const res = await api.get("/bookings/slots", { params: { date } });
    return res.data?.data?.slots ?? [];
  } catch (error) {
    throw new Error(messageFrom(error, "Could not load available times."));
  }
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  if (PREVIEW) {
    return {
      startsAt: payload.startsAt,
      endsAt: payload.startsAt,
      when: "Preview only, nothing was booked",
      meetLink: "https://meet.google.com/",
      emailSent: true,
      whatsappSent: true,
    };
  }
  try {
    const res = await api.post("/bookings", payload);
    return res.data.data as BookingResult;
  } catch (error) {
    throw new Error(messageFrom(error, "Could not book your call. Please try again."));
  }
}
