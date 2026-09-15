import Stripe from "stripe";

// Server-only. Never import this file from a "use client" component —
// STRIPE_SECRET_KEY must never reach the browser bundle.
//
// Nothing in the app calls this yet; it's here so that when you add real
// API routes (e.g. app/api/checkout/route.ts) for creating payment intents,
// subscriptions, or charges, the Stripe client is already configured
// correctly with the right API version and error handling.
if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== "production") {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY is not set. Add it to .env.local before using any Stripe API route."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
  typescript: true,
});
