"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import * as db from "@/lib/db";
import { Product, Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getProducts().then((data) => {
      setProducts((data || []).slice(0, 4));
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || products.length === 0) {
    return <div className="py-20 bg-background"></div>;
  }

  return (
    <section className="section-padding bg-background relative" id="produits">
      <div className="container-custom">
        <div className={`flex flex-col md:flex-row justify-between items-end mb-12 gap-6 ${isRTL ? 'md:flex-row-reverse text-right' : ''}`}>
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-caramel/10 text-caramel font-semibold text-sm mb-4">
              {isRTL ? "مجموعتنا" : "Notre Collection"}
            </span>
            <h2 
              className="text-3xl md:text-5xl font-display font-bold text-chocolate"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {isRTL ? "لذة مطلقة" : "Gourmandise Absolue"}
            </h2>
          </div>
          <Link 
            href="/produits" 
            className={`group flex items-center gap-2 font-medium text-green hover:text-olive transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? "عرض جميع المنتجات" : "Voir tous les produits"} 
            <ArrowRight size={20} className={`group-hover:translate-x-1 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}