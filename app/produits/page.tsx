"use client";

import React, { useEffect, useState } from "react";
import ProduitsClient from "@/components/ProduitsClient";
import { getLanguage } from "@/lib/storage";
import { Language, Product } from "@/lib/types";
import * as db from "@/lib/db";

export default function ProduitsPage() {
  const [language, setLanguage] = useState<Language>("fr");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(getLanguage());
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        const supabaseProducts = await db.getProducts();
        if (supabaseProducts && supabaseProducts.length > 0) {
          setProducts(supabaseProducts);
        } else {
          setError("Aucun produit trouvé. Exécutez 'npm run import-products' pour importer les produits.");
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Erreur lors du chargement des produits");
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
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit disponible.</p>
          </div>
        ) : (
          <ProduitsClient initialProducts={products} />
        )}
      </div>
    </div>
  );
}