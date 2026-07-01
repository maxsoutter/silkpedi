/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
  X,
  ThumbsUp,
  Heart,
  Droplet,
  Layers,
  Smile,
  Mail,
  CheckCircle,
  Menu,
  Copy,
  Smartphone
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCT_BUNDLES, PACK_DETAILS, INITIAL_REVIEWS, FAQ_ITEMS } from "./data";
import { ProductBundle, Review } from "./types";
import heroBgImage from "./assets/images/silkpedi_hero_bg.webp";
import packImage from "./assets/images/silkpedi_pack_1779850178423.webp";

// Images are imported as ES modules so Vite fingerprints them with content
// hashes at build time — guaranteeing they resolve in production (not just dev).
const HERO_BG_IMAGE_URL = heroBgImage;
const PACK_IMAGE_URL = packImage;

const WHATSAPP_PHONE = "263788860359";
const WHATSAPP_DISPLAY = "+263 78 886 0359";
const BUNDLE_WHATSAPP_MESSAGES: Record<string, string> = {
  "1-pack": "Hello, I'd like to order the Silkpedi 1-Pack treatment ($25).",
  "2-pack": "Hello, I'd like to order the Silkpedi 2-Pack Combo ($45).",
  "3-pack": "Hello, I'd like to order the Silkpedi 3-Pack Absolute Glow bundle ($70).",
};

