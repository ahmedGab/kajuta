"use client";

import { SiteContent, Product, Testimonial, FAQItem, SectionKey, Language } from "./types";
import { defaultSiteContent } from "@/data/siteContent";
import { defaultProducts } from "@/data/products";
import { defaultTestimonials, defaultFAQ } from "@/data/faq";
import * as db from "./db";

const CONTENT_STORAGE_KEY = "cajuta_site_content";
const PRODUCTS_STORAGE_KEY = "cajuta_products";
const TESTIMONIALS_STORAGE_KEY = "cajuta_testimonials";
const FAQ_STORAGE_KEY = "cajuta_faq";
const LANGUAGE_STORAGE_KEY = "cajuta_language";
const FIRESTORE_INITIALIZED_KEY = "cajuta_firestore_initialized";

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

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  if (typeof window === "undefined") return false;
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  return await db.saveSiteContent(content);
}

export function resetSiteContent(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(defaultSiteContent));
}

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

export async function saveProducts(products: Product[]): Promise<boolean> {
  if (typeof window === "undefined") return false;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return await db.saveProducts(products);
}

export function resetProducts(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
}

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

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  if (typeof window === "undefined") return false;
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
  return await db.saveTestimonials(testimonials);
}

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

export async function saveFAQ(faq: FAQItem[]): Promise<boolean> {
  if (typeof window === "undefined") return false;
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faq));
  return await db.saveFAQ(faq);
}

export async function syncToFirestore(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const siteContent = getSiteContent();
    await db.saveSiteContent(siteContent);

    const products = getProducts();
    await db.saveProducts(products);

    const testimonials = getTestimonials();
    await db.saveTestimonials(testimonials);

    const faq = getFAQ();
    await db.saveFAQ(faq);

    localStorage.setItem(FIRESTORE_INITIALIZED_KEY, "true");
    return { success: true, message: "Données synchronisées avec succès!" };
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, message: "Erreur lors de la synchronisation" };
  }
}

export function isFirestoreInitialized(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(FIRESTORE_INITIALIZED_KEY) === "true";
}