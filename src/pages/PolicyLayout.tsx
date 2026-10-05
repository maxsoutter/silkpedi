/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { Phone } from "lucide-react";
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";

/** Footer links to the policy pages. Every page's footer uses this. */
export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-x-6 gap-y-2 ${className}`}>
      <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
      <a href="/delivery-returns" className="hover:text-white transition-colors">Delivery &amp; Returns</a>
    </div>
  );
}

/** One section of a policy page: a heading and its paragraphs / lists. */
export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl md:text-2xl font-semibold text-teal-dark">{title}</h2>
      <div className="space-y-3 text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-teal-dark">
        {children}
      </div>
    </section>
  );
}

/**
 * Plain layout for the privacy and delivery/returns pages: brand header,
 * title band, readable single column, footer. No pop-up (see main.tsx).
 */
export default function PolicyLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} — Silkpedi`;
  }, [title]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-brand selection:text-white flex flex-col">
      <header className="bg-teal-dark text-white py-5 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <a href="/" className="inline-flex items-center space-x-2.5">
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
        </div>
      </header>

      <section className="bg-teal-dark text-white px-4 md:px-8 pb-12 pt-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
          <p className="text-gray-300 leading-relaxed">{intro}</p>
          <p className="text-xs font-mono text-purple-light">Last updated: {updated}</p>
        </div>
      </section>

      <main className="px-4 md:px-8 py-12 md:py-14 flex-1">
        <div className="max-w-3xl mx-auto space-y-10">{children}</div>
      </main>

      <footer className="bg-[#061a18] text-white py-10 px-4 md:px-8 border-t border-teal-light/25">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <a href="/" className="font-serif text-xl tracking-wide font-black">silkpedi</a>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono font-bold text-white flex items-center hover:text-purple-light transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5 text-purple-brand" /> {WHATSAPP_DISPLAY}
          </a>
        </div>
        <div className="max-w-3xl mx-auto mt-6 text-[11px] text-gray-500 space-y-3 text-center">
          <LegalLinks />
          <p>© 2026 Silkpedi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
