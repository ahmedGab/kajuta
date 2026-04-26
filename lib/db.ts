"use client";

import { supabase } from "./supabase";
import { SiteContent, Product, Testimonial, FAQItem } from "./types";

const SITE_CONTENT_ID = "main";

let contentPromise: Promise<SiteContent | null> | null = null;
let productsPromise: Promise<Product[]> | null = null;
let testimonialsPromise: Promise<Testimonial[]> | null = null;
let faqPromise: Promise<FAQItem[]> | null = null;

const createContentPromise = () => {
  const cached = localStorage.getItem("cajuta_site_content");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed) return Promise.resolve(parsed);
    } catch (e) {}
  }

  return (async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", SITE_CONTENT_ID)
        .single();

      if (error) return null;

      const content = data?.data as SiteContent | null;
      if (content) {
        localStorage.setItem("cajuta_site_content", JSON.stringify(content));
      }
      return content;
    } catch {
      return null;
    }
  })();
};

const createProductsPromise = () => {
  const cached = localStorage.getItem("cajuta_products");
  if (cached) {
    try {
      return Promise.resolve(JSON.parse(cached));
    } catch (e) {}
  }

  return (async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("data")
        .order("id", { ascending: true });

      if (error) return [];

      const products = data?.map((item) => item.data as Product) || [];
      localStorage.setItem("cajuta_products", JSON.stringify(products));
      return products;
    } catch {
      return [];
    }
  })();
};

const createTestimonialsPromise = () => {
  const cached = localStorage.getItem("cajuta_testimonials");
  if (cached) {
    try {
      return Promise.resolve(JSON.parse(cached));
    } catch (e) {}
  }

  return (async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("data")
        .order("id", { ascending: true });

      if (error) return [];

      const testimonials = data?.map((item) => item.data as Testimonial) || [];
      localStorage.setItem("cajuta_testimonials", JSON.stringify(testimonials));
      return testimonials;
    } catch {
      return [];
    }
  })();
};

const createFAQPromise = () => {
  const cached = localStorage.getItem("cajuta_faq");
  if (cached) {
    try {
      return Promise.resolve(JSON.parse(cached));
    } catch (e) {}
  }

  return (async () => {
    try {
      const { data, error } = await supabase
        .from("faq")
        .select("data")
        .order("id", { ascending: true });

      if (error) return [];

      const faq = data?.map((item) => item.data as FAQItem) || [];
      localStorage.setItem("cajuta_faq", JSON.stringify(faq));
      return faq;
    } catch {
      return [];
    }
  })();
};

export async function getSiteContent(): Promise<SiteContent | null> {
  if (!contentPromise) {
    contentPromise = createContentPromise();
  }
  return contentPromise;
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: SITE_CONTENT_ID, data: content }, { onConflict: "id" });

    if (error) return false;
    
    localStorage.setItem("cajuta_site_content", JSON.stringify(content));
    contentPromise = Promise.resolve(content);
    return true;
  } catch {
    return false;
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!productsPromise) {
    productsPromise = createProductsPromise();
  }
  return productsPromise;
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    const newRecords = products.map((p) => ({
      id: p.id || `product_${Date.now()}_${Math.random()}`,
      data: p,
    }));

    const { data: existingProducts } = await supabase.from("products").select("id");
    const existingIds = existingProducts?.map(p => p.id) || [];
    const newIds = newRecords.map(r => r.id);
    const toDelete = existingIds.filter(id => !newIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from("products").delete().in("id", toDelete);
    }

    const { error } = await supabase.from("products").upsert(newRecords, { onConflict: "id" });
    if (error) return false;
    
    localStorage.setItem("cajuta_products", JSON.stringify(products));
    productsPromise = Promise.resolve(products);
    return true;
  } catch {
    return false;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!testimonialsPromise) {
    testimonialsPromise = createTestimonialsPromise();
  }
  return testimonialsPromise;
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  try {
    const newRecords = testimonials.map((t) => ({
      id: t.id || `testimonial_${Date.now()}_${Math.random()}`,
      data: t,
    }));

    const { data: existing } = await supabase.from("testimonials").select("id");
    const existingIds = existing?.map(p => p.id) || [];
    const newIds = newRecords.map(r => r.id);
    const toDelete = existingIds.filter(id => !newIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from("testimonials").delete().in("id", toDelete);
    }

    const { error } = await supabase.from("testimonials").upsert(newRecords, { onConflict: "id" });
    if (error) return false;
    
    localStorage.setItem("cajuta_testimonials", JSON.stringify(testimonials));
    testimonialsPromise = Promise.resolve(testimonials);
    return true;
  } catch {
    return false;
  }
}

export async function getFAQ(): Promise<FAQItem[]> {
  if (!faqPromise) {
    faqPromise = createFAQPromise();
  }
  return faqPromise;
}

export async function saveFAQ(faq: FAQItem[]): Promise<boolean> {
  try {
    const newRecords = faq.map((f) => ({
      id: f.id || `faq_${Date.now()}_${Math.random()}`,
      data: f,
    }));

    const { data: existing } = await supabase.from("faq").select("id");
    const existingIds = existing?.map(p => p.id) || [];
    const newIds = newRecords.map(r => r.id);
    const toDelete = existingIds.filter(id => !newIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from("faq").delete().in("id", toDelete);
    }

    const { error } = await supabase.from("faq").upsert(newRecords, { onConflict: "id" });
    if (error) return false;
    
    localStorage.setItem("cajuta_faq", JSON.stringify(faq));
    faqPromise = Promise.resolve(faq);
    return true;
  } catch {
    return false;
  }
}