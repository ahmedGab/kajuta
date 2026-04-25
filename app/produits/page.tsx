"use client";

import React, { useEffect, useState } from "react";
import ProduitsClient from "@/components/ProduitsClient";
import { defaultProducts } from "@/data/products";
import { getLanguage } from "@/lib/storage";
import { Language, Product } from "@/lib/types";
import * as db from "@/lib/db";

export default function ProduitsPage() {
  const [language, setLanguage] = useState<Language>("fr");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLanguage(getLanguage());
    
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

  const isRTL = language === "ar";

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container-custom">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${isRTL ? 'text-right' : ''}`}>
          <h1 
            className="text-4xl md:text-5xl font-display font-bold text-chocolate mb-6"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {language === "ar" ? "مجموعتنا" : "Notre Collection"}
          </h1>
          <p 
            className="text-lg text-chocolate/70"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {language === "ar" 
              ? "اكتشف لذيذاتنا. فواكة جافة من الدرجةالاولى، مكرملة بشغف في ورشتنا."
              : "Découvrez nos créations gourmandes. Des fruits secs de premier choix, caramélisés avec passion dans notre atelier."
            }
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProduitsClient initialProducts={products} />
        )}
      </div>
    </div>
  );
}