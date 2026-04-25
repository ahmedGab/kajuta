"use client";

import { useEffect, useState } from "react";
import * as db from "@/lib/db";

export default function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const syncData = async () => {
      try {
        const [siteContent, products, testimonials, faq] = await Promise.all([
          db.getSiteContent(),
          db.getProducts(),
          db.getTestimonials(),
          db.getFAQ(),
        ]);

        if (siteContent) {
          localStorage.setItem("cajuta_site_content_fallback", JSON.stringify(siteContent));
          localStorage.setItem("cajuta_site_content", JSON.stringify(siteContent));
        }
        
        if (products && products.length > 0) {
          localStorage.setItem("cajuta_products_fallback", JSON.stringify(products));
          localStorage.setItem("cajuta_products", JSON.stringify(products));
        }
        
        if (testimonials && testimonials.length > 0) {
          localStorage.setItem("cajuta_testimonials_fallback", JSON.stringify(testimonials));
          localStorage.setItem("cajuta_testimonials", JSON.stringify(testimonials));
        }
        
        if (faq && faq.length > 0) {
          localStorage.setItem("cajuta_faq_fallback", JSON.stringify(faq));
          localStorage.setItem("cajuta_faq", JSON.stringify(faq));
        }

        setIsSynced(true);
      } catch (error) {
        console.error("Data sync error:", error);
        setIsSynced(true);
      }
    };

    syncData();
  }, []);

  if (!isSynced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-chocolate">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}