/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The free "Silkpedi Soft Feet Guide" — the bonus promised in the discount
 * pop-up and on every bundle card.
 *
 * Every fact here is taken from what the site already says elsewhere (FAQ,
 * pack details, thank-you tips). If the product timings or instructions change,
 * change them here too. No medical claims: the safety note stays.
 */

import React, { useEffect } from "react";
import { Check, X, Info, Printer, MessageCircle, Phone, Sparkles } from "lucide-react";
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";

const BEFORE = [
  "Pick your week. Peeling runs from about Day 3 to Day 10, so start at least ten days before any event where you want smooth feet.",
  "Keep closed shoes and socks handy for the peeling days, roughly Day 3 to Day 6.",
  "Planning a pedicure? Peel first, paint afterwards, so the colour sits on smooth skin.",
  "Read the instructions in your pack before you begin. They're the final word on your kit.",
];

const DAYS = [
  {
    day: "DAY 1",
    title: "Treatment day",
    body: "Put the booties on and relax for about an hour. Take them off, rinse your feet with warm water and dry them. Use the soothing wipe to calm and cleanse the fresh skin. Nothing shows yet, so carry on with your day.",
  },
  {
    day: "DAY 2",
    title: "Start soaking",
    body: "Soak your feet in warm water for 15–20 minutes a day from today. It's the single biggest thing you can do: it makes the peeling faster, more even and far more satisfying.",
  },
  {
    day: "DAYS 3–4",
    title: "The peeling begins",
    body: "Most people see the first flakes around now. Keep soaking daily and wear socks around the house to keep things tidy. Let the skin lift on its own.",
  },
  {
    day: "DAYS 5–8",
    title: "Peak peeling",
    body: "This is the busiest stretch. If you have the foot file (2 and 3-pack), run it gently over the loose edges after a soak to clear flakes that are already lifting. Never force skin that's still attached.",
  },
  {
    day: "DAYS 7–10",
    title: "Soft, smooth feet",
    body: "The last flakes are gone and the new skin underneath is soft and even. Time to bring the open shoes back out.",
  },
];

const KEEP_SOFT = [
  {
    title: "Moisturise every day",
    body: "New skin dries out if you ignore it. A rich foot cream each night keeps it soft and stops the hard skin building back up.",
  },
  {
    title: "Socks overnight",
    body: "Cream on, soft socks on, then bed. Covering your feet overnight helps the cream soak in instead of rubbing off on the sheets.",
  },
  {
    title: "Repeat every 4–6 weeks",
    body: "That matches the skin's natural renewal cycle and stops calluses reforming. Very hard, cracked heels often need a second treatment about four weeks after the first.",
  },
];

const DOS = [
  "Soak daily from Day 2",
  "Wear socks while peeling",
  "Moisturise once peeling finishes",
  "Let the skin come away naturally",
];

const DONTS = [
  "Pull or peel skin off by hand",
  "Use it on open cracks, cuts or sores",
  "Scrub hard with a pumice or rasp",
  "Paint your nails mid-peel",
];

export default function SoftFeetGuide() {
  useEffect(() => {
    document.title = "The Silkpedi Soft Feet Guide";
  }, []);

  const waHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Hello, I have a question about my Silkpedi treatment."
  )}`;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-brand selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-teal-dark text-white py-5 px-4 md:px-8 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2.5">
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
          </a>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center space-x-2 text-xs font-bold text-purple-light hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / save as PDF</span>
          </button>
        </div>
      </header>

      {/* Title */}
      <section className="bg-teal-dark text-white px-4 md:px-8 pb-14 md:pb-16 pt-4 relative overflow-hidden print:bg-white print:text-teal-dark">
        <div className="absolute -top-10 right-0 bg-purple-brand/15 w-96 h-96 rounded-full blur-3xl print:hidden" />
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <span className="inline-block bg-purple-brand text-white font-mono text-xs uppercase px-3.5 py-1 rounded-full tracking-widest font-bold">
            Your free member bonus
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            The Silkpedi
            <br />
            <span className="italic text-purple-brand">Soft Feet Guide</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto print:text-gray-600">
            Everything you need to get the smoothest possible result from your treatment, day by day,
            and to keep your feet soft for weeks afterwards.
          </p>
        </div>
      </section>

      <main className="px-4 md:px-8 py-14 md:py-16 flex-1">
        <div className="max-w-3xl mx-auto space-y-14">
          {/* Before you start */}
          <section className="space-y-5">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-teal-dark">Before you start</h2>
            <div className="space-y-3">
              {BEFORE.map((tip) => (
                <div key={tip} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Day by day */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-teal-dark">Day by day</h2>
            <ol className="relative border-l-2 border-purple-brand/25 ml-3 space-y-8">
              {DAYS.map((d) => (
                <li key={d.day} className="pl-7 relative">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-brand border-4 border-white" />
                  <p className="font-mono text-xs font-black text-purple-brand tracking-widest">{d.day}</p>
                  <h3 className="font-serif text-lg font-bold text-teal-dark mt-1">{d.title}</h3>
                  <p className="text-gray-600 leading-relaxed mt-1.5">{d.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Do / don't */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
              <h3 className="font-serif text-lg font-bold text-teal-dark">Do</h3>
              {DOS.map((t) => (
                <div key={t} className="flex items-start space-x-2.5 text-sm text-gray-700">
                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3">
              <h3 className="font-serif text-lg font-bold text-teal-dark">Don't</h3>
              {DONTS.map((t) => (
                <div key={t} className="flex items-start space-x-2.5 text-sm text-gray-700">
                  <X className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Keep them soft */}
          <section className="space-y-5">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-teal-dark">Keeping them soft</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {KEEP_SOFT.map((k) => (
                <div key={k.title} className="bg-purple-light/50 border border-purple-brand/15 rounded-2xl p-5 space-y-2">
                  <Sparkles className="w-5 h-5 text-purple-brand" />
                  <h3 className="font-serif font-bold text-teal-dark">{k.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{k.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Safety */}
          <div className="bg-purple-light border-l-4 border-purple-brand rounded-xl p-5 flex items-start space-x-3">
            <Info className="w-5 h-5 text-purple-brand shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-teal-dark">Please note:</span> Silkpedi is a cosmetic foot
              peel, not a medical treatment. Don't use it on open cracks, wounds or infected skin, and if
              you have diabetes, poor circulation or any foot condition, speak to your doctor first. Not for
              use during pregnancy or breastfeeding.
            </p>
          </div>

          {/* Questions / shop */}
          <div className="bg-teal-dark text-white rounded-[2rem] p-8 md:p-10 text-center space-y-5 print:hidden">
            <h3 className="font-serif text-xl md:text-3xl font-semibold leading-snug">Questions mid-peel?</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              A real person answers on WhatsApp. Send us a message any time during your treatment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message us</span>
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white text-sm font-extrabold tracking-wider uppercase rounded-xl hover:bg-white/10 transition-all"
              >
                Shop Silkpedi
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#061a18] text-white py-10 px-4 md:px-8 border-t border-teal-light/25 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span className="font-serif text-xl tracking-wide font-black">silkpedi</span>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono font-bold text-white flex items-center hover:text-purple-light transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5 text-purple-brand" /> {WHATSAPP_DISPLAY}
          </a>
        </div>
        <p className="max-w-4xl mx-auto text-center text-[11px] text-gray-600 mt-6">
          © 2026 SilkPedi Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
