/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Post-payment thank-you page. The payment platform redirects here once a
 * payment succeeds, which is what makes a Purchase event possible at all —
 * the rest of the funnel happens on WhatsApp where the pixel can't see it.
 *
 * Accepted query parameters, all optional:
 *   ref     order reference, e.g. SP-PCGC6   (used to deduplicate Purchase)
 *   amount  numeric total, e.g. 45           (alias: value, total)
 *   bundle  1-pack | 2-pack | 3-pack         (used to infer amount if absent)
 *   name    customer first name              (greeting only)
 *
 * Purchase only fires when there is some evidence of a real order (a ref, an
 * amount or a bundle). A bare visit to /thank-you reports nothing, so curious
 * visitors and link scrapers can't pollute the ad data.
 */

import React, { useEffect, useMemo } from "react";
import {
  Check,
  MessageCircle,
  Truck,
  CalendarDays,
  Sparkles,
  Phone,
  Info,
} from "lucide-react";
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";
import { trackPurchaseOnce } from "../analytics";

/** Falls back to bundle pricing when the payment platform can't pass a total. */
const BUNDLE_VALUES: Record<string, number> = {
  "1-pack": 25,
  "2-pack": 45,
  "3-pack": 70,
};

const NEXT_STEPS = [
  {
    icon: "msg",
    title: "We'll message you on WhatsApp",
    body: "Usually within a few hours, to confirm your delivery address and arrange a time that suits you.",
  },
  {
    icon: "truck",
    title: "Your kit goes out by courier",
    body: "Flat $5 within the Harare CBD area. Anywhere else in Zimbabwe, or South Africa, Zambia and beyond, we'll arrange it with you directly.",
  },
  {
    icon: "cal",
    title: "Then pick your week",
    body: "Peeling starts around Day 3 and finishes by Day 7 to 10, so start at least ten days before any event where you want smooth feet.",
  },
];

