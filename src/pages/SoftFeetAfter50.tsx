/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Facebook-ads landing page for the "older customer" avatar.
 *
 * Deliberately different from the homepage in ONE way only: the messaging.
 * Colours, type, packages, order flow and footer are the same brand system,
 * so a visitor who lands here and later visits silkpedi.com sees one company.
 *
 * Two rules this page is written to, on purpose:
 *   1. No medical claims. Cracked heels genuinely become more common with age,
 *      and that is said plainly — but Silkpedi is never presented as treating,
 *      preventing or healing infection, diabetes or any condition. The promise
 *      stays on comfort, ease and dignity, which is what the product delivers.
 *   2. No invented social proof. The testimonials are the same real reviews
 *      used on the homepage.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Check,
  Truck,
  ShieldCheck,
  Lock,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Phone,
  Armchair,
  HandHeart,
  Footprints,
  Info,
} from "lucide-react";
import { PRODUCT_BUNDLES, INITIAL_REVIEWS } from "../data";
import { useOrderFlow, WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";
import heroImage from "../assets/images/silkpedi_hero_50plus.webp";
import packImage from "../assets/images/silkpedi_pack_1779850178423.webp";

/**
 * Hero visual: an older couple at home mid-treatment. Framed with the couple
 * in the right two-thirds and clear space on the left, so the dark wash and
 * headline sit over the empty side without covering their faces.
 */
const HERO_IMAGE_URL = heroImage;
const PACK_IMAGE_URL = packImage;

/** Tags leads from this page in the Netlify inbox, so ad spend can be attributed. */
const SOURCE_TAG = "50+ LP";

/** Why feet change — stated as plain fact, not as a condition Silkpedi treats. */
const WHAT_CHANGES = [
  {
    icon: "dry",
    title: "The skin gets drier",
    body:
      "Skin holds less moisture as the years go on. Heels that used to bounce back now stay hard and dry no matter how much cream you put on at night.",
  },
  {
    icon: "callus",
    title: "The hard skin builds faster",
    body:
      "Decades of standing, walking and working shoes leave thick callus. It builds up quicker than it wears away — and once it splits, every step reminds you it's there.",
  },
  {
    icon: "reach",
    title: "Your feet got further away",
    body:
      "Bending over the bath with a pumice stone isn't the easy job it used to be. Stiff hips, sore backs and poor balance turn a five-minute chore into something you keep putting off.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Sit down",
    body: "Put the booties on in your chair. No bending, no bath, no balancing on one leg.",
  },
  {
    n: 2,
    title: "Relax for an hour",
    body: "Have your tea, watch your programme. That's the whole treatment — one hour, once.",
  },
  {
    n: 3,
    title: "Let it work",
    body: "Over the next few days the old hard skin loosens on its own and lifts away in the shower.",
  },
  {
    n: 4,
    title: "Soft feet again",
    body: "Underneath is the smooth skin that's been buried under callus for years.",
  },
];

const PAGE_FAQS = [
  {
    id: "f1",
    q: "Is it too strong for older, thinner skin?",
    a:
      "No. Silkpedi doesn't cut, sand or burn anything. It uses gentle fruit-derived botanical acids (AHAs) that loosen the bond holding the dead outer layer in place, so it lifts away naturally. There is no pain and no heat — most people feel nothing at all while the booties are on.",
  },
  {
    id: "f2",
    q: "I have diabetes or poor circulation. Can I use it?",
    a:
      "Please check with your doctor or clinic first, and don't use Silkpedi on feet with open cracks, wounds, sores or any active infection. We'd rather you asked and used it safely than took a chance. If you're unsure, message us on WhatsApp and we'll talk it through with you honestly.",
  },
  {
    id: "f3",
    q: "Do I have to bend down or scrub?",
    a:
      "Not for the treatment itself. You put the booties on sitting down, and the peel does the work. The foot file in the 2 and 3-pack bundles is optional — it just tidies up loose flakes if you want to speed the last day or two along.",
  },
  {
    id: "f4",
    q: "How long before I see anything happen?",
    a:
      "Most people see peeling start on Day 3 or 4, and it's usually finished by Day 7 to 10. Soaking your feet in warm water for 15–20 minutes a day from Day 2 makes it happen faster.",
  },
  {
    id: "f5",
    q: "Will it be messy around the house?",
    a:
      "The skin comes away in flakes, so wearing socks around the house during the peeling days keeps things tidy — and do most of the loosening in the shower or a basin.",
  },
  {
    id: "f6",
    q: "How does delivery work?",
    a:
      "Fast courier delivery, flat $5 within the Harare CBD area. For anywhere else in Zimbabwe, or South Africa, Zambia and beyond, message us on WhatsApp and we'll arrange it with you.",
  },
];

export default function SoftFeetAfter50() {
  const { openOrderModal, orderModal } = useOrderFlow(SOURCE_TAG);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>("f1");
  const [likes, setLikes] = useState<Record<string, number>>({});

  const bundlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Silkpedi — Soft Feet Again, Without Bending or Scraping";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBundles = () =>
    bundlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const changeIcon = (kind: string) => {
    if (kind === "dry") return <Footprints className="w-6 h-6" />;
    if (kind === "callus") return <Info className="w-6 h-6" />;
    return <Armchair className="w-6 h-6" />;
  };

  return (
    <div className="relative min-h-screen font-sans bg-white selection:bg-purple-brand selection:text-white">
      {/* ── Announcement bar ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-dark via-[#0c312d] to-purple-dark text-white text-[11px] md:text-sm py-2 px-3 md:px-4 shadow-inner relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center md:justify-between items-center space-y-1 sm:space-y-0 text-center">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>⚡ NO BENDING • NO SCRAPING • NO PUMICE STONE</span>
          </div>
          <span className="hidden md:inline bg-purple-brand/30 text-purple-light text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
            ZIMBABWE • SOUTH AFRICA • ZAMBIA & BEYOND
          </span>
        </div>
      </div>

      {/* ── Header — deliberately no nav links. This is an ad landing page;
              the only way out is the buy button. ─────────────────────────── */}
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
            id="cta-nav-buy"
          >
            GET SILKPEDI — $25
          </button>
        </div>
      </header>

      {/* ── 1. Hero ─────────────────────────────────────────────────────
              Same pattern as the homepage: full-bleed photo with a dark wash
              layered on top of its empty left side, so there's no visible
              seam between a coloured panel and the image. ────────────────── */}
      <section className="relative bg-teal-dark text-white overflow-hidden">
        {/* Desktop: photo bleeds across, copy overlaid on the washed left side */}
        <div className="hidden lg:block relative">
          <div
            className="absolute inset-0 bg-cover bg-[center_right]"
            style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
          />
          {/* Wash fades out before the couple so their faces stay clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-dark via-teal-dark/92 via-40% to-transparent to-70%" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/70 to-transparent" />
          {/* Padding kept tight so the CTA clears the fold on a laptop screen */}
          <div className="relative max-w-7xl mx-auto px-8 py-10 xl:py-12">
            <div className="max-w-xl space-y-5">{heroCopy(scrollToBundles)}</div>
          </div>
        </div>

        {/* Mobile / tablet: copy on solid dark, photo full-width below it */}
        <div className="lg:hidden">
          <div className="px-5 sm:px-8 py-12 space-y-6">{heroCopy(scrollToBundles)}</div>
          <div className="relative h-60 sm:h-80">
            <div
              className="absolute inset-0 bg-cover bg-[center_right]"
              style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
            />
            {/* Soft seam so the dark copy block blends into the photo */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-teal-dark to-transparent" />
          </div>
        </div>
      </section>

      {/* Reassurance bar sitting directly under the hero */}
      <div className="bg-[#092522] border-b border-teal-light/30 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-3 text-center">
          <Armchair className="w-5 h-5 text-purple-brand shrink-0" />
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
            <span className="font-bold text-white">The whole treatment is one hour, seated.</span>{" "}
            Nothing to scrub, nothing sharp, nothing to reach for.
          </p>
        </div>
      </div>

      {/* ── 2. Trust strip ─────────────────────────────────────────────── */}
      <section className="bg-purple-light border-y border-purple-brand/10 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { t: "NOTHING SHARP, EVER", s: "No blades, no scrapers, no razors" },
            { t: "YOU STAY SEATED", s: "The whole treatment happens in your chair" },
            { t: "GENTLE BOTANICAL FORMULA", s: "Fruit-derived AHAs — no burn, no sting" },
          ].map((item) => (
            <div key={item.t} className="space-y-1.5">
              <div className="flex justify-center">
                <ShieldCheck className="w-6 h-6 text-purple-brand" />
              </div>
              <p className="font-bold text-teal-dark text-xs tracking-widest uppercase">{item.t}</p>
              <p className="text-gray-500 text-xs">{item.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Agitation — what actually changes ───────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              IF THIS SOUNDS FAMILIAR
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark leading-tight">
              Your feet didn't get lazy.
              <br />
              <span className="italic text-purple-brand">They got older — like the rest of you.</span>
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-600 text-base leading-relaxed">
              Cracked heels after 50 aren't a sign you've stopped looking after yourself. Three
              things change at once, and creams alone don't fix any of them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHAT_CHANGES.map((item) => (
              <div
                key={item.title}
                className="bg-purple-light/50 border border-purple-brand/15 rounded-[1.75rem] p-7 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-brand text-white flex items-center justify-center shadow-md">
                  {changeIcon(item.icon)}
                </div>
                <h3 className="font-serif text-xl font-bold text-teal-dark">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-teal-dark text-white rounded-[2rem] p-8 md:p-12 text-center max-w-4xl mx-auto space-y-4">
            <p className="text-lg md:text-2xl font-serif leading-relaxed">
              And the honest part nobody says out loud:{" "}
              <span className="italic text-purple-brand">
                hard, split heels hurt to walk on
              </span>
              . You stop wearing the open shoes. You wince getting out of bed. You stop letting
              anyone see your feet.
            </p>
            <p className="text-gray-300 text-sm md:text-base">
              That's not vanity. That's comfort, and you're allowed to want it back.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Mechanism — the "sit down" promise ──────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-purple-brand/10 w-96 h-96 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto space-y-14 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
              HOW SILKPEDI WORKS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
              You sit down. It does the rest.
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              No kneeling over the bath. No sawing at your heels with a metal file. One hour in your
              chair, and the hard skin loosens by itself over the following few days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-[#092522] border border-teal-light/40 rounded-[1.75rem] p-7 space-y-3 shadow-xl"
              >
                <div className="w-11 h-11 rounded-full bg-purple-brand flex items-center justify-center font-black text-lg shadow-md">
                  {s.n}
                </div>
                <h3 className="font-serif text-xl font-bold">{s.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={scrollToBundles}
              className="px-9 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              GET SILKPEDI — FROM $25
            </button>
            <p className="text-gray-400 text-xs mt-3">
              🔒 Pain-free · 💜 Order in one message on WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. The caring angle (ad #1) ────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-purple-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-teal-dark text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold inline-block">
              BUYING FOR SOMEONE ELSE?
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-teal-dark leading-tight">
              The secret to lifelong love —{" "}
              <span className="italic text-purple-brand">taking care of each other.</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Plenty of Silkpedi kits are bought by a husband, a wife, or a daughter who noticed
              somebody wincing on the stairs and didn't want to make a fuss about it.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              It's an easy gift to give, because there's nothing to learn and nothing to be
              embarrassed about. You put the booties on together, sit down for an hour, and a week
              later they're walking comfortably again.
            </p>
            <div className="bg-white border border-purple-brand/15 rounded-2xl p-5 flex items-start space-x-4">
              <HandHeart className="w-6 h-6 text-purple-brand shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-teal-dark">Tip:</span> the 2-pack at $45 is the one
                most couples take — one treatment each, and it works out cheaper than two singles.
              </p>
            </div>
            <button
              onClick={scrollToBundles}
              className="px-8 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-lg shadow-purple-900/30 hover:bg-opacity-95 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              CHOOSE A BUNDLE
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-purple-brand/10 rounded-[2.5rem] blur-2xl" />
            <img
              src={PACK_IMAGE_URL}
              alt="The Silkpedi exfoliating foot peel pack"
              className="relative w-full rounded-[2rem] shadow-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 6. Bundles ─────────────────────────────────────────────────── */}
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
              One treatment lasts about 4–6 weeks before hard skin starts building again — which is
              why most people take two or three.
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

      {/* ── 7. Reviews (the same real reviews as the homepage) ─────────── */}
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
                    <img
                      src={review.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
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

      {/* ── 8. FAQ — written around this avatar's real objections ──────── */}
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
            {PAGE_FAQS.map((item) => {
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

          {/* Honest safety note. Protects the customer and the business. */}
          <div className="bg-white border-l-4 border-purple-brand rounded-xl p-5 flex items-start space-x-3">
            <Info className="w-5 h-5 text-purple-brand shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-teal-dark">Please note:</span> Silkpedi is a cosmetic
              foot peel, not a medical treatment. Don't use it on open cracks, wounds, sores or
              infected skin, and if you have diabetes, poor circulation or any foot condition, speak
              to your doctor first. Not for use during pregnancy or breastfeeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. Closing CTA ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-purple-brand/15 w-[36rem] h-[36rem] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <Sparkles className="w-8 h-8 text-purple-brand mx-auto" />
          <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Your feet have carried you this far.
            <br />
            <span className="italic text-purple-brand">Give them one hour back.</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            One treatment, done sitting in your own chair. Soft, comfortable feet within the week —
            and shoes that stop being something you dread putting on.
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
        <span>FOR FEET THAT HAVE DONE A FEW DECADES OF WALKING</span>
      </div>

      <div className="space-y-3">
        <h1 className="font-serif text-[2.25rem] sm:text-4xl md:text-5xl xl:text-[3.75rem] font-medium tracking-tight leading-[1.05] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
          Soft feet again — <br />
          <span className="font-serif italic text-purple-brand">
            without bending or scraping.
          </span>
        </h1>
        <p className="font-sans text-[11px] md:text-xs font-bold text-purple-light tracking-widest uppercase">
          ONE HOUR IN YOUR CHAIR • NOTHING SHARP • NO SCRUBBING
        </p>
      </div>

      <p className="text-gray-100 text-sm md:text-base max-w-xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        Hard, cracked heels get harder to deal with the older we get — the skin gets drier, the
        callus builds faster, and bending over the bath stops being easy. Silkpedi does the work
        for you: slip on the booties, sit down for an hour, and over the next few days the old
        skin lifts away on its own.
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
