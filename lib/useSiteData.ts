"use client";

import { useState, useEffect } from "react";
import { SiteContent, Product, Testimonial, FAQItem } from "./types";
import { defaultSiteContent } from "@/data/siteContent";
import { defaultProducts } from "@/data/products";
import { defaultTestimonials, defaultFAQ } from "@/data/faq";
import * as db from "./db";

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
  const [products, setProducts] = useState<Product[]>(defaultProducts);
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
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
  const [faq, setFaq] = useState<FAQItem[]>(defaultFAQ);
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