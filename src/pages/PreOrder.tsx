/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Pre-sale page for the next shipment. Not linked from the homepage; it's for
 * ads, WhatsApp broadcasts and status posts.
 *
 * Terms Max set (2026-10-10), and the page promises nothing beyond them:
 *   - Pre-sale price $22 / $40 / $62 (regular $33 / $59 / $92).
 *   - Reserve now, pay on delivery. No money changes hands until delivery.
 *   - No quantity limit. The price runs until the shipment lands (~24 Oct).
 *   - Delivery promised as "late October to early November".
 *
 * When the stock lands, set PRESALE_OPEN to false: the page then tells
 * visitors the pre-sale has ended and sends them to the shop, so an old ad or
 * shared link never offers a price the team no longer honours.
 *
 * The discount pop-up is switched off here (main.tsx): its $25 member price is
 * worse than the pre-sale price and would only confuse people.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import { PRODUCT_BUNDLES } from "../data";
import { useOrderFlow, WHATSAPP_PHONE, WHATSAPP_DISPLAY, SpecialPricing } from "../OrderFlow";
import { BundleItems } from "../BundlePrice";
import { LegalLinks } from "./PolicyLayout";
import packImage from "../assets/images/silkpedi_real_pack.webp";

/** Flip to false the day the shipment lands. */
const PRESALE_OPEN = true;

/** Tags leads from this page in the Netlify inbox. */
const SOURCE_TAG = "PRESALE";

const PRESALE: SpecialPricing = {
  label: "pre-sale price",
  prices: { "1-pack": 22, "2-pack": 40, "3-pack": 62 },
  verb: "reserve",
};

const PAY_NOTE = "I'll pay on delivery.";
const DELIVERY_WINDOW = "late October to early November";
const SINGLE = PRESALE.prices["1-pack"];

const STEPS = [
  {
    icon: "msg",
    title: "Reserve on WhatsApp",
    body: "Pick your pack below and send us the message. We'll confirm your reservation at the pre-sale price.",
  },
  {
    icon: "cal",
    title: "We message you when it lands",
    body: `The shipment is due in about two weeks. As soon as it's here we'll contact you to arrange delivery, ${DELIVERY_WINDOW}.`,
  },
  {
    icon: "wallet",
    title: "Pay when it's delivered",
    body: "Nothing to pay today. You pay the pre-sale price when your Silkpedi arrives.",
  },
];

const FAQS = [
  {
    id: "p1",
    q: "Do I pay anything now?",
    a: "No. Reserving is free. You pay the pre-sale price when your order is delivered.",
  },
  {
    id: "p2",
    q: "When will my order arrive?",
    a: `Our next shipment is due in about two weeks. Reserved orders will be delivered ${DELIVERY_WINDOW}, and we'll message you on WhatsApp as soon as the stock lands to arrange a time.`,
  },
  {
    id: "p3",
    q: "How long does the pre-sale price last?",
    a: "Until the shipment lands. After that, prices go back to normal, so reserve now to lock in the pre-sale price.",
  },
  {
    id: "p4",
    q: "What if I change my mind?",
    a: "Just tell us on WhatsApp before delivery. You haven't paid anything, so there's nothing to refund.",
  },
  {
    id: "p5",
    q: "How does delivery work?",
    a: "Free within the Harare CBD area on the 2-pack and 3-pack, and a flat $5 on a single pack. For anywhere else in Zimbabwe, or South Africa, Zambia and beyond, message us on WhatsApp and we'll arrange it with you.",
  },
  {
    id: "p6",
    q: "How does Silkpedi work?",
    a: "Wear the peel booties for about an hour, then rinse. Over the next few days the dead, hard skin loosens: peeling usually starts on Day 3 or 4 and finishes by Day 7 to 10, leaving soft, smooth feet.",
  },
];

const SAFE_NOTE =
  "Silkpedi is a cosmetic foot peel. Don't use it on open cracks, wounds or infected skin, and if you have diabetes, poor circulation or any foot condition, speak to your doctor first. Not for use during pregnancy or breastfeeding.";

function Logo() {
  return (
    <div className="flex items-center space-x-2.5">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-brand to-teal-bright flex items-center justify-center shadow-lg">
        <span className="font-serif font-black text-white text-xl">S</span>
      </div>
      <div className="flex flex-col text-left">
        <span className="font-serif text-2xl tracking-wide font-black bg-gradient-to-r from-purple-light via-white to-purple-brand bg-clip-text text-transparent">
          silkpedi
        </span>
        <span className="text-[9px] font-bold text-purple-brand tracking-widest uppercase">At-Home Luxury Pedi</span>
      </div>
    </div>
  );
}

