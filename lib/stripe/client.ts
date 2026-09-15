"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

// Lazily loads Stripe.js once, caching the promise. Call this from any
// client component that needs to mount Stripe Elements or redirect to
// Checkout, once you have a backend endpoint to create the
// PaymentIntent/Checkout Session first.
export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn(
        "[stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Add it to .env.local."
      );
    }
    stripePromise = loadStripe(key || "");
  }
  return stripePromise;
}