export default function App() {
  // Navigation & Scroll Tracking
  const [activeTab, setActiveTab] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lead-capture order modal.
  //  - Mobile: Step 1 email (optional) → redirect straight into the WhatsApp app.
  //  - Desktop: Step 1 name + number (required) + email (optional) → Step 2 with a
  //    QR to finish on their phone, an "open on this computer" link, and the number.
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

  // Interactive UI states
  const [activeFaqCategory, setActiveFaqCategory] = useState<"all" | "usage" | "safety" | "shipping">("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");
  const [activePackItem, setActivePackItem] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewContent, setNewReviewContent] = useState("");

  // References for smooth scrolling
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    works: useRef<HTMLDivElement>(null),
    pack: useRef<HTMLDivElement>(null),
    bundles: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null)
  };

  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    setActiveTab(sectionId);
    setIsMobileNavOpen(false);
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ---- Lead-capture order flow ----
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

  const handlePurchase = (bundle: ProductBundle) => openOrderModal(bundle);
  const handleGenericBuy = () => openOrderModal(null);

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
    const bundleName = orderBundle ? orderBundle.name : "Not specified";

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

  // Handle Review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewTitle || !newReviewContent) return;
    const added: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName,
      rating: newReviewRating,
      date: "Today",
      title: newReviewTitle,
      content: newReviewContent,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
      helpfulCount: 0
    };
    setReviews([added, ...reviews]);
    setNewReviewName("");
    setNewReviewTitle("");
    setNewReviewContent("");
    setShowReviewForm(false);
  };

  // Helpful counter for reviews
  const incrementHelpful = (id: string) => {
    setLikesCount(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const getIconComponent = (name: string) => {
    switch (name) {
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Wrench": return <Layers className="w-5 h-5" />;
      case "Layers": return <Layers className="w-5 h-5" />;
      case "Smile": return <Smile className="w-5 h-5" />;
      case "Droplet": return <Droplet className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  // Shared hero copy (eyebrow, headline, description, CTA) — reused by both the
  // desktop overlay layout and the mobile stacked layout so there's one source of truth.
  const heroCopy = (
    <>
      <div className="inline-flex items-center space-x-2 bg-teal-light/40 border border-teal-bright/30 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-purple-light tracking-wide w-fit shadow-md backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-purple-brand animate-spin shrink-0" />
        <span>THE ULTIMATE AT-HOME PEDI FOR SMOOTH FEET</span>
      </div>

      <div className="space-y-3">
        <h1 className="font-serif text-[2.25rem] sm:text-4xl md:text-5xl xl:text-[3.75rem] font-medium tracking-tight leading-[1.05] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
          Silky Smooth <br />
          <span className="font-serif italic text-purple-brand">
            Feet at Home.
          </span>
        </h1>
        <p className="font-sans text-[11px] md:text-xs font-bold text-purple-light tracking-widest uppercase">
          THE AT-HOME PEDICURE, PERFECTED • FOR YOU
        </p>
      </div>

      <p className="text-gray-100 text-sm md:text-base max-w-xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        Skip the scrapers. Silkpedi gently dissolves tough calluses over 3-7 days, revealing baby-soft feet — salon-quality, at home.
      </p>

      {/* Conversion CTA - scrolls to bundles so the customer can pick a pack */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 max-w-lg pt-1">
        <button
          onClick={() => scrollToSection("bundles")}
          className="w-full sm:w-auto px-7 py-4 sm:py-3.5 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/30 hover:bg-opacity-95 transition-all duration-300 transform hover:-translate-y-1 text-center cursor-pointer"
        >
          GET SILKPEDI - $25
        </button>

        <div className="flex flex-col text-left text-[11px] text-gray-200">
          <span className="font-bold text-white flex items-center">
            🥇 PROUDLY SERVING SOUTHERN AFRICA & BEYOND
          </span>
          <span>Premium at-home foot care, suitable for every skin type.</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen font-sans bg-white selection:bg-purple-brand selection:text-white pb-0">
      
      {/* 🚀 Sticky Announcement Bar */}
      <div className="bg-gradient-to-r from-teal-dark via-[#0c312d] to-purple-dark text-white text-[11px] md:text-sm py-2 px-3 md:px-4 shadow-inner relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center md:justify-between items-center space-y-1 sm:space-y-0 text-center">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline">⚡ GENTLE BOTANICAL FORMULA FOR EVERY SKIN TYPE & DEEP CALLUSES</span>
            <span className="sm:hidden">⚡ GENTLE FORMULA FOR EVERY SKIN TYPE</span>
          </div>
          <span className="hidden md:inline bg-purple-brand/30 text-purple-light text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
            ZIMBABWE • SOUTH AFRICA • ZAMBIA & BEYOND
          </span>
        </div>
      </div>

      {/* 🔮 Navigation Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-teal-dark/95 backdrop-blur-md py-3 shadow-xl border-b border-teal-light/20 text-white" 
          : "bg-teal-dark text-white py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            onClick={() => scrollToSection("home")} 
            className="flex items-center space-x-2.5 group focus:outline-none"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-brand to-teal-bright flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
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
          </button>

          {/* Nav Anchors */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <button 
              onClick={() => scrollToSection("works")} 
              className={`hover:text-purple-brand transition-colors cursor-pointer ${activeTab === "works" ? "text-purple-brand font-bold" : "text-gray-300"}`}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection("pack")} 
              className={`hover:text-purple-brand transition-colors cursor-pointer ${activeTab === "pack" ? "text-purple-brand font-bold" : "text-gray-300"}`}
            >
              What's Inside
            </button>
            <button 
              onClick={() => scrollToSection("bundles")} 
              className={`hover:text-purple-brand transition-colors cursor-pointer ${activeTab === "bundles" ? "text-purple-brand font-bold" : "text-gray-300"}`}
            >
              Choose Bundle
            </button>
            <button 
              onClick={() => scrollToSection("reviews")} 
              className={`hover:text-purple-brand transition-colors cursor-pointer ${activeTab === "reviews" ? "text-purple-brand font-bold" : "text-gray-300"}`}
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection("faq")} 
              className={`hover:text-purple-brand transition-colors cursor-pointer ${activeTab === "faq" ? "text-purple-brand font-bold" : "text-gray-300"}`}
            >
              FAQ
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {/* CTA Button - scrolls to bundles so the customer can pick a pack */}
            <button
              onClick={() => scrollToSection("bundles")}
              className="relative hidden md:inline-flex items-center justify-center px-6 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase bg-purple-brand rounded-full overflow-hidden hover:bg-opacity-95 shadow-md shadow-purple-900/30 transition-all duration-300 transform hover:-translate-y-0.5"
              id="cta-nav-buy"
            >
              <span className="relative z-10 flex items-center space-x-1.5">
                <span>GET SILKPEDI - $25</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Mobile-only compact buy button */}
            <button
              onClick={() => scrollToSection("bundles")}
              className="md:hidden px-4 py-2 text-[11px] font-extrabold tracking-wider text-white uppercase bg-purple-brand rounded-full shadow-md shadow-purple-900/30"
              id="cta-nav-buy-mobile"
            >
              GET SILKPEDI
            </button>

            {/* Mobile hamburger - shown only on lg- screens */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2.5 rounded-full bg-teal-medium hover:bg-teal-light border border-teal-light/30 transition-all flex items-center justify-center focus:outline-none"
              aria-label="Open navigation menu"
              id="mobile-nav-toggle"
            >
              <Menu className="w-5 h-5 text-purple-light" />
            </button>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-teal-dark text-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-teal-light/30">
                <span className="font-serif text-lg font-black bg-gradient-to-r from-purple-light via-white to-purple-brand bg-clip-text text-transparent">
                  silkpedi
                </span>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 rounded-full bg-teal-medium hover:bg-teal-light border border-teal-light/30"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 text-purple-light" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {[
                  { id: "home", label: "Home" },
                  { id: "works", label: "How It Works" },
                  { id: "pack", label: "What's Inside" },
                  { id: "bundles", label: "Choose Bundle" },
                  { id: "reviews", label: "Reviews" },
                  { id: "faq", label: "FAQ" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id as keyof typeof sectionRefs)}
                    className={`w-full text-left px-6 py-4 text-base font-semibold border-l-4 transition-colors ${
                      activeTab === item.id
                        ? "border-purple-brand text-white bg-teal-medium/40"
                        : "border-transparent text-gray-300 hover:bg-teal-medium/30 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-5 border-t border-teal-light/30 space-y-3">
                <button
                  onClick={() => scrollToSection("bundles")}
                  className="block w-full py-3.5 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-lg shadow-purple-900/30 text-center"
                >
                  GET SILKPEDI - $25
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello, I'd like to buy a Silkpedi kit")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 border border-teal-light/40 text-white text-xs font-bold tracking-wider uppercase rounded-xl text-center hover:bg-teal-medium/40"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🏛️ 1. Hero Section - Full-bleed image with a teal-dark gradient layered ON TOP of the image's empty left area (no separate section bg, so no edge). */}
      <section
        ref={sectionRefs.home}
        className="relative bg-teal-dark text-white overflow-hidden"
        id="hero-section"
      >
        {/* ===== Desktop / large screens: full-bleed image with a left wash, text overlaid ===== */}
        <div className="hidden lg:flex relative items-center min-h-[600px] h-[calc(100vh-7rem)] max-h-[760px]">
          <img
            src={HERO_BG_IMAGE_URL}
            alt="Silkpedi - Woman in teal robe with Exfoliating Foot Peel product on lavender silk background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Left wash fading to transparent before the woman, so she + the product stay clear */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(8,33,30,0.94) 0%, rgba(8,33,30,0.9) 22%, rgba(8,33,30,0.75) 38%, rgba(8,33,30,0.45) 50%, rgba(8,33,30,0.15) 60%, rgba(8,33,30,0) 70%)",
            }}
          />
          <div className="max-w-7xl mx-auto relative z-10 w-full px-8 py-12">
            <div className="grid grid-cols-12 gap-10 items-center">
              <div className="col-span-6 xl:col-span-5 flex flex-col text-left space-y-5">
                {heroCopy}
              </div>
              <div className="col-span-6 xl:col-span-7" />
            </div>
          </div>
        </div>

        {/* ===== Mobile / tablet: stacked — text on solid dark, then the image in full below (no overlap) ===== */}
        <div className="lg:hidden flex flex-col">
          <div className="px-5 pt-9 pb-8 flex flex-col text-left space-y-4">
            {heroCopy}
          </div>
          <div className="relative">
            <img
              src={HERO_BG_IMAGE_URL}
              alt="Silkpedi - Woman in teal robe with Exfoliating Foot Peel product on lavender silk background"
              className="block w-full aspect-[5/4] object-cover object-right"
              referrerPolicy="no-referrer"
            />
            {/* Soft seam so the dark text block blends into the image */}
            <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-teal-dark to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 🤝 2. Brand Authority Proof Strip */}
      <div className="bg-[#FAF8FE] border-y border-purple-brand/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-y-6 gap-x-12 md:gap-x-16 text-teal-dark">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-purple-brand" />
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-wide">Skin-Safe Formula</p>
              <p className="text-xs text-gray-500 font-medium">Gentle botanical acids, no harsh burn</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-purple-brand fill-current" />
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-wide">100% Vegan & Cruelty-Free</p>
              <p className="text-xs text-gray-500 font-medium">Ethically made soothing botanicals</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Droplet className="w-6 h-6 text-purple-brand" />
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-wide">Suitable For Every Skin Type</p>
              <p className="text-xs text-gray-500 font-medium">Even, glowing finish you can feel</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ 3. How Silkpedi Works Section (With Interactive B&A Slider) */}
      <section 
        ref={sectionRefs.works}
        className="py-14 md:py-24 px-4 md:px-8 bg-white text-teal-dark border-b border-purple-brand/5"
        id="how-it-works-section"
      >
        <div className="max-w-7xl mx-auto text-center space-y-10 md:space-y-16">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-brand uppercase">
              REVEAL SOFTNESS IN 4 SIMPLE STEPS
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              How Silkpedi Works
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-500 text-base md:text-lg">
              Four gentle, easy phases to break down old skin bonds and nourish the gorgeous, baby-soft layer underneath. <strong>No physical pain, no scary metal scrapers.</strong>
            </p>
          </div>

          {/* Steps Display */}
          <div className="relative">
            {/* Background design connector line for desktop spacer */}
            <div className="absolute top-16 left-[10%] right-[10%] h-0.5 bg-purple-brand/10 hidden lg:block -z-1" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Step 1 */}
              <div className="bg-[#FAF8FE]/80 border border-purple-brand/5 p-7 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-sm hover:translate-y-[-2px] transition-all relative">
                <div className="w-12 h-12 rounded-full bg-teal-dark text-white font-serif italic text-xl flex items-center justify-center shadow-md">
                  1
                </div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wide">1. WEAR</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Slip on the booties and relax for 60 mins.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#FAF8FE]/80 border border-purple-brand/5 p-7 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-sm hover:translate-y-[-2px] transition-all relative">
                <div className="w-12 h-12 rounded-full bg-teal-dark text-white font-serif italic text-xl flex items-center justify-center shadow-md">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wide">2. WAIT</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Let magic work! You may Peeling in 3-5 days.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#FAF8FE]/80 border border-purple-brand/5 p-7 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-sm hover:translate-y-[-2px] transition-all relative">
                <div className="w-12 h-12 rounded-full bg-teal-dark text-white font-serif italic text-xl flex items-center justify-center shadow-md">
                  3
                </div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wide">3. PEEL</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Dead skin naturally peels away over next last days.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#FAF8FE]/80 border border-purple-brand/5 p-7 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-sm hover:translate-y-[-2px] transition-all relative">
                <div className="w-12 h-12 rounded-full bg-teal-dark text-white font-serif italic text-xl flex items-center justify-center shadow-md">
                  4
                </div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wide">4. REVEAL</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Enjoy baby-soft, silky smooth feet!
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ✨ 3b. Why Silkpedi - Benefits Section (teal-dark with purple + white highlights) */}
      <section
        className="py-14 md:py-24 px-4 md:px-8 bg-teal-dark text-white relative overflow-hidden"
        id="benefits-section"
      >
        <div className="absolute top-0 left-0 bg-purple-brand/20 w-96 h-96 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 right-0 bg-purple-brand/15 w-96 h-96 rounded-full blur-3xl -z-0" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-14">

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-purple-brand/20 text-purple-light text-xs font-bold font-mono tracking-widest uppercase px-3.5 py-1 rounded-full border border-purple-brand/40">
              WHY SILKPEDI WORKS
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Salon Results, <span className="italic text-purple-brand">Tailored for You</span>
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-300 text-base md:text-lg">
              Six reasons clients call Silkpedi the smartest at-home pedicure they've ever tried — a gentle botanical formula that works for every skin type.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Exfoliates & removes dead skin",
                desc: "Botanical AHAs gently dissolve the bond holding dead skin in place — no scraping, no force.",
              },
              {
                icon: <Smile className="w-6 h-6" />,
                title: "Soft, smooth & renewed feet",
                desc: "Reveals the fresh, baby-soft layer underneath in 3-7 days, with a healthy lasting glow.",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Salon results from your couch",
                desc: "Slip on the booties, relax for 60 minutes, and let the formula do the work for you.",
              },
              {
                icon: <Droplet className="w-6 h-6" />,
                title: "Gentle on every skin type",
                desc: "Balanced botanical actives leave skin even and glowing — no harsh stripping or stinging.",
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Deep lactic & botanical moisture",
                desc: "A balanced blend of lactic acid and plant oils softens, hydrates, and protects.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Proudly serving the region & beyond",
                desc: "Shipping across Zimbabwe, South Africa, Zambia and beyond — premium care wherever you are.",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="group bg-[#0f3531]/80 backdrop-blur-sm border border-purple-brand/25 p-7 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-purple-brand/70 hover:bg-[#0f3531] transition-all duration-300 flex flex-col space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-brand/20 text-purple-brand flex items-center justify-center shadow-sm group-hover:bg-purple-brand group-hover:text-white transition-colors">
                  {b.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-white leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
                <div className="flex items-center pt-2 text-purple-light text-xs font-mono font-bold tracking-widest uppercase">
                  <Check className="w-4 h-4 mr-1.5 text-purple-brand" />
                  <span>Verified Benefit</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleGenericBuy}
              className="px-8 py-4 bg-purple-brand text-white text-sm font-extrabold tracking-wider uppercase rounded-xl shadow-xl shadow-purple-900/40 hover:bg-opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              GET SILKPEDI - $25
            </button>
            <span className="text-xs text-gray-300 font-medium">
              🔒 Skin-safe formula • 💜 Loved by clients across the region
            </span>
          </div>

        </div>
      </section>

      {/* 💼 4. What's in the Pack Section - Styled on beautiful premium purple background */}
      <section 
        ref={sectionRefs.pack}
        className="py-14 md:py-24 px-4 md:px-8 bg-purple-light text-teal-dark relative"
        id="whats-in-pack-section"
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="bg-purple-brand/10 text-purple-brand text-xs font-bold font-mono tracking-widest uppercase px-3.5 py-1 rounded-full border border-purple-brand/20">
              5 SIMPLE ESSENTIALS IN EVERY SINGLE PACK
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              What's in the Pack?
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
            <p className="text-gray-500 text-sm md:text-base">
              Everything required to perform your luxurious spa peeling at home safely. Formulated perfectly to melt away calluses and keep your feet pristine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side - Product Image with elegant highlighted pack detail */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-md bg-white border border-purple-brand/10 p-5 rounded-[2rem] shadow-xl">
                <img 
                  src={PACK_IMAGE_URL} 
                  alt="Silkpedi 5 Essentials Kit Flatlay" 
                  className="w-full h-auto rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating summary of highlighted pack detail */}
                <div className="mt-5 bg-teal-dark border border-purple-brand/20 p-5 rounded-2xl text-white">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded bg-purple-brand/20">
                      <Sparkles className="w-4 h-4 text-purple-brand" />
                    </div>
                    <p className="font-mono text-[9px] font-bold text-teal-bright uppercase tracking-wider">ACTIVE ELEMENT HIGHLIGHT</p>
                  </div>
                  <h4 className="font-serif text-lg font-bold mt-1 text-white">
                    {PACK_DETAILS[activePackItem - 1].name}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {PACK_DETAILS[activePackItem - 1].howItWorks}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Premium tabs list */}
            <div className="lg:col-span-6 space-y-4">
              {PACK_DETAILS.map((item) => {
                const isActive = activePackItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePackItem(item.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start space-x-4 ${
                      isActive 
                        ? "bg-purple-brand border-purple-light text-white shadow-xl shadow-purple-900/10 translate-x-1" 
                        : "bg-white border-purple-brand/5 text-teal-dark hover:bg-white/80"
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? "bg-white text-purple-dark animate-pulse" : "bg-purple-light text-purple-brand"
                    }`}>
                      {getIconComponent(item.iconName)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold opacity-85">0{item.id}</span>
                        <h3 className="font-serif text-base font-bold tracking-wide">
                          {item.name}
                        </h3>
                      </div>
                      <p className={`text-xs leading-relaxed ${isActive ? "text-purple-light" : "text-gray-500"}`}>
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 💳 5. Pricing & Bundle Selection (GET SILKPEDI) - Luxury Modern Bento styling */}
      <section 
        ref={sectionRefs.bundles}
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
              Say goodbye to dry, calloused feet with our premium, discounted bundle options — gentle on every skin type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-6 md:pt-4">

            {PRODUCT_BUNDLES.map((bundle) => {
              return (
                <div
                  key={bundle.id}
                  className={`rounded-[1.75rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                    bundle.popular
                      ? "bg-[#FAF8FE] text-teal-dark border-4 border-purple-brand shadow-2xl md:scale-[1.03] z-10"
                      : "bg-[#092522] text-white border border-teal-light/40 shadow-xl hover:bg-[#0c312d]"
                  }`}
                  id={`bundle-card-${bundle.id}`}
                >
                  {/* Popular Indicator Ribbons */}
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

                  {/* Top content */}
                  <div className="space-y-6">
                    <div className="text-center space-y-2 pt-2">
                      <h3 className="font-serif text-2xl font-bold">
                        {bundle.name}
                      </h3>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${bundle.popular ? "text-purple-brand" : "text-teal-bright"}`}>
                        {bundle.tagline}
                      </p>
                    </div>

                    {/* Price banner */}
                    <div className={`text-center py-5 rounded-2xl border ${bundle.popular ? "bg-purple-light border-purple-brand/10" : "bg-teal-dark/30 border-teal-light/20"}`}>
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-5xl font-black tracking-tight">${bundle.price}</span>
                        {bundle.originalPrice > bundle.price && (
                          <span className="text-lg line-through text-gray-400 font-bold">${bundle.originalPrice}</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono font-bold uppercase mt-1 tracking-widest">
                        {bundle.description}
                      </p>
                    </div>

                    {/* Savings display card */}
                    {bundle.savings > 0 && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl p-3 text-center text-xs font-black">
                        🎉 INSTANT SAVINGS: ${bundle.savings} WITH COUPLINGS
                      </div>
                    )}

                    {/* Items checklist */}
                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">WHAT'S IN THE KIT:</p>
                      {bundle.itemsIncluded.map((itemStr, i) => (
                        <div key={i} className="flex items-start space-x-2.5 text-xs font-medium">
                          <Check className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className={`${bundle.popular ? "text-gray-600" : "text-gray-200"}`}>{itemStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="pt-8">
                    <button
                      onClick={() => handlePurchase(bundle)}
                      className={`w-full py-4 text-center font-extrabold tracking-wider uppercase rounded-xl shadow-lg hover:shadow-xl transition-all hover:translate-y-[-1px] cursor-pointer ${
                        bundle.popular 
                          ? "bg-purple-brand text-white hover:bg-opacity-95" 
                          : "bg-white text-teal-dark hover:bg-gray-50"
                      }`}
                      id={`buy-button-${bundle.id}`}
                    >
                      GET SILKPEDI
                    </button>
                    
                    <p className={`text-[10px] text-center mt-2.5 font-medium ${bundle.popular ? "text-gray-400" : "text-gray-300"}`}>
                      🔒 Guaranteed Secured Stripe checkout
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Secure Trust highlights */}
          <div className="bg-[#092522] border border-teal-light/35 p-6 rounded-2xl flex flex-wrap justify-center items-center gap-y-4 gap-x-12 text-center text-xs md:text-sm font-semibold max-w-4xl mx-auto">
            <span className="flex items-center space-x-2 text-gray-300 justify-center">
              <Truck className="w-4 h-4 text-purple-light" />
              <span>📦 EXPRESS COURIER DELIVERY</span>
            </span>
            <span className="flex items-center space-x-2 text-gray-300 justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-light" />
              <span>🏆 PROUDLY SERVING ZIMBABWE, SOUTH AFRICA, ZAMBIA & BEYOND</span>
            </span>
            <span className="flex items-center space-x-2 text-gray-300 justify-center">
              <Lock className="w-4 h-4 text-purple-light" />
              <span>💳 SECURE ENCRYPTED GATEWAY</span>
            </span>
          </div>

        </div>
      </section>

      {/* 🌟 6. Testimonials Section */}
      <section 
        ref={sectionRefs.reviews}
        className="py-14 md:py-24 px-4 md:px-8 bg-[#FAF8FE] text-teal-dark"
        id="reviews-section"
      >
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 max-w-5xl mx-auto">
            <div className="space-y-3 text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-purple-brand uppercase">
                REAL PEDICURE RESULTS
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
                Our Clients Share the Magic
              </h2>
              <div className="w-16 h-1 bg-purple-brand rounded-full mt-2" />
            </div>
            
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-teal-dark text-white rounded-xl text-xs font-extrabold tracking-wider uppercase hover:bg-opacity-95 transition-all w-full md:w-fit cursor-pointer"
            >
              {showReviewForm ? "CANCEL REVIEW" : "WRITE A REVIEW"}
            </button>
          </div>

          {/* Review write form code block */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto bg-white border border-purple-brand/20 p-6 rounded-3xl shadow-xl space-y-4"
              >
                <h3 className="font-serif text-lg font-bold">Write Your Review</h3>
                
                <form onSubmit={handleSubmitReview} className="space-y-4 text-sm text-left">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Alexis M." 
                      className="w-full px-4 py-2 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-brand"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Star Rating</label>
                    <select 
                      value={newReviewRating} 
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-brand"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Review Title</label>
                    <input 
                      type="text" 
                      required 
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Totally transformed my feet!" 
                      className="w-full px-4 py-2 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-brand"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Review Details</label>
                    <textarea 
                      required 
                      rows={3}
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      placeholder="Share your peeling experience!" 
                      className="w-full px-4 py-2 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-brand"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-purple-brand text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-opacity-95 transition-all cursor-pointer"
                  >
                    SUBMIT VERIFIED REVIEW
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white border border-purple-brand/10 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all relative"
              >
                <div className="space-y-3">
                  {/* Star row */}
                  <div className="flex items-center text-amber-500 space-x-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-gold" />
                    ))}
                  </div>

                  <h3 className="font-serif font-extrabold text-[#111] text-base leading-snug">
                    "{rev.title}"
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed">
                    {rev.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-purple-light pt-4">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={rev.avatar} 
                      alt={rev.name} 
                      className="w-8.5 h-8.5 rounded-full object-cover border-2 border-purple-brand"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left leading-none">
                      <p className="text-xs font-black text-teal-dark">{rev.name}</p>
                      <span className="text-[9px] font-semibold text-purple-brand">Happy Client</span>
                    </div>
                  </div>

                  {/* Likes validation counter */}
                  <button 
                    onClick={() => incrementHelpful(rev.id)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-purple-brand flex items-center space-x-1 bg-purple-light/50 px-2.5 py-1 rounded cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{rev.helpfulCount + (likesCount[rev.id] || 0)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🙋‍♀️ 7. FAQ Accordion Section */}
      <section 
        ref={sectionRefs.faq}
        className="py-14 md:py-24 px-4 md:px-8 bg-white text-teal-dark"
        id="faq-section"
      >
        <div className="max-w-4xl mx-auto space-y-10 md:space-y-16">
          
          <div className="text-center space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-brand uppercase">
              GOT QUESTIONS? WE HAVE ANSWERS
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 bg-purple-brand mx-auto rounded-full" />
          </div>

          {/* Filtering categories tabs */}
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            {[
              { id: "all", label: "Show All" },
              { id: "usage", label: "How to Use" },
              { id: "safety", label: "Safety & Care" },
              { id: "shipping", label: "Delivery Details" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFaqCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                  activeFaqCategory === cat.id 
                    ? "bg-purple-brand text-white shadow-md shadow-purple-900/20" 
                    : "bg-purple-light hover:bg-purple-light/80 text-teal-dark"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accent Accordion Cards */}
          <div className="space-y-4">
            {FAQ_ITEMS.filter((item) => activeFaqCategory === "all" || item.category === activeFaqCategory).map((item) => {
              const isExpanded = expandedFaqId === item.id;
              return (
                <div 
                  key={item.id}
                  className="bg-purple-light/40 border border-purple-brand/5 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : item.id)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-purple-light/60 transition-colors focus:outline-none cursor-pointer"
                    aria-expanded={isExpanded}
                    id={`faq-btn-${item.id}`}
                  >
                    <span className="font-serif font-bold text-base md:text-lg">
                      {item.question}
                    </span>
                    <span className="shrink-0 ml-4 p-1.5 rounded-full bg-white text-purple-brand shadow-sm">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed border-t border-purple-brand/5 font-medium">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 🚀 Dynamic Bottom conversion section - Styled accurately inside clean lavender strip */}
      <section className="bg-purple-light text-teal-dark py-12 md:py-14 px-4 md:px-8 border-y border-purple-brand/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(138,107,200,0.04),transparent_50%)]" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="text-center lg:text-left space-y-2">
            <h3 className="font-serif text-2xl md:text-4xl font-black">
              Ready for Your Softest Feet Yet?
            </h3>
            <p className="text-gray-500 text-sm md:text-base font-medium">
              Get Silkpedi. Unlock pristine, confident feet — premium foot care, proudly served across the region.
            </p>
          </div>

          <button
            onClick={handleGenericBuy}
            className="px-8 py-4 bg-teal-dark text-white font-extrabold tracking-wider uppercase rounded-xl hover:bg-teal-medium transition-all transform hover:-translate-y-0.5 shadow-xl w-full lg:w-auto cursor-pointer"
            id="ready-cta-buy"
          >
            GET SILKPEDI - $25
          </button>
        </div>
      </section>

      {/* 🛒 Lead-capture Order Modal (Step 1 → hands off to WhatsApp) */}
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
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
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
                          className="w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-sm"
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
                          className="w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-sm"
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
                      className="w-full px-4 py-3 bg-purple-light/50 border border-purple-brand/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-brand/40 text-sm"
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

      {/* 🔮 8. Detailed E-commerce Footer */}
      <footer className="bg-teal-dark text-white py-12 md:py-16 px-4 md:px-8 border-t border-teal-light/25 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
          
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center space-x-2.5 text-white">
              <div className="w-8 h-8 rounded-full bg-purple-brand flex items-center justify-center">
                <span className="font-serif font-black text-white text-base">S</span>
              </div>
              <span className="font-serif text-xl tracking-wide font-black">silkpedi</span>
            </div>
            
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Silkpedi gives you spa-grade at-home peeling, the easy way. Balanced botanical AHAs gently lift difficult calluses to reveal soft, smooth feet — suitable for every skin type.
            </p>

            <div className="space-y-1 bg-[#0f3531] p-3.5 rounded-xl border border-teal-light/30 w-fit">
              <p className="text-[10px] font-bold text-teal-bright tracking-widest uppercase">🎯 24/7 PRE-PURCHASE DIAGNOSTIC HELPLINE</p>
              <p className="text-xs font-mono font-bold text-white flex items-center mt-1">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-purple-brand" /> hello@silkpedi.com
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-purple-brand uppercase">EXPERIENCE SHOP</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400">
              <button onClick={() => openOrderModal(PRODUCT_BUNDLES.find((b) => b.id === "1-pack") || null)} className="hover:text-white text-left transition-colors cursor-pointer">1-Pack Starter Pack ($25)</button>
              <button onClick={() => openOrderModal(PRODUCT_BUNDLES.find((b) => b.id === "2-pack") || null)} className="hover:text-white text-left transition-colors cursor-pointer">2-Pack Most Popular ($45)</button>
              <button onClick={() => openOrderModal(PRODUCT_BUNDLES.find((b) => b.id === "3-pack") || null)} className="hover:text-white text-left transition-colors cursor-pointer">3-Pack Absolute Glow Bundle ($70)</button>
              <p className="text-[10px] text-teal-bright font-bold font-mono">Use 'WELCOME10' for 10% instant rebate!</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-purple-brand uppercase">CARE & SAFETY</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400">
              <button onClick={() => scrollToSection("works")} className="hover:text-white text-left transition-colors cursor-pointer">Care Manual Instructions</button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-white text-left transition-colors cursor-pointer">Pre-Peeling Prep Tips</button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-white text-left transition-colors cursor-pointer">Aftercare Advice</button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-white text-left transition-colors cursor-pointer">FAQ Center</button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-purple-brand uppercase">REACH & TRUST</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400">
              <p>🌍 Zimbabwe • South Africa • Zambia & beyond</p>
              <p>🛡️ Premium at-home foot care</p>
              <p>📦 1-2 Day Regional Courier Delivery</p>
            </div>
          </div>

        </div>

        {/* Outer credit lines following the absolute rules of anti-tech-larping */}
        <div className="max-w-7xl mx-auto border-t border-teal-light/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2026 SilkPedi Inc. All rights reserved. Designed to look clean & convert sales perfectly.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-white transition-colors cursor-pointer">Merchant Terms</span>
            <span className="hover:text-white transition-colors cursor-pointer">Compliance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
