import { ProductBundle, Review, FaqItem, ProductPackDetail } from "./types";

export const PRODUCT_BUNDLES: ProductBundle[] = [
  {
    id: "1-pack",
    name: "1 Pack Treatment",
    quantity: 1,
    price: 25,
    originalPrice: 25,
    savings: 0,
    description: "1 Treatment",
    popular: false,
    bestValue: false,
    tagline: "Perfect for a gentle refresh or custom trial.",
    itemsIncluded: [
      "1x Exfoliating Foot Peel Booties",
      "1x Soothing & Cleansing Wipe",
      "Step-by-Step Guidance Care Manual"
    ]
  },
  {
    id: "2-pack",
    name: "2 Packs Combo",
    quantity: 2,
    price: 45,
    originalPrice: 50,
    savings: 5,
    description: "2 Treatments",
    popular: true,
    bestValue: false,
    tagline: "Deep hydration & skin renewal. Most popular choice!",
    itemsIncluded: [
      "2x Exfoliating Foot Peel Booties",
      "2x Soothing & Cleansing Wipes",
      "1x Ergonomic Sanding Foot File",
      "Step-by-Step Guidance Care Manual",
      "Express Courier Delivery Included"
    ]
  },
  {
    id: "3-pack",
    name: "3 Packs Absolute Glow",
    quantity: 3,
    price: 70,
    originalPrice: 75,
    savings: 5,
    description: "3 Treatments",
    popular: false,
    bestValue: true,
    tagline: "Ultimate year-long soft feet prep, or share with friends.",
    itemsIncluded: [
      "3x Exfoliating Foot Peel Booties",
      "3x Soothing & Cleansing Wipes",
      "1x Ergonomic Sanding Foot File",
      "1x Ultra-Nourishing Skin Cream (Full Size)",
      "1x Premium Bamboo Moisturizing Socks",
      "Express Courier Delivery Included"
    ]
  }
];

export const PACK_DETAILS: ProductPackDetail[] = [
  {
    id: 1,
    name: "Exfoliating Foot Peel",
    description: "Gently removes stubborn dead skin, thick crust, and calluses using natural fruit-derived botanical acids.",
    howItWorks: "Ditch scraping. Lactic and Glycolic acids target only cohesive cell links, encouraging rapid, natural peeling without friction.",
    iconName: "Sparkles"
  },
  {
    id: 2,
    name: "Professional Foot File",
    description: "Ergonomic dual-sided salon-grade file designed to refine rough heels and dry outline spots seamlessly.",
    howItWorks: "Gently run across peeling margins on days 5-8 to clear remaining loose flakes, achieving a pristine, uniform touch.",
    iconName: "Wrench"
  },
  {
    id: 3,
    name: "Soft Moisturizing Socks",
    description: "Ultra-breathable premium organic bamboo fibers designed to deeply lock in humidity after your sessions.",
    howItWorks: "Slip these on overnight following peeling or lotion application to boost absorption by up to 300%.",
    iconName: "Layers"
  },
  {
    id: 4,
    name: "Soothing Reset Wipe",
    description: "Gentle botanical post-peel wipes that calm and balance fresh skin after your treatment.",
    howItWorks: "Cleanses, relieves any tingling sensations, and leaves behind a soft, chamomile-infused protective layer.",
    iconName: "Smile"
  },
  {
    id: 5,
    name: "Vitamin Nourishing Cream",
    description: "Daily skin barrier lock with cocoa butter, pure squalane, and vitamin E for the fresh skin underneath.",
    howItWorks: "Keeps newly revealed baby-soft skin hydrated, prevents re-drying, and maintains a healthy, lasting glow.",
    iconName: "Droplet"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Tendai M.",
    rating: 5,
    date: "May 24, 2026",
    title: "Best $25 I have ever spent!",
    content: "My feet are literally so soft. Peeling started on Day 4 and it was so satisfying to watch. Highly recommend to everyone, especially if you get dry heels easily!",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=120&auto=format&fit=crop",
    helpfulCount: 42
  },
  {
    id: "rev-2",
    name: "Chipo N.",
    rating: 5,
    date: "May 18, 2026",
    title: "Smooth and even from day one.",
    content: "I've tried so many peels that dried me out and left my skin patchy. Silkpedi was the opposite — it hydrates beautifully and left everything completely uniform and soft.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&auto=format&fit=crop",
    helpfulCount: 29
  },
  {
    id: "rev-3",
    name: "Emma L.",
    rating: 5,
    date: "May 10, 2026",
    title: "The peeling is incredible!",
    content: "It works perfectly! Follow the instructions and soak your feet daily. By day 5, sheets of dead skin literally slipped off. Underneath is brand new baby skin.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
    helpfulCount: 56
  },
  {
    id: "rev-4",
    name: "Daniel W.",
    rating: 5,
    date: "April 29, 2026",
    title: "Who says men can't get the home spa treatment too?",
    content: "Bought a pack on a whim — best decision. My heels were rough from gym and trail runs, and after 6 days they were properly soft. Honestly, men deserve smooth feet too.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    helpfulCount: 18
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How long does it take to start peeling?",
    answer: "Every skin type is unique, but most clients notice peeling starting on Day 3 or 4. Peeling generally finishes by Day 7 to 10, leaving beautiful, newly smoothed heels.",
    category: "usage"
  },
  {
    id: "faq-2",
    question: "Do I need to soak my feet during the process?",
    answer: "Yes! High-Converting Tip: Soaking your feet in warm water for 15-20 minutes daily starting on Day 2 makes peeling up to 2x faster and much more satisfying.",
    category: "usage"
  },
  {
    id: "faq-3",
    question: "Is it safe and pain-free?",
    answer: "Absolutely pain-free. The peel uses gentle fruit-derived botanical acids (AHAs) to lift the dead outer layer of skin. You won't feel any pain or heat — just satisfying, even peeling.",
    category: "safety"
  },
  {
    id: "faq-4",
    question: "How often should I do a Silkpedi treatment?",
    answer: "We recommend using Silkpedi once every 4 to 6 weeks. This matches our skin's natural monthly rejuvenation cycle and prevents hard calluses from reforming.",
    category: "usage"
  },
  {
    id: "faq-5",
    question: "How does delivery work?",
    answer: "Express courier delivery is included on 2-pack and 3-pack bundles across our service area. For single packs or outlying regions, we deliver at a flat rate of just $5.",
    category: "shipping"
  },
  {
    id: "faq-6",
    question: "Where do you deliver to?",
    answer: "We proudly serve Zimbabwe, South Africa, Zambia and beyond, with fast courier delivery across major cities and towns. For destinations further afield, get in touch with us via email and we'll sort it out for you.",
    category: "general"
  }
];
