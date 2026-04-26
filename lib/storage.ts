"use client";

import { SiteContent, Product, Testimonial, FAQItem, Language } from "./types";
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

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  return await db.saveSiteContent(content);
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  return await db.saveProducts(products);
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  return await db.saveTestimonials(testimonials);
}

export async function saveFAQ(faq: FAQItem[]): Promise<boolean> {
  return await db.saveFAQ(faq);
}

export async function resetSiteContent(): Promise<void> {
  console.log("Re-run: npm run import-site-content");
}

export async function resetProducts(): Promise<void> {
  console.log("Re-run: npm run import-products");
}

export async function getSiteContentSync(): Promise<SiteContent | null> {
  return await db.getSiteContent();
}

export async function getProductsSync(): Promise<Product[]> {
  return await db.getProducts();
}

export async function getTestimonialsSync(): Promise<Testimonial[]> {
  return await db.getTestimonials();
}

export async function getFAQSnyc(): Promise<FAQItem[]> {
  return await db.getFAQ();
}