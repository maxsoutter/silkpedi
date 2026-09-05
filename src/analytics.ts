/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Meta (Facebook) pixel.
 *
 * Everything here is a no-op until PIXEL_ID is filled in, so the site behaves
 * exactly as it does today until the ID exists. Put the 15-16 digit ID from
 * Events Manager here and nothing else needs to change.
 */
export const PIXEL_ID = "";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Injects the pixel and fires PageView. Safe to call on every page load. */
export function initPixel() {
  if (!PIXEL_ID || typeof window === "undefined" || window.fbq) return;

  /* Standard Meta base snippet, written out rather than pasted as a blob so
     it's readable and type-checked. */
  const fbq: Fbq = function (...args: unknown[]) {
    (fbq.queue = fbq.queue || []).push(args);
  } as Fbq;
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

/** Fires an event if the pixel is configured; silently does nothing if not. */
export function track(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("track", event, params || {}, { eventID: eventId });
  } else {
    window.fbq("track", event, params || {});
  }
}

/**
 * Fires Purchase at most once per order reference.
 *
 * The thank-you page is a plain URL: a customer can refresh it, bookmark it or
 * come back to it, and every one of those would otherwise report another sale
 * and teach Meta to chase the wrong people. The order ref is the natural
 * idempotency key, and it doubles as the eventID so a future Conversions API
 * call can be deduplicated against this one.
 *
 * Returns true if the event was actually sent.
 */
export function trackPurchaseOnce(
  ref: string | null,
  params: Record<string, unknown>
): boolean {
  if (!PIXEL_ID || typeof window === "undefined") return false;

  // Without a ref there's nothing stable to dedupe on, so fall back to a
  // per-tab guard: a refresh in the same tab won't double count.
  const key = ref ? `sp_purchase_${ref}` : "sp_purchase_session";
  const store = ref ? window.localStorage : window.sessionStorage;

  try {
    if (store.getItem(key)) return false;
    store.setItem(key, String(Date.now()));
  } catch {
    // Private mode can throw on storage. Better to risk a duplicate than to
    // lose the conversion entirely, so carry on and fire.
  }

  track("Purchase", params, ref || undefined);
  return true;
}