export default function ThankYou() {
  const order = useMemo(() => {
    if (typeof window === "undefined") return { ref: null, amount: null, name: null };
    const q = new URLSearchParams(window.location.search);

    const ref = q.get("ref");
    const bundle = q.get("bundle");

    const rawAmount = q.get("amount") ?? q.get("value") ?? q.get("total");
    let amount: number | null = null;
    if (rawAmount) {
      const parsed = Number(rawAmount.replace(/[^0-9.]/g, ""));
      // Guard against junk and against a stray huge number skewing ad reporting.
      if (Number.isFinite(parsed) && parsed > 0 && parsed < 10000) amount = parsed;
    }
    if (amount === null && bundle && BUNDLE_VALUES[bundle]) amount = BUNDLE_VALUES[bundle];

    const name = q.get("name");
    return { ref, amount, name: name ? name.trim().slice(0, 40) : null };
  }, []);

  useEffect(() => {
    document.title = "Thank You — Your Silkpedi Order";

    // Only report a sale when the redirect actually looks like one.
    const looksLikeAnOrder = Boolean(order.ref || order.amount);
    if (!looksLikeAnOrder) return;

    trackPurchaseOnce(order.ref, {
      value: order.amount ?? undefined,
      currency: "USD",
      content_type: "product",
    });
  }, [order]);

  const waHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    order.ref
      ? `Hello, I've just paid for my Silkpedi order. My order ref is ${order.ref}.`
      : "Hello, I've just paid for my Silkpedi order."
  )}`;

  const stepIcon = (kind: string) => {
    if (kind === "msg") return <MessageCircle className="w-6 h-6" />;
    if (kind === "truck") return <Truck className="w-6 h-6" />;
    return <CalendarDays className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-brand selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-teal-dark text-white py-5 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-brand to-teal-bright flex items-center justify-center shadow-lg">
            <span className="font-serif font-black text-white text-xl">S</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-2xl tracking-wide font-black bg-gradient-to-r from-purple-light via-white to-purple-brand bg-clip-text text-transparent">
              silkpedi
            </span>
            <span className="text-[9px] font-bold text-purple-brand tracking-widest uppercase">
              At-Home Luxury Pedi
            </span>
          </div>
        </div>
      </header>

      {/* Confirmation */}
      <section className="bg-teal-dark text-white px-4 md:px-8 pb-16 md:pb-20 relative overflow-hidden">
        <div className="absolute -top-10 right-0 bg-purple-brand/15 w-96 h-96 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-xl">
            <Check className="w-9 h-9 text-white" strokeWidth={3} />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            {order.name ? `Thank you, ${order.name}.` : "Thank you — payment received."}
            <br />
            <span className="italic text-purple-brand">Your Silkpedi is on its way.</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            We've got your payment. Here's exactly what happens next, so you're not left
            wondering.
          </p>

          {order.ref && (
            <div className="inline-flex flex-col items-center bg-[#092522] border border-teal-light/40 rounded-2xl px-6 py-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-teal-bright">
                Your order reference
              </span>
              <span className="font-mono text-2xl font-black tracking-widest mt-1">
                {order.ref}
              </span>
              <span className="text-[11px] text-gray-400 mt-1.5">
                Quote this if you message us about your order
              </span>
            </div>
          )}
        </div>
      </section>

      {/* What happens next */}
      <section className="px-4 md:px-8 py-14 md:py-20 bg-white flex-1">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              WHAT HAPPENS NEXT
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold tracking-tight text-teal-dark">
              Three things, in this order
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEXT_STEPS.map((s, i) => (
              <div
                key={s.title}
                className="bg-purple-light/50 border border-purple-brand/15 rounded-[1.75rem] p-7 space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-dark text-white flex items-center justify-center shadow-md shrink-0">
                    {stepIcon(s.icon)}
                  </div>
                  <span className="font-mono text-xs font-black text-purple-brand">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-teal-dark">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Message us — the one action worth taking now */}
          <div className="bg-teal-dark text-white rounded-[2rem] p-8 md:p-10 text-center space-y-5 max-w-3xl mx-auto">
            <Sparkles className="w-7 h-7 text-purple-brand mx-auto" />
            <h3 className="font-serif text-xl md:text-3xl font-semibold leading-snug">
              Save our number while you're here
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              It's the fastest way to reach us about delivery, and it means our message won't
              land as an unknown number you ignore.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message us on WhatsApp</span>
            </a>
            <p className="text-gray-400 text-xs font-mono">{WHATSAPP_DISPLAY}</p>
          </div>

          {/* Prep tips — useful, and reduces "how do I use this" messages later */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="font-serif text-xl font-bold text-teal-dark text-center">
              While you wait
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Plan your week: keep closed shoes and socks handy for the peeling days, roughly Day 3 to Day 6.",
                "Soaking your feet in warm water for 15–20 minutes a day from Day 2 makes the peeling faster and more even.",
                "Don't pull or peel the skin off by hand — let it lift away on its own, or it can feel tender.",
                "Doing a pedicure? Peel first, paint afterwards, so the colour sits on smooth skin.",
              ].map((tip) => (
                <div
                  key={tip}
                  className="bg-white border border-purple-brand/20 rounded-2xl p-5 flex items-start space-x-3"
                >
                  <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            <div className="bg-purple-light border-l-4 border-purple-brand rounded-xl p-5 flex items-start space-x-3">
              <Info className="w-5 h-5 text-purple-brand shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-teal-dark">A reminder:</span> Silkpedi is a
                cosmetic foot peel, not a medical treatment. Don't use it on open cracks,
                wounds or infected skin, and if you have diabetes, poor circulation or any foot
                condition, speak to your doctor first. Not for use during pregnancy or
                breastfeeding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#061a18] text-white py-10 px-4 md:px-8 border-t border-teal-light/25">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-brand flex items-center justify-center">
              <span className="font-serif font-black text-white text-base">S</span>
            </div>
            <span className="font-serif text-xl tracking-wide font-black">silkpedi</span>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono font-bold text-white flex items-center hover:text-purple-light transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5 text-purple-brand" /> {WHATSAPP_DISPLAY}
          </a>
          <a href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            Back to silkpedi.com
          </a>
        </div>
        <p className="max-w-5xl mx-auto text-center text-[11px] text-gray-600 mt-6">
          © 2026 SilkPedi Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
