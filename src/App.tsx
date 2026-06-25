/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Star, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Info, 
  X, 
  CreditCard, 
  ThumbsUp,
  Heart,
  Droplet,
  Layers,
  Smile,
  Mail,
  CheckCircle,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCT_BUNDLES, PACK_DETAILS, INITIAL_REVIEWS, FAQ_ITEMS } from "./data";
import { ProductBundle, CartItem, Review } from "./types";
import heroBgImage from "./assets/images/silkpedi_hero_bg.webp";
import packImage from "./assets/images/silkpedi_pack_1779850178423.webp";

// Images are imported as ES modules so Vite fingerprints them with content
// hashes at build time — guaranteeing they resolve in production (not just dev).
const HERO_BG_IMAGE_URL = heroBgImage;
const PACK_IMAGE_URL = packImage;

const WHATSAPP_PHONE = "263788860359";
const openWhatsApp = (message: string) => {
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
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

  // Cart & Checkout States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "success">("cart");

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

  // Checkout inputs
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: ""
  });
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "4000 1234 5678 9010",
    cardName: "",
    cardExpiry: "12/28",
    cardCvc: "123"
  });
  const [orderId, setOrderId] = useState("");

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

  // Buy buttons open a pre-filled WhatsApp chat instead of an in-page cart
  const handlePurchase = (bundle: ProductBundle) => {
    const message =
      BUNDLE_WHATSAPP_MESSAGES[bundle.id] ||
      `Hello, I'd like to order the Silkpedi ${bundle.name} ($${bundle.price}).`;
    openWhatsApp(message);
  };

  const handleGenericBuy = () => openWhatsApp("Hello, I'd like to buy a Silkpedi kit");

  // Cart operations
  const updateCartQty = (newQty: number) => {
    if (!cart) return;
    if (newQty <= 0) {
      setCart(null);
      return;
    }
    const unitPrice = cart.pricePerUnit;
    setCart({
      ...cart,
      quantity: newQty,
      totalPrice: unitPrice * newQty
    });
  };

  // Apply promo simulator
  const applyPromoCode = () => {
    const clean = promoCode.trim().toUpperCase();
    if (clean === "WELCOME10" || clean === "GLOW5" || clean === "SILK10") {
      setAppliedPromo(clean);
    } else {
      alert("Invalid promo code! Try using 'WELCOME10' for 10% off.");
    }
  };

  const getSubtotal = () => {
    if (!cart) return 0;
    return cart.totalPrice;
  };

  const getDiscount = () => {
    if (!appliedPromo || !cart) return 0;
    if (appliedPromo === "WELCOME10" || appliedPromo === "SILK10") return getSubtotal() * 0.10;
    if (appliedPromo === "GLOW5") return 5;
    return 0;
  };

  const getShippingFee = () => {
    if (!cart) return 0;
    if (cart.bundleId === "2-pack" || cart.bundleId === "3-pack" || getSubtotal() >= 40) {
      return 0;
    }
    return 4.99;
  };

  const getTotal = () => {
    return Math.max(0, getSubtotal() - getDiscount() + getShippingFee());
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

  // Checkout form submit
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.email || !shippingForm.address) {
      alert("Please fill out all required fields.");
      return;
    }
    setCheckoutStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockOrderNum = "SP-" + Math.floor(Math.random() * 900000 + 100000);
    setOrderId(mockOrderNum);
    setCheckoutStep("success");
  };

  // Reset helper
  const handleResetCheckout = () => {
    setCart(null);
    setCheckoutStep("cart");
    setIsCartOpen(false);
    setAppliedPromo(null);
    setPromoCode("");
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

            {/* Shopping Cart Trigger - desktop only (cart flow is decommissioned on mobile) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden lg:flex relative p-2.5 rounded-full bg-teal-medium hover:bg-teal-light border border-teal-light/30 transition-all items-center justify-center focus:outline-none"
              aria-label="Toggle Shopping Cart"
              id="cart-trigger-btn"
            >
              <ShoppingBag className="w-5 h-5 text-purple-light" />
              {cart && cart.quantity > 0 && (
                <div className="absolute -top-1 -right-1 bg-purple-brand text-white text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-teal-dark animate-bounce">
                  {cart.quantity}
                </div>
              )}
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

      {/* 🛒 Interactive Cart & Checkout slideout Drawer Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            {/* Backdrop filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <div className="absolute inset-y-0 right-0 max-w-md w-full flex pl-10">
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full bg-white h-full flex flex-col justify-between shadow-2xl relative"
                id="cart-drawer-panel"
              >
                
                {/* Header info */}
                <div className="bg-teal-dark text-white p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-purple-light" />
                    <span className="font-serif text-lg font-bold">Your Silkpedi Cart</span>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-full hover:bg-teal-light/40 transition-colors text-white focus:outline-none cursor-pointer"
                    aria-label="Close cart"
                    id="close-cart-drawer-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Body (Multi step conversion form checkout) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  
                  {/* Step status dots */}
                  <div className="flex items-center justify-center space-x-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-1.5 text-xs font-bold">
                      <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono ${
                        checkoutStep === "cart" ? "bg-purple-brand text-white" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {checkoutStep !== "cart" ? "✓" : "1"}
                      </span>
                      <span className={checkoutStep === "cart" ? "text-purple-brand" : "text-gray-400"}>Cart</span>
                    </div>
                    <span className="text-gray-300">➔</span>
                    
                    <div className="flex items-center space-x-1.5 text-xs font-bold">
                      <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono ${
                        checkoutStep === "shipping" ? "bg-purple-brand text-white" : (checkoutStep === "payment" || checkoutStep === "success" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400")
                      }`}>
                        {checkoutStep === "payment" || checkoutStep === "success" ? "✓" : "2"}
                      </span>
                      <span className={checkoutStep === "shipping" ? "text-purple-brand" : "text-gray-400"}>Delivery</span>
                    </div>
                    <span className="text-gray-300">➔</span>

                    <div className="flex items-center space-x-1.5 text-xs font-bold">
                      <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono ${
                        checkoutStep === "payment" ? "bg-purple-brand text-white" : (checkoutStep === "success" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400")
                      }`}>
                        {checkoutStep === "success" ? "✓" : "3"}
                      </span>
                      <span className={checkoutStep === "payment" ? "text-purple-brand" : "text-gray-400"}>Payment</span>
                    </div>
                  </div>

                  {/* Empty state conditional */}
                  {!cart && checkoutStep !== "success" ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-purple-light mx-auto flex items-center justify-center text-purple-brand text-xl font-bold">
                        🛍️
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-serif text-lg font-bold">Your cart is empty.</p>
                        <p className="text-xs text-gray-500">Pick a bundle below to start your transformation!</p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          scrollToSection("bundles");
                        }}
                        className="px-6 py-2.5 bg-purple-brand text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-opacity-95 transition-all cursor-pointer"
                      >
                        VIEW BUNDLES
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* -- STATE 1: VIEW CART -- */}
                      {checkoutStep === "cart" && cart && (
                        <div className="space-y-6">
                          
                          {/* Delivery milestone progress bar */}
                          <div className="bg-purple-light border border-purple-brand/10 p-4 rounded-2xl text-xs space-y-2 text-left">
                            <div className="flex justify-between font-bold">
                              <span>Delivery Status:</span>
                              <span className="text-purple-brand">
                                {getShippingFee() === 0 ? "🎉 EXPRESS DELIVERY INCLUDED!" : `$${(40 - getSubtotal()).toFixed(2)} away from included delivery!`}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-purple-brand to-teal-bright h-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (getSubtotal() / 40) * 100)}%` }}
                              />
                            </div>
                            <div className="text-gray-400 text-[11px] font-medium leading-relaxed">
                              {getShippingFee() === 0
                                ? "Most clients choose our best value bundle to unlock express delivery automatically."
                                : "Add a 2-Pack bundle to unlock express delivery instantly!"}
                            </div>
                          </div>

                          {/* Cart Product List */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 text-left">YOUR SELECTION:</p>
                            <div className="bg-purple-light/40 border border-purple-brand/5 p-4 rounded-2xl flex items-center space-x-3.5 relative">
                              
                              <div className="w-16 h-16 rounded-xl bg-teal-dark overflow-hidden shrink-0">
                                <img 
                                  src={PACK_IMAGE_URL} 
                                  alt="Selected Pack" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              <div className="flex-1 text-left">
                                <h4 className="font-serif font-bold text-sm text-[#111]">{cart.bundleName}</h4>
                                <p className="text-[11px] font-bold text-purple-brand">{cart.packCount} treatments pack</p>
                                
                                <div className="flex items-center justify-between mt-2">
                                  {/* Qty controls */}
                                  <div className="flex items-center space-x-1 border border-purple-brand/10 bg-white rounded-lg p-1">
                                    <button 
                                      onClick={() => updateCartQty(cart.quantity - 1)}
                                      className="p-1 text-gray-400 hover:text-purple-brand focus:outline-none cursor-pointer"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-mono text-xs font-bold px-1.5">{cart.quantity}</span>
                                    <button 
                                      onClick={() => updateCartQty(cart.quantity + 1)}
                                      className="p-1 text-gray-400 hover:text-purple-brand focus:outline-none cursor-pointer"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <span className="font-mono text-xs font-extrabold text-[#111]">${cart.totalPrice}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => setCart(null)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-500 rounded focus:outline-none cursor-pointer"
                                aria-label="Remove item"
                              >
                                <X className="w-4 h-4" />
                              </button>

                            </div>
                          </div>

                          {/* Promo code entry */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase text-left">PROMO CODE (USE 'WELCOME10' FOR 10% OFF)</label>
                            <div className="flex space-x-2">
                              <input 
                                type="text"
                                placeholder="WELCOME10"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-purple-light/60 border border-purple-brand/20 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-purple-brand"
                              />
                              <button 
                                onClick={applyPromoCode}
                                className="px-4 py-2 bg-teal-dark text-white rounded-xl text-xs font-extrabold cursor-pointer"
                              >
                                APPLY
                              </button>
                            </div>
                            {appliedPromo && (
                              <div className="flex justify-between items-center bg-emerald-100/60 text-emerald-800 text-xs p-2 rounded-xl font-bold font-mono">
                                <span>Code '{appliedPromo}' applied successfully!</span>
                                <button 
                                  onClick={() => setAppliedPromo(null)}
                                  className="text-emerald-900 border-l border-emerald-300 pl-2 focus:outline-none cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Order subtotal block */}
                          <div className="bg-[#FAF8FE] p-4 rounded-2xl border border-purple-brand/5 text-xs text-left space-y-2">
                            <p className="font-mono font-bold text-[10px] uppercase text-gray-400">PRICE CALCULATION:</p>
                            
                            <div className="flex justify-between font-medium">
                              <span>Cart Subtotal</span>
                              <span className="font-mono font-bold text-[#111]">${getSubtotal().toFixed(2)}</span>
                            </div>

                            {getDiscount() > 0 && (
                              <div className="flex justify-between font-bold text-emerald-600">
                                <span>Coupon Discount</span>
                                <span className="font-mono">-${getDiscount().toFixed(2)}</span>
                              </div>
                            )}

                            <div className="flex justify-between font-medium">
                              <span>Standard Delivery</span>
                              <span className="font-mono font-bold text-[#111]">
                                {getShippingFee() === 0 ? (
                                  <span className="text-emerald-600 font-bold uppercase">INCLUDED</span>
                                ) : (
                                  `$${getShippingFee().toFixed(2)}`
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between font-mono font-black border-t border-gray-100 pt-2 text-sm text-[#111]">
                              <span>ESTIMATED TOTAL</span>
                              <span>${getTotal().toFixed(2)}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setCheckoutStep("shipping")}
                            className="w-full py-4 bg-purple-brand text-white text-xs font-extrabold uppercase tracking-widest rounded-xl hover:bg-opacity-95 transition-all text-center cursor-pointer"
                          >
                            PROCEED TO DELIVERY DETAILS
                          </button>

                        </div>
                      )}

                      {/* -- STATE 2: SHIPPING FORMS -- */}
                      {checkoutStep === "shipping" && cart && (
                        <form onSubmit={handleShippingSubmit} className="space-y-4 text-left text-sm">
                          
                          <div className="bg-purple-light/50 border border-purple-brand/10 p-3 rounded-xl flex items-center justify-between text-xs text-teal-dark">
                            <span>Order Total:</span>
                            <span className="font-bold underline">${getTotal().toFixed(2)}</span>
                          </div>

                          <h3 className="font-serif text-lg font-bold">Delivery Details</h3>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Your Name</label>
                            <input 
                              type="text"
                              required
                              value={shippingForm.fullName}
                              onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                              placeholder="Tendai Moyo"
                              className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
                            <input 
                              type="email"
                              required
                              value={shippingForm.email}
                              onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                              placeholder="tendai@gmail.com"
                              className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Delivery Address</label>
                            <input 
                              type="text"
                              required
                              value={shippingForm.address}
                              onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                              placeholder="12 Blackwood Road, Mount Pleasant, Harare"
                              className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Mobile Phone</label>
                            <input 
                              type="tel"
                              required
                              value={shippingForm.phone}
                              onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                              placeholder="+263 000 000 000"
                              className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="flex space-x-2.5 pt-4">
                            <button
                              type="button"
                              onClick={() => setCheckoutStep("cart")}
                              className="flex-1 py-3 border border-gray-200 text-teal-dark rounded-xl text-xs font-bold uppercase text-center focus:outline-none cursor-pointer"
                            >
                              BACK
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3 bg-purple-brand text-white rounded-xl text-xs font-extrabold uppercase text-center focus:outline-none cursor-pointer"
                            >
                              CONTINUE
                            </button>
                          </div>

                        </form>
                      )}

                      {/* -- STATE 3: PAYMENT FORMS -- */}
                      {checkoutStep === "payment" && cart && (
                        <form onSubmit={handlePaymentSubmit} className="space-y-5 text-left text-sm">
                          
                          <div className="bg-purple-light p-4 rounded-xl border border-purple-brand/15 text-xs">
                            <p className="font-bold text-teal-dark">Delivery to:</p>
                            <p className="text-gray-500 font-medium">{shippingForm.fullName}</p>
                            <p className="text-gray-500 font-medium">{shippingForm.address}</p>
                            <div className="border-t border-purple-brand/10 mt-2.5 pt-2 flex justify-between font-black text-teal-dark">
                              <span>Total amount:</span>
                              <span>${getTotal().toFixed(2)}</span>
                            </div>
                          </div>

                          <h3 className="font-serif text-lg font-bold">Secure Stripe Payment</h3>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Card Holder Name</label>
                            <input 
                              type="text"
                              required
                              value={paymentForm.cardName}
                              onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                              placeholder="JASMINE ROBINSON"
                              className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none uppercase font-mono text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Credit Card Number</label>
                            <div className="relative">
                              <input 
                                type="text"
                                required
                                value={paymentForm.cardNumber}
                                onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                                placeholder="4000 1234 5678 9010"
                                className="w-full pl-9 pr-3 py-2.5 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none font-mono text-xs"
                              />
                              <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase">Expiry Date</label>
                              <input 
                                type="text"
                                required
                                value={paymentForm.cardExpiry}
                                onChange={(e) => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })}
                                placeholder="12/28"
                                className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none font-mono text-xs text-center"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase">CVC Code</label>
                              <input 
                                type="text"
                                maxLength={3}
                                required
                                value={paymentForm.cardCvc}
                                onChange={(e) => setPaymentForm({ ...paymentForm, cardCvc: e.target.value })}
                                placeholder="123"
                                className="w-full px-3 py-2 bg-purple-light/40 border border-purple-brand/20 rounded-xl focus:outline-none font-mono text-xs text-center"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 justify-center py-2 text-xs text-emerald-600 font-bold">
                            <Lock className="w-4 h-4" />
                            <span>AES-256 Bit Secure Encryption Processing</span>
                          </div>

                          <div className="flex space-x-2.5">
                            <button
                              type="button"
                              onClick={() => setCheckoutStep("shipping")}
                              className="flex-1 py-3 border border-gray-200 text-teal-dark rounded-xl text-xs font-bold uppercase text-center focus:outline-none cursor-pointer"
                            >
                              BACK
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3 bg-purple-brand text-white rounded-xl text-xs font-extrabold uppercase text-center focus:outline-none cursor-pointer"
                              id="payment-submit-btn"
                            >
                              PAY ${getTotal().toFixed(2)}
                            </button>
                          </div>

                        </form>
                      )}

                      {/* -- STATE 4: SUCCESS CONGRATS -- */}
                      {checkoutStep === "success" && (
                        <div className="py-8 text-center space-y-6 text-teal-dark">
                          
                          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                            <CheckCircle className="w-12 h-12 stroke-current" />
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-serif text-2xl font-black">Your Order is Placed!</h3>
                            <p className="text-sm font-bold text-gray-500">
                              Congratulations {shippingForm.fullName || "lovely client"}! Ready to peel and reveal.
                            </p>
                          </div>

                          <div className="bg-[#FAF8FE] p-5 rounded-2xl border border-purple-brand/10 space-y-3.5 text-xs text-left">
                            <div className="flex justify-between border-b border-purple-brand/5 pb-2">
                              <span className="text-gray-400">Order Reference</span>
                              <span className="font-mono font-bold text-[#111]">{orderId}</span>
                            </div>
                            <div className="flex justify-between border-b border-purple-brand/5 pb-2">
                              <span className="text-gray-400">Estimated Delivery</span>
                              <span className="font-bold text-purple-brand">In 1-2 Business Days</span>
                            </div>
                            <div className="flex justify-between pb-1">
                              <span className="text-gray-400">Delivery Address</span>
                              <span className="font-bold text-[#111]">{shippingForm.address || "Harare, Zimbabwe"}</span>
                            </div>
                          </div>

                          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-emerald-800 font-medium leading-relaxed">
                            🌿 We have triggered your comprehensive homecare manual & confirmation. Soak feet in warm water for up to 2x more satisfying peeling results.
                          </div>

                          <button 
                            onClick={handleResetCheckout}
                            className="w-full py-4 bg-teal-dark hover:bg-teal-medium text-white rounded-xl text-xs font-extrabold uppercase tracking-widest text-center cursor-pointer"
                          >
                            CONTINUE SHOPPING
                          </button>

                        </div>
                      )}
                    </>
                  )}

                </div>

                {/* Footer security safe tag */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-[10px] text-gray-400 font-medium flex items-center justify-center space-x-1.5 select-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Safe and Secure Transaction via SilkPedi Platform</span>
                </div>

              </motion.div>
            </div>

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
              <button onClick={() => openWhatsApp(BUNDLE_WHATSAPP_MESSAGES["1-pack"])} className="hover:text-white text-left transition-colors cursor-pointer">1-Pack Starter Pack ($25)</button>
              <button onClick={() => openWhatsApp(BUNDLE_WHATSAPP_MESSAGES["2-pack"])} className="hover:text-white text-left transition-colors cursor-pointer">2-Pack Most Popular ($45)</button>
              <button onClick={() => openWhatsApp(BUNDLE_WHATSAPP_MESSAGES["3-pack"])} className="hover:text-white text-left transition-colors cursor-pointer">3-Pack Absolute Glow Bundle ($70)</button>
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
