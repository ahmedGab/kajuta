"use client";

import { SiteContent, Product, Testimonial, FAQItem, SectionKey, Language } from "./types";
import { defaultSiteContent } from "@/data/siteContent";
import { defaultProducts } from "@/data/products";
import { defaultTestimonials, defaultFAQ } from "@/data/faq";
import * as db from "./db";

const LANGUAGE_STORAGE_KEY = "cajuta_language";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "fr";
  
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "fr" || stored === "ar") {
    return stored;
  }
  return "fr";
}

export function saveLanguage(language: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function getSiteContent(): SiteContent {
  return defaultSiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  return await db.saveSiteContent(content);
}

export function getProducts(): Product[] {
  return defaultProducts;
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  return await db.saveProducts(products);
}

export function getTestimonials(): Testimonial[] {
  return defaultTestimonials;
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  return await db.saveTestimonials(testimonials);
}

export function getFAQ(): FAQItem[] {
  return defaultFAQ;
}

export async function saveFAQ(faq: FAQItem[]): Promise<boolean> {
  return await db.saveFAQ(faq);
}

export function resetSiteContent(): void {
  db.saveSiteContent(defaultSiteContent);
}

export function resetProducts(): void {
  db.saveProducts(defaultProducts);
}

export function addParagraph(section: SectionKey, language: Language, paragraph: string): void {
  // This needs to be handled in admin components with the full content object
}

export function updateParagraph(section: SectionKey, language: Language, index: number, paragraph: string): void {
  // This needs to be handled in admin components with the full content object
}

export function deleteParagraph(section: SectionKey, language: Language, index: number): void {
  // This needs to be handled in admin components with the full content object
}

export function moveParagraph(section: SectionKey, language: Language, index: number, direction: "up" | "down"): void {
  // This needs to be handled in admin components with the full content object
}

export function getSiteContentSync(): SiteContent | null {
  if (typeof window === "undefined") return defaultSiteContent;
  
  const stored = localStorage.getItem("cajuta_site_content_fallback");
  if (stored) {
    try {
      return JSON.parse(stored) as SiteContent;
    } catch {
      return defaultSiteContent;
    }
  }
  return defaultSiteContent;
}

export function getProductsSync(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  
  const stored = localStorage.getItem("cajuta_products_fallback");
  if (stored) {
    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return defaultProducts;
    }
  }
  return defaultProducts;
}

export function getTestimonialsSync(): Testimonial[] {
  if (typeof window === "undefined") return defaultTestimonials;
  
  const stored = localStorage.getItem("cajuta_testimonials_fallback");
  if (stored) {
    try {
      return JSON.parse(stored) as Testimonial[];
    } catch {
      return defaultTestimonials;
    }
  }
  return defaultTestimonials;
}

export function getFAQSnyc(): FAQItem[] {
  if (typeof window === "undefined") return defaultFAQ;
  
  const stored = localStorage.getItem("cajuta_faq_fallback");
  if (stored) {
    try {
      return JSON.parse(stored) as FAQItem[];
    } catch {
      return defaultFAQ;
    }
  }
  return defaultFAQ;
}