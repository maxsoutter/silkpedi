export interface ProductBundle {
  id: string;
  name: string;
  quantity: number;
  price: number;
  originalPrice: number;
  savings: number;
  description: string;
  popular: boolean;
  bestValue: boolean;
  tagline: string;
  itemsIncluded: string[];
}

export interface CartItem {
  bundleId: string;
  bundleName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  packCount: number; // 1, 2, or 3
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  avatar: string;
  helpfulCount: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "usage" | "safety" | "shipping" | "general";
}

export interface StepItem {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  imageAlt: string;
}

export interface ProductPackDetail {
  id: number;
  name: string;
  description: string;
  howItWorks: string;
  iconName: string;
}
