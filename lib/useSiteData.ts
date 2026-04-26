"use client";

import { useState, useEffect } from "react";
import { SiteContent, Product, Testimonial, FAQItem } from "./types";
import * as db from "./db";

const defaultSiteContent: SiteContent = {
  visibility: {
    hero: true,
    trustBar: true,
    products: true,
    whyChooseUs: true,
    story: true,
    occasions: true,
    packs: true,
    testimonials: true,
    delivery: true,
    faq: true,
    cta: true,
  },
  hero: { title: { fr: "", ar: "" }, subtitle: { fr: "", ar: "" }, image: "", primaryButton: { fr: "", ar: "" }, secondaryButton: { fr: "", ar: "" } },
  trust: { items: { fr: [], ar: [] } },
  story: { title: { fr: "", ar: "" }, paragraphs: { fr: [], ar: [] }, image: "" },
  delivery: { title: { fr: "", ar: "" }, paragraphs: { fr: [], ar: [] } },
  occasions: { title: { fr: "", ar: "" }, paragraphs: { fr: [], ar: [] } },
  about: { title: { fr: "", ar: "" }, paragraphs: { fr: [], ar: [] } },
  packs: { title: { fr: "", ar: "" }, paragraphs: { fr: [], ar: [] }, items: [] },
  footer: { description: { fr: "", ar: "" }, quickLinks: { title: { fr: "", ar: "" }, links: [] }, deliveryZones: { title: { fr: "", ar: "" }, zones: [] }, contact: { title: { fr: "", ar: "" }, address: { fr: "", ar: "" }, phone: { fr: "", ar: "" }, email: { fr: "", ar: "" } }, paragraphs: { fr: [], ar: [] } },
  finalCta: { title: { fr: "", ar: "" }, text: { fr: "", ar: "" }, button: { fr: "", ar: "" } },
  images: {},
  sectionOrder: [],
  customSections: []
};

export function useSiteContent() {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabaseData = await db.getSiteContent();
        if (supabaseData) {
          setSiteContent(supabaseData);
        }
      } catch (error) {
        console.error("Error loading site content:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { siteContent, loading };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const supabaseProducts = await db.getProducts();
        if (supabaseProducts && supabaseProducts.length > 0) {
          setProducts(supabaseProducts);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return { products, loading };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const supabaseData = await db.getTestimonials();
        if (supabaseData && supabaseData.length > 0) {
          setTestimonials(supabaseData);
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return { testimonials, loading };
}

export function useFAQ() {
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const supabaseData = await db.getFAQ();
        if (supabaseData && supabaseData.length > 0) {
          setFaq(supabaseData);
        }
      } catch (error) {
        console.error("Error loading FAQ:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFAQ();
  }, []);

  return { faq, loading };
}