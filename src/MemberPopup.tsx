/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { X, ArrowRight, Gift, Check, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useMembership,
  joinMembership,
  openMemberPopup,
  closeMemberPopup,
  popupDismissedThisVisit,
  MEMBER_DISCOUNT_PCT,
  MEMBER_SINGLE_PRICE,
  REGULAR_SINGLE_PRICE,
} from "./membership";
import { track } from "./analytics";

const POPUP_DELAY_MS = 5000;

/**
 * The discount pop-up. Mounted once in main.tsx, so it works on every page.
 *
 *  Step 1: WhatsApp number (required) → unlocks the member price immediately.
 *  Step 2: email (optional) → unlocks the free Soft Feet Guide.
 *  Step 3: done, with a link to the guide.
 *
 * Each step posts to the "silkpedi-member" Netlify form, so a number is saved
 * even if they never give an email.
 */
export default function MemberPopup() {
  const { isMember, popupOpen } = useMembership();
  const [step, setStep] = useState<"phone" | "email" | "done">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fire once, 5 seconds in, for non-members who haven't already closed it this visit.
  useEffect(() => {
    if (isMember || popupDismissedThisVisit()) return;
    const t = window.setTimeout(openMemberPopup, POPUP_DELAY_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Opened again later (e.g. from the order form) → start from the right step.
  useEffect(() => {
    if (popupOpen && !isMember) setStep("phone");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupOpen]);

  const save = async (fields: Record<string, string>) => {
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "silkpedi-member",
          page: window.location.pathname,
          ...fields,
        }).toString(),
      });
    } catch {
      // Never block the discount on a capture hiccup.
    }
  };

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await save({ phone: phone.trim(), email: "", step: "1-phone" });
    joinMembership();
    track("Lead", { content_name: "member-discount" });
    setSubmitting(false);
    setStep("email");
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await save({ phone: phone.trim(), email: email.trim(), step: "2-email" });
    setSubmitting(false);
    setStep("done");
  };

  const close = () => {
    if (submitting) return;
    closeMemberPopup();
  };

  const inputClass =
    "w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-base";
  const buttonClass =
    "w-full py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-lg shadow-purple-900/30 hover:bg-opacity-95 transition-all disabled:opacity-70 flex items-center justify-center space-x-2 cursor-pointer";

  return (
    <AnimatePresence>
      {popupOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-popup-title"
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/15 transition-colors focus:outline-none z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-purple-light" />
            </button>

            {/* Header */}
            <div className="bg-teal-dark text-white px-6 pt-7 pb-6 text-center relative overflow-hidden">
              <div className="absolute -top-16 -right-10 bg-purple-brand/25 w-48 h-48 rounded-full blur-3xl" />
              <div className="relative">
                {step === "phone" && (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-purple-brand flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <h3 id="member-popup-title" className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                      You have a {MEMBER_DISCOUNT_PCT}% discount!
                      <br />
                      <span className="italic text-purple-light">Grab it now.</span>
                    </h3>
                    <p className="text-gray-300 text-sm mt-3">
                      Pay the member price of{" "}
                      <span className="font-bold text-white">${MEMBER_SINGLE_PRICE}</span> instead of{" "}
                      <span className="line-through">${REGULAR_SINGLE_PRICE}</span>, on every Silkpedi pack.
                    </p>
                  </>
                )}
                {step !== "phone" && (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Check className="w-7 h-7 text-white" strokeWidth={3} />
                    </div>
                    <h3 id="member-popup-title" className="font-serif text-2xl font-bold leading-tight">
                      Discount unlocked!
                    </h3>
                    <p className="text-gray-300 text-sm mt-2">
                      Your member price:{" "}
                      <span className="font-bold text-white">${MEMBER_SINGLE_PRICE}</span>{" "}
                      <span className="line-through">${REGULAR_SINGLE_PRICE}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {step === "phone" && (
              <form onSubmit={submitPhone} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="member-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Your WhatsApp number
                  </label>
                  <input
                    id="member-phone"
                    type="tel"
                    required
                    minLength={7}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+263 77 123 4567"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
                <button type="submit" disabled={submitting} className={buttonClass}>
                  <span>{submitting ? "One moment…" : `Unlock my ${MEMBER_DISCOUNT_PCT}% discount`}</span>
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
                <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                  We'll only use your number for Silkpedi orders and offers. No spam.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="block mx-auto text-xs text-gray-400 underline hover:text-gray-600 cursor-pointer"
                >
                  No thanks, I'll pay full price
                </button>
              </form>
            )}

            {step === "email" && (
              <form onSubmit={submitEmail} className="p-6 space-y-4">
                <div className="bg-purple-light/60 border border-purple-brand/15 rounded-xl p-4 flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-purple-brand shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-bold text-teal-dark">One more thing:</span> add your email to get
                    our free <span className="font-bold text-teal-dark">Soft Feet Guide</span> plus
                    member-only offers.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="member-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="member-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
                <button type="submit" disabled={submitting} className={buttonClass}>
                  <span>{submitting ? "One moment…" : "Get my free guide"}</span>
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="block mx-auto text-xs text-gray-400 underline hover:text-gray-600 cursor-pointer"
                >
                  Skip, just take me shopping
                </button>
              </form>
            )}

            {step === "done" && (
              <div className="p-6 space-y-4 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  You're in. Your guide is ready to read now, and your ${MEMBER_SINGLE_PRICE} price is
                  already showing on the site.
                </p>
                <a
                  href="/soft-feet-guide"
                  target="_blank"
                  rel="noopener"
                  className="block w-full py-3.5 border border-purple-brand/25 text-teal-dark rounded-xl text-sm font-bold hover:bg-purple-light/50 transition-colors"
                >
                  <BookOpen className="w-4 h-4 inline mr-2 text-purple-brand" />
                  Open my Soft Feet Guide
                </a>
                <button type="button" onClick={close} className={buttonClass}>
                  <span>Shop at ${MEMBER_SINGLE_PRICE}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
