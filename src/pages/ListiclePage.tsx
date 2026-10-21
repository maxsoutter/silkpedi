/**
 * Listicle pre-lander. One layout, content from ./listicles.ts.
 *
 * Reads like an article, not a shop: narrow column, numbered signs, one
 * argument the whole way down. There is no menu and no price on purpose; every
 * button goes to the matching sales page, which does the selling.
 * The page is kept out of search results (noindex) because it only exists for ads.
 */
import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowDown, ChevronDown, Info, Sparkles, FlaskConical, Lightbulb } from "lucide-react";
import { LegalLinks } from "./PolicyLayout";
import type { Listicle } from "./listicles";
import packImage from "../assets/images/silkpedi_real_pack.webp";

const SAFE_NOTE =
  "Silkpedi is a cosmetic foot peel, not a medical treatment. Don't use it on open cracks, wounds or infected skin, and if you have diabetes, poor circulation or any foot condition, speak to your doctor first. Not for use during pregnancy or breastfeeding.";

function CtaButton({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/25 hover:bg-opacity-95 transition-all transform hover:-translate-y-0.5 ${className}`}
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

export default function ListiclePage({ content: c }: { content: Listicle }) {
  const [showBar, setShowBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = c.docTitle;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    // Phone-only buy bar, once they're past the opening.
    const onScroll = () => setShowBar(window.scrollY > window.innerHeight * 1.2);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      robots.remove();
    };
  }, [c.docTitle]);

  return (
    <div className="min-h-screen font-sans bg-white text-[#1a1a1a] selection:bg-purple-brand selection:text-white">
      {/* ── Brand bar: logo only, no links out ─────────────────────────── */}
      <header className="bg-teal-dark text-white py-4">
        <div className="max-w-3xl mx-auto px-5 flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-brand to-teal-bright flex items-center justify-center shadow-lg">
            <span className="font-serif font-black text-white text-lg">S</span>
          </div>
          <span className="font-serif text-xl tracking-wide font-black bg-gradient-to-r from-purple-light via-white to-purple-brand bg-clip-text text-transparent">
            silkpedi
          </span>
        </div>
      </header>

      <article>
        {/* ── Hook ─────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-5 pt-10 md:pt-14 space-y-5">
          <p className="text-xs font-extrabold tracking-widest uppercase text-teal-bright">{c.kicker}</p>
          <h1 className="font-serif text-[2.1rem] leading-[1.12] md:text-5xl md:leading-[1.08] font-semibold tracking-tight text-teal-dark">
            {c.headline} <span className="italic text-[#7050b4]">{c.headlineAccent}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{c.dek}</p>
          <p className="text-xs text-gray-400 font-semibold">By the Silkpedi team</p>
        </div>

        <div className="max-w-3xl mx-auto px-5 mt-7">
          <img
            src={c.heroImage}
            alt={c.heroAlt}
            className="w-full aspect-[16/9] object-cover rounded-[1.5rem] shadow-lg"
          />
        </div>

        <div className="max-w-2xl mx-auto px-5 mt-8 space-y-5 text-[17px] leading-relaxed text-gray-700">
          {c.intro.map((t, i) => (
            <p key={i} className={i === 1 ? "font-serif text-xl text-teal-dark italic" : ""}>
              {t}
            </p>
          ))}
        </div>

        {/* ── The signs ────────────────────────────────────────────────── */}
        <ol className="max-w-2xl mx-auto px-5 mt-12 space-y-14">
          {c.items.map((item, i) => (
            <li key={i} className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-11 h-11 rounded-full bg-teal-bright text-white font-serif text-xl font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <h2 className="font-serif text-2xl md:text-[1.75rem] leading-snug font-semibold text-teal-dark pt-1">
                  {item.title}
                </h2>
              </div>
              {item.body.map((t, j) => (
                <p key={j} className="text-[17px] leading-relaxed text-gray-700">
                  {t}
                </p>
              ))}
              <p className="bg-purple-light border-l-4 border-purple-brand rounded-r-xl px-5 py-4 font-bold text-teal-dark text-[17px] leading-snug">
                {item.key}
              </p>
            </li>
          ))}
        </ol>

        {/* ── Mid-page check-in ────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-5 mt-14">
          <div className="rounded-[1.75rem] border-2 border-purple-brand/30 bg-gradient-to-br from-purple-light to-white p-7 md:p-9 text-center space-y-4">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-teal-dark">{c.midCta.title}</h3>
            <p className="text-gray-600 leading-relaxed">{c.midCta.body}</p>
            <CtaButton href={c.ctaHref} label={c.ctaLabel} />
            <a href="#bridge" className="flex items-center justify-center gap-1.5 text-sm font-bold text-teal-bright hover:text-teal-dark">
              Or keep reading <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── The bridge: why the usual fixes fall short ───────────────── */}
        <section id="bridge" className="mt-16 bg-teal-dark text-white py-14 md:py-20 relative overflow-hidden scroll-mt-4">
          <div className="absolute -top-24 -right-24 bg-purple-brand/20 w-96 h-96 rounded-full blur-3xl" />
          <div className="relative max-w-2xl mx-auto px-5 space-y-5">
            <p className="text-xs font-extrabold tracking-widest uppercase text-purple-brand">{c.bridge.kicker}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold leading-tight">{c.bridge.title}</h2>
            {c.bridge.paras.map((t, i) => (
              <p key={i} className="text-[17px] leading-relaxed text-gray-200">
                {t}
              </p>
            ))}
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-white border-l-4 border-purple-brand pl-5 pt-2">
              {c.bridge.pull}
            </p>
          </div>
        </section>

        {/* ── The solution: benefit first, then what's in it ───────────── */}
        <section className="max-w-2xl mx-auto px-5 py-14 md:py-20 space-y-7">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold leading-tight text-teal-dark">{c.solution.title}</h2>
          {c.solution.intro.map((t, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-gray-700">
              {t}
            </p>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6 items-center">
            <img
              src={packImage}
              alt="The teal Silkpedi exfoliating foot peel pouch"
              className="w-full max-w-[260px] mx-auto rounded-2xl shadow-lg"
            />
            <ol className="space-y-4">
              {c.solution.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-purple-brand text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-teal-dark">{s.title}.</span> {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-[#f3f8f7] border border-teal-bright/20 rounded-2xl p-6 space-y-3">
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-teal-bright">
              <FlaskConical className="w-4 h-4" /> What's inside
            </p>
            {c.solution.inside.map((t, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">
                {t}
              </p>
            ))}
          </div>

          <p className="flex gap-3 bg-purple-light border-l-4 border-purple-brand rounded-r-xl px-5 py-4 font-bold text-teal-dark text-[17px] leading-snug">
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-[#7050b4]" />
            {c.solution.insight}
          </p>
          <p className="text-gray-600 leading-relaxed">{c.solution.upkeep}</p>

          {c.aside && (
            <div className="border border-gray-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-serif text-xl font-semibold text-teal-dark">{c.aside.title}</h3>
              <p className="text-gray-600 leading-relaxed">{c.aside.body}</p>
            </div>
          )}
        </section>

        {/* ── What to expect, honestly ─────────────────────────────────── */}
        <section className="bg-purple-light py-14 md:py-16">
          <div className="max-w-2xl mx-auto px-5 space-y-7">
            <h2 className="font-serif text-3xl font-semibold text-teal-dark">What to expect</h2>
            <ol className="space-y-5">
              {c.expect.map((e, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="shrink-0 w-[5.5rem] text-center bg-[#7050b4] text-white text-[11px] font-extrabold tracking-wider rounded-lg py-1.5 mt-0.5">
                    {e.day}
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-serif text-lg font-semibold text-teal-dark block">{e.title}</span>
                    {e.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Real customer reviews go here once there are some (never invented ones). */}

        {/* ── Questions ────────────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-5 py-14 md:py-16 space-y-6">
          <h2 className="font-serif text-3xl font-semibold text-teal-dark">Common questions</h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {c.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left font-bold text-teal-dark cursor-pointer"
                    aria-expanded={open}
                  >
                    {f.q}
                    <ChevronDown className={`w-5 h-5 shrink-0 text-[#7050b4] transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="pb-5 text-gray-600 leading-relaxed">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </article>

      {/* ── Close the argument, then one way forward ───────────────────── */}
      <section className="bg-teal-dark text-white py-16 md:py-20 px-5 relative overflow-hidden">
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 bg-purple-brand/15 w-[34rem] h-[34rem] rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <Sparkles className="w-8 h-8 text-purple-brand mx-auto" />
          <h2 className="font-serif text-3xl md:text-[2.75rem] font-semibold leading-tight">
            {c.closing.title}
            <br />
            <span className="italic text-purple-brand">{c.closing.accent}</span>
          </h2>
          <p className="text-gray-300 text-[17px] leading-relaxed">{c.closing.body}</p>
          <CtaButton href={c.ctaHref} label={c.ctaLabel} />
          <p className="text-gray-400 text-xs">Order in one WhatsApp message. Delivered across Southern Africa.</p>
        </div>
      </section>

      <footer className="bg-[#061a18] text-gray-500 text-xs px-5 pt-8 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto space-y-5 text-center">
          <p className="flex items-start gap-2 text-left text-gray-400 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-brand" />
            {SAFE_NOTE}
          </p>
          <LegalLinks />
          <p>© 2026 Silkpedi. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Phone buy bar ──────────────────────────────────────────────── */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-teal-dark/95 backdrop-blur-md border-t border-teal-light/30 px-4 py-3 transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <CtaButton href={c.ctaHref} label={c.ctaLabel} className="w-full py-3.5" />
      </div>
    </div>
  );
}
