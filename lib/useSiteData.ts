"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteContent, Product, Testimonial, FAQItem } from "./types";
import { defaultSiteContent } from "@/data/siteContent";
import { defaultProducts } from "@/data/products";
import { defaultTestimonials, defaultFAQ } from "@/data/faq";
import { getSiteContent as getFromSupabase, getProducts as getProductsFromSupabase, getTestimonials as getTestimonialsFromSupabase, getFAQ as getFAQFromSupabase } from "./db";

const CONTENT_STORAGE_KEY = "cajuta_site_content";
const PRODUCTS_STORAGE_KEY = "cajuta_products";
const TESTIMONIALS_STORAGE_KEY = "cajuta_testimonials";
const FAQ_STORAGE_KEY = "cajuta_faq";
const DATA_SYNCED_KEY = "cajuta_data_synced";

export function useSiteContent() {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // First try to load from Supabase
        const supabaseData = await getFromSupabase();
        
        if (supabaseData) {
          // Save to localStorage for future use
          localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(supabaseData));
          setSiteContent(supabaseData);
        } else {
          // Fall back to localStorage
          const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
          if (stored) {
            try {
              setSiteContent(JSON.parse(stored));
            } catch {
              setSiteContent(defaultSiteContent);
            }
          } else {
            // Use default and save it
            localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(defaultSiteContent));
            setSiteContent(defaultSiteContent);
          }
        }
      } catch (error) {
        console.error("Error loading site content:", error);
        // Fall back to localStorage
        const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
        if (stored) {
          try {
            setSiteContent(JSON.parse(stored));
          } catch {
            setSiteContent(defaultSiteContent);
          }
        } else {
          setSiteContent(defaultSiteContent);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateSiteContent = useCallback((newContent: SiteContent) => {
    setSiteContent(newContent);
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(newContent));
  }, []);

  return { siteContent, loading, updateSiteContent };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const supabaseProducts = await getProductsFromSupabase();
        
        if (supabaseProducts && supabaseProducts.length > 0) {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(supabaseProducts));
          setProducts(supabaseProducts);
        } else {
          const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
          if (stored) {
            try {
              setProducts(JSON.parse(stored));
            } catch {
              setProducts(defaultProducts);
            }
          } else {
            setProducts(defaultProducts);
          }
        }
      } catch (error) {
        console.error("Error loading products:", error);
        const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (stored) {
          try {
            setProducts(JSON.parse(stored));
          } catch {
            setProducts(defaultProducts);
          }
        } else {
          setProducts(defaultProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const updateProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
  }, []);

  return { products, loading, updateProducts };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const supabaseData = await getTestimonialsFromSupabase();
        
        if (supabaseData && supabaseData.length > 0) {
          localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(supabaseData));
          setTestimonials(supabaseData);
        } else {
          const stored = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
          if (stored) {
            try {
              setTestimonials(JSON.parse(stored));
            } catch {
              setTestimonials(defaultTestimonials);
            }
          } else {
            setTestimonials(defaultTestimonials);
          }
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
        const stored = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
        if (stored) {
          try {
            setTestimonials(JSON.parse(stored));
          } catch {
            setTestimonials(defaultTestimonials);
          }
        } else {
          setTestimonials(defaultTestimonials);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const updateTestimonials = useCallback((newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(newTestimonials));
  }, []);

  return { testimonials, loading, updateTestimonials };
}

export function useFAQ() {
  const [faq, setFaq] = useState<FAQItem[]>(defaultFAQ);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const supabaseData = await getFAQFromSupabase();
        
        if (supabaseData && supabaseData.length > 0) {
          localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(supabaseData));
          setFaq(supabaseData);
        } else {
          const stored = localStorage.getItem(FAQ_STORAGE_KEY);
          if (stored) {
            try {
              setFaq(JSON.parse(stored));
            } catch {
              setFaq(defaultFAQ);
            }
          } else {
            setFaq(defaultFAQ);
          }
        }
      } catch (error) {
        console.error("Error loading FAQ:", error);
        const stored = localStorage.getItem(FAQ_STORAGE_KEY);
        if (stored) {
          try {
            setFaq(JSON.parse(stored));
          } catch {
            setFaq(defaultFAQ);
          }
        } else {
          setFaq(defaultFAQ);
        }
      } finally {
        setLoading(false);
      }
    };

    loadFAQ();
  }, []);

  const updateFAQ = useCallback((newFaq: FAQItem[]) => {
    setFaq(newFaq);
    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(newFaq));
  }, []);

  return { faq, loading, updateFAQ };
}

// Sync all data from Supabase to localStorage
export async function syncAllDataFromSupabase() {
  try {
    const [siteContent, products, testimonials, faq] = await Promise.all([
      getFromSupabase(),
      getProductsFromSupabase(),
      getTestimonialsFromSupabase(),
      getFAQFromSupabase(),
    ]);

    if (siteContent) {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(siteContent));
    }
    if (products && products.length > 0) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
    if (testimonials && testimonials.length > 0) {
      localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
    }
    if (faq && faq.length > 0) {
      localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faq));
    }

    localStorage.setItem(DATA_SYNCED_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error("Error syncing data from Supabase:", error);
    return false;
  }
}