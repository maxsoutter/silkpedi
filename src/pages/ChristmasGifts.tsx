/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Facebook-ads landing page for the festive season: someone buying Silkpedi
 * as a Christmas gift (for a wife, mum, sister, friend or Secret Santa), plus
 * the woman treating herself before December parties, weddings and holidays.
 *
 * Same bundles, member pricing and WhatsApp order flow as every other page.
 * Every order from here asks the team to gift-wrap it (Max confirmed the team
 * can do this). Deliberately NOT offered, because the team can't: gift notes
 * and delivery straight to the recipient.
 *
 * The timing section is the honest urgency: the peel takes 7–10 days, so for
 * smooth feet on Christmas Day the gift has to be opened by mid-December.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Gift,
  Sparkles,
  Truck,
  ShieldCheck,
  Lock,
  Star,
  ChevronDown,
  ChevronUp,
  Phone,
  CalendarDays,
  Info,
  Heart,
  PartyPopper,
  Wallet,
} from "lucide-react";
import { PRODUCT_BUNDLES, INITIAL_REVIEWS } from "../data";
import { useOrderFlow, WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";
import { useMembership, singlePrice, priceFor } from "../membership";
import BundlePrice, { BundleItems } from "../BundlePrice";
import { LegalLinks } from "./PolicyLayout";
import packImage from "../assets/images/silkpedi_pack_1779850178423.webp";

/** Tags leads from this page in the Netlify inbox, so ad spend can be attributed. */
const SOURCE_TAG = "XMAS LP";

/** Added to every WhatsApp order message from this page. */
const GIFT_NOTE = "It's a Christmas gift, please gift-wrap it.";

const WHY = [
  {
    icon: "spa",
    title: "A spa treatment she does at home",
    body: "One relaxing hour with the booties on, and about ten days later her heels are soft and smooth. A gift that keeps working after the wrapping paper's gone.",
  },
  {
    icon: "party",
    title: "Made for December",
    body: "Year-end parties, weddings, church, beach and pool days. December is the month everyone's in open shoes, and nobody wants to be thinking about their heels.",
  },
  {
    icon: "wallet",
    title: "A gift for every budget",
    body: "From a single pack for Secret Santa to the full 3-pack kit for someone special, all gift-wrapped and delivered by courier.",
  },
];

const WHO = [
  {
    who: "Secret Santa or a colleague",
    pack: "1 Pack Treatment",
    why: "A thoughtful little luxury that isn't another candle or mug.",
  },
  {
    who: "Your mum, sister or best friend",
    pack: "2 Packs Combo",
    why: "One for her now and one for the new year. Or one for her and one for you.",
  },
  {
    who: "Your wife or partner",
    pack: "3 Packs Absolute Glow",
    why: "The full kit: peels, foot file, nourishing cream and moisturising socks.",
  },
];

const FAQS = [
  {
    id: "x1",
    q: "When does she need it for smooth feet on Christmas Day?",
    a: "Peeling usually starts on Day 3 or 4 and finishes between Day 7 and Day 10. For smooth feet on Christmas Day she needs to do the treatment by about 14 December, so order early in December and give it as an early present. If you'd rather it's opened on Christmas Day, it's perfect for New Year and January holidays instead.",
  },
  {
    id: "x2",
    q: "Will it come gift-wrapped?",
    a: "Yes, and it's free. Every order from this page is gift-wrapped, so it's ready to give the moment it arrives. We deliver it to you, not to her, so the surprise stays with you.",
  },
  {
    id: "x3",
    q: "Is it suitable for anyone?",
    a: "It's suitable for most adults and every skin type, but please check before you give it: it shouldn't be used on open cracks, wounds or infected skin, by anyone who is pregnant or breastfeeding, or without a doctor's okay by someone with diabetes, poor circulation or a foot condition.",
  },
  {
    id: "x4",
    q: "What if it isn't the right gift?",
    a: "Unopened kits: message us on WhatsApp and we'll do our best to help. For hygiene reasons we can't take back kits that have been opened or used. If anything arrives damaged, we'll replace it free of charge.",
  },
  {
    id: "x5",
    q: "How does delivery work?",
    a: "Fast courier delivery: free within the Harare CBD area on the 2-pack and 3-pack, and a flat $5 on a single pack. For anywhere else in Zimbabwe, or South Africa, Zambia and beyond, message us on WhatsApp and we'll arrange it with you.",
  },
];

const SAFE_NOTE =
  "Silkpedi is a cosmetic foot peel. Don't use it on open cracks, wounds or infected skin, and if you have diabetes, poor circulation or any foot condition, speak to your doctor first. Not for use during pregnancy or breastfeeding.";

export default function ChristmasGifts() {
  const { openOrderModal, orderModal } = useOrderFlow(SOURCE_TAG, GIFT_NOTE);
  const { isMember } = useMembership();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>("x1");

  const bundlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Silkpedi — The Christmas Gift She'll Actually Use";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBundles = () =>
    bundlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const whyIcon = (kind: string) => {
    if (kind === "spa") return <Sparkles className="w-6 h-6" />;
    if (kind === "party") return <PartyPopper className="w-6 h-6" />;
    return <Wallet className="w-6 h-6" />;
  };

  return (
    <div className="relative min-h-screen font-sans bg-white selection:bg-purple-brand selection:text-white">
      {/* ── Announcement bar ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-dark via-[#0c312d] to-purple-dark text-white text-[11px] md:text-sm py-2 px-3 md:px-4 shadow-inner relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center md:justify-between items-center space-y-1 sm:space-y-0 text-center">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <Gift className="w-3.5 h-3.5 text-purple-light shrink-0" />
            <span>FREE GIFT WRAPPING ON EVERY CHRISTMAS ORDER</span>
          </div>
          <span className="hidden md:inline bg-purple-brand/30 text-purple-light text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
            ZIMBABWE • SOUTH AFRICA • ZAMBIA &amp; BEYOND
          </span>
        </div>
      </div>

      {/* ── Header — no nav links; this is an ad landing page ──────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-teal-dark/95 backdrop-blur-md py-3 shadow-xl border-b border-teal-light/20"
            : "bg-teal-dark py-5"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
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

          <button
            onClick={scrollToBundles}
            className="px-5 md:px-6 py-2.5 text-[11px] md:text-xs font-extrabold tracking-wider text-white uppercase bg-purple-brand rounded-full shadow-md shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            SHOP GIFTS<span className="hidden sm:inline"> — FROM ${singlePrice(isMember)}</span>
          </button>
        </div>
      </header>

      {/* ── 1. Hero ────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-purple-dark via-[#2a1846] to-teal-dark text-white overflow-hidden">
        {/* Soft festive glow, kept to brand colours */}
        <div className="absolute -top-24 -left-24 bg-purple-brand/30 w-[28rem] h-[28rem] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-0 bg-teal-bright/20 w-[30rem] h-[30rem] rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 text-purple-light font-mono text-[11px] uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>The Christmas gift edit</span>
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              The gift she'll
              <br />
              <span className="italic text-purple-light">actually use.</span>
            </h1>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-lg">
              Salon-soft feet for the festive season. An at-home foot peel that takes one relaxing hour,
              arrives beautifully gift-wrapped, and has her ready for every pair of December sandals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={scrollToBundles}
                className="px-9 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/40 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                CHOOSE HER GIFT — FROM ${singlePrice(isMember)}
              </button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300 font-semibold">
              <span className="flex items-center"><Gift className="w-4 h-4 mr-1.5 text-purple-light" />Free gift wrapping</span>
              <span className="flex items-center"><Truck className="w-4 h-4 mr-1.5 text-purple-light" />Courier delivery</span>
              <span className="flex items-center"><Sparkles className="w-4 h-4 mr-1.5 text-purple-light" />Gentle on every skin type</span>
            </div>
          </div>

          <div className="relative max-w-md mx-auto w-full">
            <div className="absolute -inset-6 bg-purple-brand/25 rounded-[3rem] blur-2xl" />
            <img
              src={packImage}
              alt="The Silkpedi exfoliating foot peel pack"
              className="relative w-full rounded-[2rem] shadow-2xl object-cover border border-white/10"
            />
            <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white text-teal-dark rounded-2xl shadow-xl px-4 py-3 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-brand flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-purple-brand">Ready to give</p>
                <p className="text-sm font-bold">Free gift wrapping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Why it's a good gift ────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              WHY IT WORKS AS A GIFT
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark leading-tight">
              Not another candle.
              <br />
              <span className="italic text-purple-brand">Something she'll feel.</span>
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY.map((w) => (
              <div key={w.title} className="bg-purple-light/50 border border-purple-brand/15 rounded-[1.75rem] p-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-dark text-white flex items-center justify-center shadow-md">
                  {whyIcon(w.icon)}
                </div>
                <h3 className="font-serif text-xl font-bold text-teal-dark">{w.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Who it's for ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-purple-light">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-teal-dark text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              PICK THE RIGHT ONE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">
              Who are you buying for?
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {WHO.map((w) => {
              const bundle = PRODUCT_BUNDLES.find((b) => b.name === w.pack) || PRODUCT_BUNDLES[0];
              return (
                <div
                  key={w.who}
                  className="bg-white border border-purple-brand/15 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 shadow-sm"
                >
                  <div className="flex-1 space-y-1.5">
                    <h3 className="font-serif text-xl font-bold text-teal-dark">{w.who}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{w.why}</p>
                  </div>
                  <button
                    onClick={() => openOrderModal(bundle)}
                    className="shrink-0 px-6 py-3.5 bg-teal-dark text-white text-xs font-extrabold tracking-wider uppercase rounded-xl hover:bg-opacity-90 transition-all cursor-pointer"
                  >
                    {w.pack} — ${priceFor(bundle, isMember)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Timing ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-purple-brand/10 w-96 h-96 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-purple-brand/15 border-2 border-purple-brand rounded-[2rem] p-7 md:p-10 text-center space-y-5">
            <CalendarDays className="w-9 h-9 text-purple-brand mx-auto" />
            <h2 className="font-serif text-2xl md:text-4xl font-semibold leading-tight">
              Want her feet smooth <span className="italic text-purple-light">on Christmas Day?</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Silkpedi works with the skin's own cycle: peeling starts around Day 3 and she's completely
              smooth by Day 7 to 10. So she needs to use it by about{" "}
              <span className="font-bold text-white">14 December</span>. Order early in December and give it
              as an early present.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Saving it for under the tree? It's just as good a gift for New Year and January holidays.
            </p>
            <button
              onClick={scrollToBundles}
              className="px-9 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              ORDER IN GOOD TIME
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. Bundles ─────────────────────────────────────────────────── */}
      <section
        ref={bundlesRef}
        className="py-14 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden border-t border-teal-light/20"
        id="bundle-select-section"
      >
        <div className="absolute top-0 left-0 bg-purple-brand/10 w-96 h-96 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              FREE GIFT WRAPPING
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">Choose Her Gift</h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-300 text-sm md:text-base">
              Every pack below arrives gift-wrapped and ready to give. Just confirm your order with us on
              WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-6 md:pt-4">
            {PRODUCT_BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                className={`rounded-[1.75rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  bundle.popular
                    ? "bg-[#FAF8FE] text-teal-dark border-4 border-purple-brand shadow-2xl md:scale-[1.03] z-10"
                    : "bg-[#092522] text-white border border-teal-light/40 shadow-xl hover:bg-[#0c312d]"
                }`}
                id={`bundle-card-${bundle.id}`}
              >
                {bundle.popular && (
                  <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-purple-brand text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    🎁 ONE FOR HER, ONE FOR YOU
                  </div>
                )}
                {bundle.bestValue && (
                  <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-teal-bright text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    💎 THE FULL GIFT KIT
                  </div>
                )}
                {!bundle.popular && !bundle.bestValue && (
                  <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-teal-light text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-sm border border-teal-bright/35 whitespace-nowrap">
                    SECRET SANTA
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center space-y-2 pt-2">
                    <h3 className="font-serif text-2xl font-bold">{bundle.name}</h3>
                  </div>

                  <BundlePrice bundle={bundle} isMember={isMember} />

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      WHAT'S IN THE GIFT:
                    </p>
                    <BundleItems bundle={bundle} />
                    <div className="flex items-start space-x-2.5 text-xs font-medium">
                      <Gift className="w-4.5 h-4.5 text-purple-brand flex-shrink-0 mt-0.5" />
                      <span className={bundle.popular ? "text-gray-600" : "text-gray-200"}>
                        <span className="font-black text-purple-brand">FREE BONUS:</span> Gift wrapping, ready to give
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => openOrderModal(bundle)}
                    className={`w-full py-4 text-center font-extrabold tracking-wider uppercase rounded-xl shadow-lg hover:shadow-xl transition-all hover:translate-y-[-1px] cursor-pointer ${
                      bundle.popular
                        ? "bg-purple-brand text-white hover:bg-opacity-95"
                        : "bg-white text-teal-dark hover:bg-gray-50"
                    }`}
                    id={`buy-button-${bundle.id}`}
                  >
                    GIVE SILKPEDI
                  </button>
                  <p
                    className={`text-[10px] text-center mt-2.5 font-medium ${
                      bundle.popular ? "text-gray-400" : "text-gray-300"
                    }`}
                  >
                    🔒 Order confirmed on WhatsApp
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#092522] border border-teal-light/35 p-6 rounded-2xl flex flex-wrap justify-center items-center gap-y-4 gap-x-12 text-center text-xs md:text-sm font-semibold max-w-4xl mx-auto">
            <span className="flex items-center space-x-2 text-gray-300 justify-center">
              <Truck className="w-4 h-4 text-purple-light" />
              <span>📦 FAST COURIER DELIVERY</span>
            </span>
            <span className="flex items-center space-x-2 text-gray-300 justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-light" />
              <span>🏆 ZIMBABWE, SOUTH AFRICA, ZAMBIA &amp; BEYOND</span>
            </span>
            <span className="flex items-center space-x-2 text-gray-300 justify-center">
              <Lock className="w-4 h-4 text-purple-light" />
              <span>💬 A REAL PERSON ANSWERS ON WHATSAPP</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 6. Reviews (the same real reviews as the homepage) ─────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              WHAT CUSTOMERS SAY
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">
              Soft feet, happy people
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-purple-light/40 border border-purple-brand/15 rounded-[1.75rem] p-7 space-y-4"
              >
                <div className="flex space-x-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <h3 className="font-serif text-lg font-bold text-teal-dark">"{review.title}"</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                <div className="flex items-center space-x-3 pt-2 border-t border-purple-brand/10">
                  <img src={review.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <p className="text-sm font-bold text-teal-dark">{review.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-purple-light">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <span className="bg-teal-dark text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              GIFT QUESTIONS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">
              Before you order
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="space-y-3">
            {FAQS.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all ${
                    isOpen ? "border-purple-brand shadow-lg" : "border-purple-brand/15"
                  }`}
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

      {/* ── 8. Closing CTA ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-br from-purple-dark via-[#2a1846] to-teal-dark text-white relative overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-purple-brand/20 w-[36rem] h-[36rem] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <Heart className="w-8 h-8 text-purple-light mx-auto" />
          <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            This Christmas, give her
            <br />
            <span className="italic text-purple-light">feet she loves showing off.</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            Gift-wrapped, delivered by courier, and smooth in about ten days.
          </p>
          <button
            onClick={scrollToBundles}
            className="px-10 py-4.5 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            SHOP GIFTS — FROM ${singlePrice(isMember)}
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
        <div className="max-w-5xl mx-auto border-t border-teal-light/20 mt-10 pt-6 text-xs text-gray-500 text-center">
          <LegalLinks className="mb-3" />
          <p>© 2026 Silkpedi. All rights reserved.</p>
        </div>
      </footer>

      {orderModal}
    </div>
  );
}