/** Shown instead of the page once PRESALE_OPEN is false. */
function PresaleClosed() {
  useEffect(() => {
    document.title = "Silkpedi — Pre-Sale Ended";
  }, []);
  return (
    <div className="min-h-screen bg-teal-dark text-white flex flex-col items-center justify-center px-6 text-center space-y-6">
      <Logo />
      <h1 className="font-serif text-3xl md:text-5xl font-semibold">The pre-sale has ended.</h1>
      <p className="text-gray-300 max-w-md leading-relaxed">
        Thank you to everyone who reserved. Silkpedi is now in stock and ready to order.
      </p>
      <a
        href="/"
        className="px-9 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl hover:bg-opacity-95 transition-all"
      >
        Shop Silkpedi
      </a>
    </div>
  );
}

export default function PreOrder() {
  if (!PRESALE_OPEN) return <PresaleClosed />;
  return <PresaleOpen />;
}

function PresaleOpen() {
  const { openOrderModal, orderModal } = useOrderFlow(SOURCE_TAG, PAY_NOTE, PRESALE);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>("p1");
  const bundlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Silkpedi Pre-Sale — Reserve Now, Pay on Delivery";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBundles = () => bundlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const stepIcon = (kind: string) => {
    if (kind === "msg") return <MessageCircle className="w-6 h-6" />;
    if (kind === "cal") return <CalendarClock className="w-6 h-6" />;
    return <Wallet className="w-6 h-6" />;
  };

  return (
    <div className="relative min-h-screen font-sans bg-white selection:bg-purple-brand selection:text-white">
      {/* ── Announcement bar ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-dark via-[#0c312d] to-purple-dark text-white text-[11px] md:text-sm py-2 px-3 md:px-4 shadow-inner relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 font-medium tracking-wide text-center">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>PRE-SALE: RESERVE NOW, PAY NOTHING UNTIL DELIVERY</span>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-teal-dark/95 backdrop-blur-md py-3 shadow-xl border-b border-teal-light/20" : "bg-teal-dark py-5"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Logo />
          <button
            onClick={scrollToBundles}
            className="px-5 md:px-6 py-2.5 text-[11px] md:text-xs font-extrabold tracking-wider text-white uppercase bg-purple-brand rounded-full shadow-md shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            RESERVE<span className="hidden sm:inline"> — ${SINGLE}</span>
          </button>
        </div>
      </header>

      {/* ── 1. Hero ────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-teal-dark via-[#0c312d] to-purple-dark text-white overflow-hidden">
        <div className="absolute -top-24 -left-24 bg-purple-brand/25 w-[28rem] h-[28rem] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-0 bg-teal-bright/20 w-[30rem] h-[30rem] rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 text-purple-light font-mono text-[11px] uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New stock arriving soon</span>
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              Reserve yours now.
              <br />
              <span className="italic text-purple-light">Pay when it arrives.</span>
            </h1>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-lg">
              Our next Silkpedi shipment lands in about two weeks. Reserve today to lock in the pre-sale price of{" "}
              <span className="font-bold text-white">${SINGLE}</span> instead of{" "}
              <span className="line-through">${PRODUCT_BUNDLES[0].originalPrice}</span>, with nothing to pay until
              your order is delivered.
            </p>
            <button
              onClick={scrollToBundles}
              className="px-9 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/40 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              RESERVE MY PACK — ${SINGLE}
            </button>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300 font-semibold">
              <span className="flex items-center"><Wallet className="w-4 h-4 mr-1.5 text-purple-light" />Nothing to pay today</span>
              <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-purple-light" />Pre-sale price locked in</span>
              <span className="flex items-center"><Truck className="w-4 h-4 mr-1.5 text-purple-light" />Delivery {DELIVERY_WINDOW}</span>
            </div>
          </div>

          <div className="relative max-w-sm mx-auto w-full">
            <div className="absolute -inset-6 bg-purple-brand/25 rounded-[3rem] blur-2xl" />
            <img
              src={packImage}
              alt="The Silkpedi exfoliating foot peel pack"
              className="relative w-full rounded-[2rem] shadow-2xl object-cover border border-white/10"
            />
            <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white text-teal-dark rounded-2xl shadow-xl px-4 py-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-purple-brand">Pre-sale price</p>
              <p className="text-lg font-black">
                ${SINGLE}{" "}
                <span className="text-sm text-gray-400 line-through font-bold">${PRODUCT_BUNDLES[0].originalPrice}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. How the pre-sale works ──────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              HOW IT WORKS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">
              Three steps. No risk.
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="bg-purple-light/50 border border-purple-brand/15 rounded-[1.75rem] p-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-dark text-white flex items-center justify-center shadow-md shrink-0">
                    {stepIcon(s.icon)}
                  </div>
                  <span className="font-mono text-xs font-black text-purple-brand">0{i + 1}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-teal-dark">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Packs ───────────────────────────────────────────────────── */}
      <section
        ref={bundlesRef}
        className="py-14 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden"
        id="bundle-select-section"
      >
        <div className="absolute top-0 right-0 bg-purple-brand/10 w-96 h-96 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              PRE-SALE PRICES
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">Reserve Your Pack</h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-300 text-sm md:text-base">
              These prices are only available until the shipment lands. Reserve now, pay on delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-6 md:pt-4">
            {PRODUCT_BUNDLES.map((bundle) => {
              const price = PRESALE.prices[bundle.id];
              const save = bundle.originalPrice - price;
              return (
                <div
                  key={bundle.id}
                  className={`rounded-[1.75rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative ${
                    bundle.popular
                      ? "bg-[#FAF8FE] text-teal-dark border-4 border-purple-brand shadow-2xl md:scale-[1.03] z-10"
                      : "bg-[#092522] text-white border border-teal-light/40 shadow-xl"
                  }`}
                  id={`bundle-card-${bundle.id}`}
                >
                  {bundle.popular && (
                    <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-purple-brand text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                      🔥 MOST POPULAR
                    </div>
                  )}
                  {bundle.bestValue && (
                    <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-teal-bright text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                      💎 BEST VALUE
                    </div>
                  )}
                  {!bundle.popular && !bundle.bestValue && (
                    <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-teal-light text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-sm border border-teal-bright/35 whitespace-nowrap">
                      SINGLE PACK
                    </div>
                  )}

                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-bold text-center pt-2">{bundle.name}</h3>

                    <div
                      className={`text-center py-5 rounded-2xl border ${
                        bundle.popular ? "bg-purple-light border-purple-brand/10" : "bg-teal-dark/30 border-teal-light/20"
                      }`}
                    >
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-5xl font-black tracking-tight">${price}</span>
                        <span className="text-lg line-through text-gray-400 font-bold">${bundle.originalPrice}</span>
                      </div>
                      <p className="text-[10px] font-mono font-bold uppercase mt-1 tracking-widest">
                        Pre-sale price · {bundle.description}
                      </p>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl p-3 text-center text-xs font-black">
                      🎉 PRE-SALE: YOU SAVE ${save} · PAY ON DELIVERY
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">WHAT'S IN THE KIT:</p>
                      <BundleItems bundle={bundle} />
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => openOrderModal(bundle)}
                      className={`w-full py-4 text-center font-extrabold tracking-wider uppercase rounded-xl shadow-lg hover:shadow-xl transition-all hover:translate-y-[-1px] cursor-pointer ${
                        bundle.popular ? "bg-purple-brand text-white hover:bg-opacity-95" : "bg-white text-teal-dark hover:bg-gray-50"
                      }`}
                      id={`buy-button-${bundle.id}`}
                    >
                      RESERVE NOW
                    </button>
                    <p className={`text-[10px] text-center mt-2.5 font-medium ${bundle.popular ? "text-gray-400" : "text-gray-300"}`}>
                      🔒 Nothing to pay until delivery
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-purple-light">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <span className="bg-teal-dark text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              PRE-SALE QUESTIONS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">Before you reserve</h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="space-y-3">
            {FAQS.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all ${isOpen ? "border-purple-brand shadow-lg" : "border-purple-brand/15"}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between text-left p-5 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-teal-dark text-base pr-4">{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-purple-brand shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>}
                </div>
              );
            })}
          </div>

          <div className="bg-white border-l-4 border-purple-brand rounded-xl p-5 flex items-start space-x-3">
            <Info className="w-5 h-5 text-purple-brand shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-teal-dark">Please note:</span> {SAFE_NOTE}
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Closing CTA ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-br from-purple-dark via-[#2a1846] to-teal-dark text-white relative overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-purple-brand/20 w-[36rem] h-[36rem] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <Check className="w-9 h-9 text-emerald-400 mx-auto" strokeWidth={3} />
          <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Lock in ${SINGLE} today.
            <br />
            <span className="italic text-purple-light">Pay nothing until it's at your door.</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            The pre-sale price ends when the shipment lands.
          </p>
          <button
            onClick={scrollToBundles}
            className="px-10 py-4.5 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            RESERVE MY PACK
          </button>
          <p className="text-gray-400 text-xs">
            Or message us directly on WhatsApp:{" "}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-light font-mono font-bold hover:text-white transition-colors"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#061a18] text-white py-12 px-4 md:px-8 border-t border-teal-light/25">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <span className="font-serif text-xl tracking-wide font-black">silkpedi</span>
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
        <div className="max-w-5xl mx-auto border-t border-teal-light/20 mt-10 pt-6 text-xs text-gray-500 text-center">
          <LegalLinks className="mb-3" />
          <p>© 2026 Silkpedi. All rights reserved.</p>
        </div>
      </footer>

      {orderModal}
    </div>
  );
}
