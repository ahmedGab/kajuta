"use client";

import { supabase } from "./supabase";
import { SiteContent, Product, Testimonial, FAQItem } from "./types";

const SITE_CONTENT_ID = "main";

export async function getSiteContent(): Promise<SiteContent | null> {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", SITE_CONTENT_ID)
      .single();

    if (error) {
      console.error("Error getting site content:", error);
      return null;
    }

    return data?.data as SiteContent | null;
  } catch (error) {
    console.error("Error getting site content:", error);
    return null;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: SITE_CONTENT_ID, data: content }, { onConflict: "id" });

    if (error) {
      console.error("Error saving site content:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving site content:", error);
    return false;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("data")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error getting products:", error);
      return [];
    }

    return data?.map((item) => item.data as Product) || [];
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    const newRecords = products.map((p) => ({
      id: p.id || `product_${Date.now()}_${Math.random()}`,
      data: p,
    }));

    const { error: fetchError, data: existingProducts } = await supabase
      .from("products")
      .select("id");

    if (fetchError) {
      console.error("Error fetching existing products:", fetchError);
      return false;
    }

    const existingIds = existingProducts?.map(p => p.id) || [];
    const newIds = newRecords.map(r => r.id);
    const toDelete = existingIds.filter(id => !newIds.includes(id));

    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .in("id", toDelete);
      
      if (deleteError) {
        console.error("Error deleting products:", deleteError);
      }
    }

    const { error } = await supabase.from("products").upsert(newRecords, { onConflict: "id" });

    if (error) {
      console.error("Error saving products:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving products:", error);
    return false;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("data")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error getting testimonials:", error);
      return [];
    }

    return data?.map((item) => item.data as Testimonial) || [];
  } catch (error) {
    console.error("Error getting testimonials:", error);
    return [];
  }
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

    if (error) {
      console.error("Error saving testimonials:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving testimonials:", error);
    return false;
  }
}

export async function getFAQ(): Promise<FAQItem[]> {
  try {
    const { data, error } = await supabase
      .from("faq")
      .select("data")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error getting FAQ:", error);
      return [];
    }

    return data?.map((item) => item.data as FAQItem) || [];
  } catch (error) {
    console.error("Error getting FAQ:", error);
    return [];
  }
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

    if (error) {
      console.error("Error saving FAQ:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving FAQ:", error);
    return false;
  }
}