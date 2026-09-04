/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, ArrowRight, Lock, Smartphone, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import { ProductBundle } from "./types";

export const WHATSAPP_PHONE = "263788860359";
export const WHATSAPP_DISPLAY = "+263 78 886 0359";

const BUNDLE_WHATSAPP_MESSAGES: Record<string, string> = {
  "1-pack": "Hello, I'd like to order the Silkpedi 1-Pack treatment ($25).",
  "2-pack": "Hello, I'd like to order the Silkpedi 2-Pack Combo ($45).",
  "3-pack": "Hello, I'd like to order the Silkpedi 3-Pack Absolute Glow bundle ($70).",
};

/**
 * The lead-capture order flow, shared by every landing page.
 *
 *  - Mobile: Step 1 email (optional) → redirect straight into the WhatsApp app.
 *  - Desktop: Step 1 name + number (required) + email (optional) → Step 2 with a
 *    QR to finish on their phone, an "open on this computer" link, and the number.
 *
 * `sourceTag` is appended to the bundle name on the Netlify lead, so leads can be
 * attributed to the page (and therefore the ad set) that produced them.
 */
export function useOrderFlow(sourceTag?: string) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderBundle, setOrderBundle] = useState<ProductBundle | null>(null);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderStep, setOrderStep] = useState<"form" | "handoff">("form");
  const [orderWaUrl, setOrderWaUrl] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [numberCopied, setNumberCopied] = useState(false);

  // Reliable enough device split: mobile has WhatsApp in-app, desktop usually doesn't.
  const [isMobile] = useState(
    () =>
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  // Every buy button opens the modal. A short reference code links the emailed
  // Netlify lead to the WhatsApp message the customer sends, so an abandoned
  // order can be matched to their chat.
  const openOrderModal = (bundle: ProductBundle | null) => {
    setOrderBundle(bundle);
    setOrderName("");
    setOrderPhone("");
    setOrderEmail("");
    setOrderStep("form");
    setOrderWaUrl("");
    setNumberCopied(false);
    setIsOrderModalOpen(true);
  };

  const generateOrderRef = () => {
    // No ambiguous characters (0/O, 1/I/L) so codes are easy to read aloud/type.
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return `SP-${code}`;
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitting(true);

    const name = orderName.trim();
    const phone = orderPhone.trim();
    const email = orderEmail.trim();
    const baseBundleName = orderBundle ? orderBundle.name : "Not specified";
    const bundleName = sourceTag ? `${baseBundleName} [${sourceTag}]` : baseBundleName;

    // Desktop always captures contact details, so always record + tag it.
    // Mobile only records (and tags) if they chose to leave an email.
    const hasLead = !isMobile || !!email;
    const ref = hasLead ? generateOrderRef() : "";

    if (hasLead) {
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            "form-name": "silkpedi-lead",
            name,
            phone,
            email,
            ref,
            bundle: bundleName,
          }).toString(),
        });
      } catch {
        // Never block the sale on a capture hiccup — fall through to WhatsApp.
      }
    }

    const base = orderBundle
      ? (BUNDLE_WHATSAPP_MESSAGES[orderBundle.id] ||
          `Hello, I'd like to order the Silkpedi ${orderBundle.name} ($${orderBundle.price}).`)
      : "Hello, I'd like to buy a Silkpedi kit.";
    const message = ref ? `${base}\n\nOrder ref: ${ref}` : base;
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    if (isMobile) {
      // They have WhatsApp in-app — same-tab redirect so popup blockers don't eat it.
      setIsOrderModalOpen(false);
      setOrderSubmitting(false);
      window.location.href = waUrl;
    } else {
      // Desktop: stay in the modal and offer the QR / clickthrough hand-off.
      setOrderWaUrl(waUrl);
      setOrderStep("handoff");
      setOrderSubmitting(false);
    }
  };

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(`+${WHATSAPP_PHONE}`);
      setNumberCopied(true);
      window.setTimeout(() => setNumberCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the number is visible on screen regardless.
    }
  };

  const orderModal = (
    <AnimatePresence>
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={() => !orderSubmitting && setIsOrderModalOpen(false)}
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
          >
            {/* Header */}
            <div className="bg-teal-dark text-white p-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-purple-light uppercase mb-1">
                  Step {orderStep === "form" ? "1" : "2"} of 2
                </p>
                <h3 className="font-serif text-xl font-bold leading-tight">
                  {orderStep === "form" ? "You're almost there" : "Finish on WhatsApp"}
                </h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-teal-light/40 transition-colors focus:outline-none shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-purple-light" />
              </button>
            </div>

            {orderStep === "form" ? (
              /* ---------- Step 1: capture details ---------- */
              <form onSubmit={submitOrder} className="p-6 space-y-4">
                {orderBundle && (
                  <div className="bg-purple-light/60 border border-purple-brand/15 rounded-xl p-3.5 flex items-center justify-between">
                    <span className="font-serif font-bold text-teal-dark text-sm">{orderBundle.name}</span>
                    <span className="font-mono font-black text-purple-brand">${orderBundle.price}</span>
                  </div>
                )}

                {/* Desktop captures name + WhatsApp number so an order can be followed up even if they never message. */}
                {!isMobile && (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="order-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Name
                      </label>
                      <input
                        id="order-name"
                        type="text"
                        required
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        className="w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="order-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                        WhatsApp Number
                      </label>
                      <input
                        id="order-phone"
                        type="tel"
                        required
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="+263 77 123 4567"
                        autoComplete="tel"
                        className="w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-base"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="order-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Email <span className="text-gray-400 font-medium normal-case">(optional)</span>
                  </label>
                  <input
                    id="order-email"
                    type="email"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-base"
                  />
                  {isMobile && (
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Add your email so we can keep a record of your order — we'll only use it to help with this purchase.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="w-full py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-lg shadow-purple-900/30 hover:bg-opacity-95 transition-all disabled:opacity-70 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{orderSubmitting ? "One moment…" : "Continue to Order"}</span>
                  {!orderSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center space-x-1.5">
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>Step 2: confirm your order on WhatsApp</span>
                </p>
              </form>
            ) : (
              /* ---------- Step 2 (desktop): hand off to WhatsApp ---------- */
              <div className="p-6 space-y-5 text-center">
                {orderBundle && (
                  <div className="bg-purple-light/60 border border-purple-brand/15 rounded-xl p-3.5 flex items-center justify-between text-left">
                    <span className="font-serif font-bold text-teal-dark text-sm">{orderBundle.name}</span>
                    <span className="font-mono font-black text-purple-brand">${orderBundle.price}</span>
                  </div>
                )}

                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="inline-flex items-center font-bold text-teal-dark">
                    <Smartphone className="w-4 h-4 mr-1.5" />Scan with your phone
                  </span>
                  <br />to open WhatsApp and send your order.
                </p>

                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-2xl border border-purple-brand/15 shadow-sm">
                    <QRCodeSVG value={orderWaUrl} size={172} fgColor="#08211e" bgColor="#ffffff" level="M" />
                  </div>
                </div>

                <div className="flex items-center text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="px-3">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <a
                  href={orderWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-lg shadow-purple-900/30 hover:bg-opacity-95 transition-all"
                >
                  Open WhatsApp on this computer
                </a>

                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="w-full py-3 border border-purple-brand/25 text-teal-dark rounded-xl text-sm font-bold hover:bg-purple-light/50 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {numberCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-purple-brand" />}
                  <span>{numberCopied ? "Number copied!" : `Message us: ${WHATSAPP_DISPLAY}`}</span>
                </button>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  We've saved your details — we'll follow up to help you complete your order.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return { openOrderModal, orderModal, isMobile };
}
