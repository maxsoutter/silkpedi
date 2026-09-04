/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Facebook-ads landing page for the "open shoes" avatar: the woman who wears
 * sandals, mules and strappy heels and wants her feet to look as good as the
 * rest of the outfit.
 *
 * Same brand system, bundles and WhatsApp order flow as every other page.
 *
 * Two deliberate choices:
 *   1. Aspiration, not shame. The ad creative leans on being laughed at; a
 *      landing page that does the same reads as nasty once the click is
 *      already won, and Meta restricts ads implying negative self-perception.
 *      This page sells confidence and compliments instead.
 *   2. The countdown is the spine of the page. The peel genuinely takes 7-10
 *      days, so "count back from your event" is real, useful information AND
 *      the strongest possible reason to order today rather than later.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Check,
  Truck,
  ShieldCheck,
  Lock,
  Star,
  ChevronDown,
  ChevronUp,
  Heart,
  Phone,
  CalendarDays,
  Info,
} from "lucide-react";
import { PRODUCT_BUNDLES, PACK_DETAILS, INITIAL_REVIEWS } from "../data";
import { useOrderFlow, WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";
import heroImage from "../assets/images/silkpedi_hero_sandals.webp";
import packImage from "../assets/images/silkpedi_pack_1779850178423.webp";

const HERO_IMAGE_URL = heroImage;
const PACK_IMAGE_URL = packImage;

/**
 * The brand purple-dark token (--color-purple-dark in index.css), used as the
 * hero background so the photo blends into it.
 *
 * The hero photo was generated to a violet colour direction on purpose: its
 * own wall measures #40305b, within a few points of this, so the two meet
 * without a seam while the page stays on brand colour. If the hero image is
 * ever replaced, replace it with another violet one rather than re-sampling
 * this to match a photo — the brand sets the colour, not the photo.
 */
const WALL = "#3a225d";

/** Tags leads from this page in the Netlify inbox, so ad spend can be attributed. */
const SOURCE_TAG = "SANDALS LP";

/**
 * The countdown. These day ranges match the FAQ and the homepage — if the
 * product timings ever change, change them in both places.
 */
const TIMELINE = [
  {
    day: "DAY 1",
    title: "You put the booties on",
    body: "One hour on the couch. Take them off, rinse, and carry on with your week — nothing shows.",
  },
  {
    day: "DAYS 3–5",
    title: "The peeling starts",
    body: "This is the messy stretch. Wear closed shoes and socks, and keep the open sandals in the cupboard for a few days.",
  },
  {
    day: "DAYS 7–10",
    title: "Completely smooth",
    body: "The last flakes are gone and the new skin underneath is soft and even. This is when you want your event to land.",
  },
];

const FAQS = [
  {
    id: "s1",
    q: "My event is in two weeks. Will I be ready in time?",
    a:
      "Comfortably, yes. Peeling usually starts on Day 3 or 4 and finishes between Day 7 and Day 10, so two weeks gives you a proper buffer. If your event is in less than a week, order anyway and time it for the one after — rushing it means peeling skin on the night, which is the opposite of what you want.",
  },
  {
    id: "s2",
    q: "Can I wear sandals while it's peeling?",
    a:
      "We'd rather you didn't, for about three or four days. The old skin comes away in flakes and it isn't pretty while it's happening. Closed shoes and socks through the peeling days, then open shoes for everything after. Plan it around your calendar and nobody ever sees the middle part.",
  },
  {
    id: "s3",
    q: "Will it ruin my pedicure or nail polish?",
    a:
      "The peel works on the skin, not your nails, but flakes lifting around the edges can look untidy against fresh polish. The simplest order is: peel first, then paint. Do your pedicure once the peeling has finished and the colour sits on smooth skin.",
  },
  {
    id: "s4",
    q: "My heels are really hard and cracked. Is one enough?",
    a:
      "One treatment makes a big difference to most feet. On heels that have been building callus for years, a second treatment about four weeks later gets you the rest of the way — which is why the 2-pack is our most popular bundle.",
  },
  {
    id: "s5",
    q: "Does it hurt?",
    a:
      "No. There is no cutting, no sanding and no burning. Gentle fruit-derived botanical acids loosen the dead outer layer so it lifts away on its own. Most people feel nothing at all while the booties are on.",
  },
  {
    id: "s6",
    q: "How does delivery work?",
    a:
      "Fast courier delivery, flat $5 within the Harare CBD area. For anywhere else in Zimbabwe, or South Africa, Zambia and beyond, message us on WhatsApp and we'll arrange it with you.",
  },
];

const SAFE_NOTE =
  "Silkpedi is a cosmetic foot peel. Don't use it on open cracks, wounds or infected skin, and if you have diabetes, poor circulation or any foot condition, speak to your doctor first. Not for use during pregnancy or breastfeeding.";

export default function SandalReadyFeet() {
  const { openOrderModal, orderModal } = useOrderFlow(SOURCE_TAG);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>("s1");
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [activePack, setActivePack] = useState<number>(1);

  const bundlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Silkpedi — Feet Worth Showing in Open Shoes";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBundles = () =>
    bundlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const activeDetail = PACK_DETAILS.find((p) => p.id === activePack) || PACK_DETAILS[0];

  return (
    <div className="relative min-h-screen font-sans bg-white selection:bg-purple-brand selection:text-white">
      {/* ── Announcement bar ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-dark via-[#0c312d] to-purple-dark text-white text-[11px] md:text-sm py-2 px-3 md:px-4 shadow-inner relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center md:justify-between items-center space-y-1 sm:space-y-0 text-center">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>✨ SMOOTH HEELS IN 7–10 DAYS — PLAN IT AROUND YOUR NEXT EVENT</span>
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
            className="px-5 md:px-6 py-2.5 text-[11px] md:text-xs font-extrabold tracking-wider text-white uppercase bg-purple-brand rounded-full shadow-md shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            GET SILKPEDI — $25
          </button>
        </div>
      </header>

      {/* ── 1. Hero ────────────────────────────────────────────────────── */}
      {/* The wash here is purple-dark rather than teal-dark: the photo is deep
          plum, and a green-black gradient over it goes muddy. Purple is a
          brand colour too, so this still reads as Silkpedi. */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: WALL }}>
        <div className="hidden lg:block relative">
          {/* `contain`, not `cover`: the photo is composed as a full figure with
              her head, hands and sandals all in frame, so cropping it defeats
              the point. It sits right-aligned and the page background is set to
              the wall colour sampled from the photo itself, so there's no seam. */}
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${HERO_IMAGE_URL})`,
              backgroundSize: "contain",
              backgroundPosition: "right center",
              // Feathers the photo's left edge into the matching background so
              // the skirting board and floor don't start on a hard vertical line.
              maskImage: "linear-gradient(to right, transparent 0%, #000 22%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 22%)",
            }}
          />
          {/* Keeps the headline legible where it runs over the photo */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${WALL} 0%, ${WALL}e6 30%, transparent 60%)`,
            }}
          />
          <div className="relative max-w-7xl mx-auto px-8 py-10 xl:py-12">
            <div className="max-w-xl space-y-5">{heroCopy(scrollToBundles)}</div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="px-5 sm:px-8 py-12 space-y-5" style={{ backgroundColor: WALL }}>
            {heroCopy(scrollToBundles)}
          </div>
          {/* On a narrow screen the full figure would be tiny, so this crops to
              the half that matters: her hands fastening the sandal strap. */}
          <div className="relative h-60 sm:h-80">
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${HERO_IMAGE_URL})`,
                backgroundPosition: "68% center",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-20"
              style={{ background: `linear-gradient(to bottom, ${WALL}, transparent)` }}
            />
          </div>
        </div>
      </section>

      {/* ── Reassurance bar ────────────────────────────────────────────── */}
      <div className="bg-[#092522] border-b border-teal-light/30 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-3 text-center">
          <Sparkles className="w-5 h-5 text-purple-brand shrink-0" />
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
            <span className="font-bold text-white">Salon-smooth heels without the salon.</span>{" "}
            One hour at home, and the rest happens while you get on with your week.
          </p>
        </div>
      </div>

      {/* ── 2. The moment ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
            YOU KNOW THE FEELING
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark leading-tight">
            The dress is right. The shoes are perfect.
            <br />
            <span className="italic text-purple-brand">Then you look down.</span>
          </h2>
          <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Open shoes show everything. Rough heels, dry edges, hard skin that no amount of
            cream seems to shift — and suddenly you're thinking about your feet instead of
            enjoying your evening.
          </p>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            It isn't that you don't look after yourself. It's that heels build callus faster
            than moisturiser can soften it, and the only real fix is taking the dead layer off.
          </p>
          <div className="bg-purple-light border border-purple-brand/15 rounded-[2rem] p-8 md:p-10 mt-4">
            <p className="font-serif text-xl md:text-3xl text-teal-dark leading-relaxed">
              You shouldn't have to think about your feet at all.
              <br />
              <span className="italic text-purple-brand">That's the whole point.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Count back from your event ──────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-purple-brand/10 w-96 h-96 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              TIMING MATTERS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
              Count back from your event.
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Silkpedi isn't an overnight fix — it works with your skin's own cycle over about a
              week and a half. Get the timing right and you'll walk into your event with feet
              you don't have to think about.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIMELINE.map((t, i) => (
              <div
                key={t.day}
                className="bg-[#092522] border border-teal-light/40 rounded-[1.75rem] p-7 space-y-3 shadow-xl relative"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-brand flex items-center justify-center font-black shadow-md shrink-0">
                    {i + 1}
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-teal-bright">
                    {t.day}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold">{t.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>

          {/* The urgency line — true, and the reason to order today */}
          <div className="bg-purple-brand/15 border-2 border-purple-brand rounded-[2rem] p-7 md:p-9 max-w-3xl mx-auto text-center space-y-4">
            <CalendarDays className="w-8 h-8 text-purple-brand mx-auto" />
            <p className="font-serif text-xl md:text-2xl leading-relaxed">
              So: give yourself <span className="italic text-purple-brand">at least ten days</span>{" "}
              before the day you want to be sandal-ready.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Wedding next month? You're in good time. Something this weekend? Order now and time
              it for the next one — you'll be glad you didn't rush it.
            </p>
            <button
              onClick={scrollToBundles}
              className="px-9 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              START THE CLOCK — FROM $25
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. What's in the pack ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-purple-light">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-teal-dark text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              WHAT YOU GET
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">
              Everything the salon uses, at home
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-brand/10 rounded-[2.5rem] blur-2xl" />
              <img
                src={PACK_IMAGE_URL}
                alt="The Silkpedi exfoliating foot peel pack"
                className="relative w-full rounded-[2rem] shadow-2xl object-cover"
              />
              <div className="relative mt-5 bg-white border border-purple-brand/15 rounded-2xl p-5 shadow-lg">
                <p className="text-[10px] font-bold tracking-widest uppercase text-purple-brand mb-1.5">
                  {activeDetail.name}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{activeDetail.howItWorks}</p>
              </div>
            </div>

            <div className="space-y-3">
              {PACK_DETAILS.map((item) => {
                const isActive = activePack === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePack(item.id)}
                    className={`w-full text-left rounded-2xl p-5 border transition-all cursor-pointer ${
                      isActive
                        ? "bg-white border-purple-brand shadow-lg"
                        : "bg-white/50 border-purple-brand/15 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <span
                        className={`font-mono text-xs font-black shrink-0 mt-0.5 ${
                          isActive ? "text-purple-brand" : "text-gray-400"
                        }`}
                      >
                        0{item.id}
                      </span>
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold text-teal-dark">{item.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Bundles ─────────────────────────────────────────────────── */}
      <section
        ref={bundlesRef}
        className="py-14 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative"
        id="bundle-select-section"
      >
        <div className="absolute top-0 right-0 bg-purple-brand/10 w-96 h-96 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              GET SILKPEDI FOR YOUR FEET
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              Choose Your Bundle
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-300 text-sm md:text-base">
              Hard skin starts rebuilding after about four to six weeks — so most people keep a
              second treatment on hand for the next occasion rather than starting from scratch.
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
                    🔥 BUY 2 FOR $45 (MOST POPULAR)
                  </div>
                )}
                {bundle.bestValue && (
                  <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-teal-bright text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    💎 BUY 3 FOR $70 (BEST VALUE)
                  </div>
                )}
                {!bundle.popular && !bundle.bestValue && (
                  <div className="absolute -top-3.5 md:-top-4.5 left-1/2 -translate-x-1/2 bg-teal-light text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 md:px-5 py-1.5 rounded-full shadow-sm border border-teal-bright/35 whitespace-nowrap">
                    SINGLE PACK
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center space-y-2 pt-2">
                    <h3 className="font-serif text-2xl font-bold">{bundle.name}</h3>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        bundle.popular ? "text-purple-brand" : "text-teal-bright"
                      }`}
                    >
                      {bundle.tagline}
                    </p>
                  </div>

                  <div
                    className={`text-center py-5 rounded-2xl border ${
                      bundle.popular
                        ? "bg-purple-light border-purple-brand/10"
                        : "bg-teal-dark/30 border-teal-light/20"
                    }`}
                  >
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-5xl font-black tracking-tight">${bundle.price}</span>
                      {bundle.originalPrice > bundle.price && (
                        <span className="text-lg line-through text-gray-400 font-bold">
                          ${bundle.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono font-bold uppercase mt-1 tracking-widest">
                      {bundle.description}
                    </p>
                  </div>

                  {bundle.savings > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl p-3 text-center text-xs font-black">
                      🎉 INSTANT SAVINGS: ${bundle.savings}
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      WHAT'S IN THE KIT:
                    </p>
                    {bundle.itemsIncluded.map((itemStr, i) => (
                      <div key={i} className="flex items-start space-x-2.5 text-xs font-medium">
                        <Check className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className={bundle.popular ? "text-gray-600" : "text-gray-200"}>
                          {itemStr}
                        </span>
                      </div>
                    ))}
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
                    GET SILKPEDI
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
              REAL PEDICURE RESULTS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark">
              What our clients say
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
                <div className="flex items-center justify-between pt-2 border-t border-purple-brand/10">
                  <div className="flex items-center space-x-3">
                    <img src={review.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold text-teal-dark">{review.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        Happy Client
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setLikes((p) => ({ ...p, [review.id]: (p[review.id] || 0) + 1 }))
                    }
                    className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-purple-brand transition-colors cursor-pointer"
                    aria-label="Mark as helpful"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{review.helpfulCount + (likes[review.id] || 0)}</span>
                  </button>
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
              THE QUESTIONS WE GET MOST
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
                  {isOpen && (
                    <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  )}
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
      <section className="py-16 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-purple-brand/15 w-[36rem] h-[36rem] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <Sparkles className="w-8 h-8 text-purple-brand mx-auto" />
          <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Wear the open shoes.
            <br />
            <span className="italic text-purple-brand">Stop thinking about your feet.</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            One hour at home, about ten days, and heels smooth enough that the sandals become the
            easy choice again.
          </p>
          <button
            onClick={scrollToBundles}
            className="px-10 py-4.5 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            GET SILKPEDI — FROM $25
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
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-brand flex items-center justify-center">
                <span className="font-serif font-black text-white text-base">S</span>
              </div>
              <span className="font-serif text-xl tracking-wide font-black">silkpedi</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Silkpedi gives you spa-grade at-home peeling, the easy way. Balanced botanical AHAs
              gently lift difficult calluses to reveal soft, smooth feet — suitable for every skin
              type.
            </p>
            <div className="space-y-1.5 bg-[#0f3531] p-3.5 rounded-xl border border-teal-light/30 w-fit">
              <p className="text-[10px] font-bold text-teal-bright tracking-widest uppercase">
                WhatsApp or Call Us
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono font-bold text-white flex items-center mt-1 hover:text-purple-light transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5 text-purple-brand" /> {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <div className="space-y-3 md:text-right">
            <h4 className="text-xs font-bold tracking-widest text-purple-brand uppercase">
              EXPERIENCE SHOP
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400 md:items-end">
              {PRODUCT_BUNDLES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openOrderModal(b)}
                  className="hover:text-white transition-colors cursor-pointer text-left md:text-right"
                >
                  {b.name} (${b.price})
                </button>
              ))}
              <a href="/" className="hover:text-white transition-colors pt-2">
                Back to silkpedi.com
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-teal-light/20 mt-10 pt-6 text-xs text-gray-500 text-center">
          <p>© 2026 SilkPedi Inc. All rights reserved.</p>
        </div>
      </footer>

      {orderModal}
    </div>
  );
}

/** Hero copy, shared by the desktop overlay and the mobile stacked layout. */
function heroCopy(onCta: () => void) {
  return (
    <>
      <div className="inline-flex items-center space-x-2 bg-teal-light/40 border border-teal-bright/30 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-purple-light tracking-wide w-fit shadow-md backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-purple-brand shrink-0" />
        <span>FOR SANDALS, MULES AND EVERY STRAPPY HEEL YOU OWN</span>
      </div>

      <div className="space-y-3">
        <h1 className="font-serif text-[2.25rem] sm:text-4xl md:text-5xl xl:text-[3.75rem] font-medium tracking-tight leading-[1.05] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
          Your outfit is finished. <br />
          <span className="font-serif italic text-purple-brand">Your feet should be too.</span>
        </h1>
        <p className="font-sans text-[11px] md:text-xs font-bold text-purple-light tracking-widest uppercase">
          SMOOTH HEELS IN 7–10 DAYS • NO SALON • NO SCRAPING
        </p>
      </div>

      <p className="text-gray-100 text-sm md:text-base max-w-xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        Open shoes show everything — and cream alone was never going to shift hard, built-up
        callus. Silkpedi lifts the whole dead layer away instead: one hour on the couch, and
        about ten days later your heels are smooth enough to stop thinking about.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 max-w-lg pt-1">
        <button
          onClick={onCta}
          className="w-full sm:w-auto px-7 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all duration-300 transform hover:-translate-y-1 text-center cursor-pointer"
        >
          GET SILKPEDI — $25
        </button>

        <div className="flex flex-col text-left text-[11px] text-gray-200">
          <span className="font-bold text-white">🥇 DELIVERED ACROSS SOUTHERN AFRICA</span>
          <span>Pain-free. No blades. Order in one WhatsApp message.</span>
        </div>
      </div>
    </>
  );
}
