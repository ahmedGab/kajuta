"use client";

import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { SiteContent, Product, Testimonial, FAQItem } from "./types";

const SITE_CONTENT_ID = "cajuta";

export async function getSiteContent(): Promise<SiteContent | null> {
  try {
    const docRef = doc(db, "siteContent", SITE_CONTENT_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteContent;
    }
    return null;
  } catch (error) {
    console.error("Error getting site content:", error);
    return null;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  try {
    const docRef = doc(db, "siteContent", SITE_CONTENT_ID);
    await setDoc(docRef, content, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving site content:", error);
    return false;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, "products"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const docRef = doc(db, "products", product.id || `product_${i}`);
      await setDoc(docRef, { ...product, order: i }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error("Error saving products:", error);
    return false;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Testimonial);
  } catch (error) {
    console.error("Error getting testimonials:", error);
    return [];
  }
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  try {
    for (let i = 0; i < testimonials.length; i++) {
      const testimonial = testimonials[i];
      const docRef = doc(db, "testimonials", `testimonial_${i}`);
      await setDoc(docRef, { ...testimonial, order: i }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error("Error saving testimonials:", error);
    return false;
  }
}

export async function getFAQ(): Promise<FAQItem[]> {
  try {
    const q = query(collection(db, "faq"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as FAQItem);
  } catch (error) {
    console.error("Error getting FAQ:", error);
    return [];
  }
}

export async function saveFAQ(faq: FAQItem[]): Promise<boolean> {
  try {
    for (let i = 0; i < faq.length; i++) {
      const item = faq[i];
      const docRef = doc(db, "faq", `faq_${i}`);
      await setDoc(docRef, { ...item, order: i }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error("Error saving FAQ:", error);
    return false;
  }
}