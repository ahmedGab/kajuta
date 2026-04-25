"use client";

import { SiteContent, Product, Testimonial, FAQItem, SectionKey, Language } from "./types";
import { defaultSiteContent } from "@/data/siteContent";
import { defaultProducts } from "@/data/products";
import { defaultTestimonials, defaultFAQ } from "@/data/faq";

const CONTENT_STORAGE_KEY = "cajuta_site_content";
const PRODUCTS_STORAGE_KEY = "cajuta_products";
const TESTIMONIALS_STORAGE_KEY = "cajuta_testimonials";
const FAQ_STORAGE_KEY = "cajuta_faq";
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
  if (typeof window === "undefined") return defaultSiteContent;
  
  const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as SiteContent;
    } catch {
      return defaultSiteContent;
    }
  }
  return defaultSiteContent;
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
}

export function resetSiteContent(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(defaultSiteContent));
}

// Paragraph management with bilingual support
export function addParagraph(section: SectionKey, language: Language, paragraph: string): void {
  const content = getSiteContent();
  content[section].paragraphs[language].push(paragraph);
  saveSiteContent(content);
}

export function updateParagraph(section: SectionKey, language: Language, index: number, paragraph: string): void {
  const content = getSiteContent();
  if (content[section].paragraphs[language][index] !== undefined) {
    content[section].paragraphs[language][index] = paragraph;
    saveSiteContent(content);
  }
}

export function deleteParagraph(section: SectionKey, language: Language, index: number): void {
  const content = getSiteContent();
  if (content[section].paragraphs[language][index] !== undefined) {
    content[section].paragraphs[language].splice(index, 1);
    saveSiteContent(content);
  }
}

export function moveParagraph(section: SectionKey, language: Language, index: number, direction: "up" | "down"): void {
  const content = getSiteContent();
  const paragraphs = content[section].paragraphs[language];
  
  if (direction === "up" && index > 0) {
    const temp = paragraphs[index - 1];
    paragraphs[index - 1] = paragraphs[index];
    paragraphs[index] = temp;
  } else if (direction === "down" && index < paragraphs.length - 1) {
    const temp = paragraphs[index + 1];
    paragraphs[index + 1] = paragraphs[index];
    paragraphs[index] = temp;
  }
  
  saveSiteContent(content);
}

// Products
export function getProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return defaultProducts;
    }
  }
  return defaultProducts;
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function resetProducts(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  if (typeof window === "undefined") return defaultTestimonials;
  
  const stored = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Testimonial[];
    } catch {
      return defaultTestimonials;
    }
  }
  return defaultTestimonials;
}

export function saveTestimonials(testimonials: Testimonial[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
}

// FAQ
export function getFAQ(): FAQItem[] {
  if (typeof window === "undefined") return defaultFAQ;
  
  const stored = localStorage.getItem(FAQ_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as FAQItem[];
    } catch {
      return defaultFAQ;
    }
  }
  return defaultFAQ;
}

export function saveFAQ(faq: FAQItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faq));
}
