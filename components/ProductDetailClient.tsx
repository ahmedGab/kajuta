"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, Language } from "@/lib/types";
import JsonLd from "@/components/JsonLd";
import { ChevronRight, ShoppingCart, Check, Info } from "lucide-react";
import { getLanguage } from "@/lib/storage";

interface ProductDetailClientProps {
  initialProduct: Product;
  slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
  const p = initialProduct;
  const [language] = useState<Language>(getLanguage());
  const isRTL = language === "ar";

  const getLocalized = (obj: { fr?: string; ar?: string } | undefined, fallback = "") => {
    if (!obj) return fallback;
    return obj[language] || obj.fr || obj.ar || fallback;
  };
  
  if (!p) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-display font-bold text-chocolate mb-4">Produit introuvable</h1>
        <p className="text-gray-500 mb-8">Ce produit n'existe malheureusement pas ou a été supprimé.</p>
        <Link href="/produits" className="btn-primary py-2 px-6">Retour aux produits</Link>
      </div>
    );
  }

  const waMessage = isRTL 
    ? `مرحبا، أريد طلب: ${getLocalized(p.name)} (${getLocalized(p.weight)})`
    : `Bonjour Cajuta, je veux commander: ${getLocalized(p.name)} (${getLocalized(p.weight)})`;
  const waUrl = `https://wa.me/21650123456?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      <JsonLd type="Product" data={p} />
      <div className="bg-background min-h-screen py-10 md:py-20">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-chocolate/60 mb-10">
            <Link href="/" className="hover:text-caramel transition-colors">
              <ChevronRight size={16} className="rotate-180" />
            </Link>
            <Link href="/" className="hover:text-caramel transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-caramel transition-colors">Produits</Link>
            <span>/</span>
            <span className="text-chocolate font-medium">{getLocalized(p.name)}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.alt || getLocalized(p.name)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-cream flex items-center justify-center">
                  <span className="text-chocolate/40 text-lg">Pas d'image</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-sm text-caramel font-medium mb-3 uppercase tracking-wider">{getLocalized(p.weight)}</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-chocolate mb-4">{getLocalized(p.name)}</h1>
              <p className="text-lg text-chocolate/70 mb-6">{getLocalized(p.shortDescription)}</p>

              {/* Benefits */}
              {p.benefits && p.benefits.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-chocolate mb-3 flex items-center gap-2">
                    <Check size={18} className="text-green" />
                    Ce qui rend ce produit special
                  </h3>
                  <ul className="space-y-2">
                    {p.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-chocolate/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-green"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Occasions */}
              {p.occasions && p.occasions.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-chocolate mb-3 flex items-center gap-2">
                    <Info size={18} className="text-caramel" />
                    Parfait pour
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {p.occasions.map((occasion, index) => (
                      <span key={index} className="px-3 py-1 bg-cream rounded-full text-sm text-chocolate">
                        {occasion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {p.ingredients && p.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-chocolate mb-3">Ingredients</h3>
                  <p className="text-sm text-chocolate/70">{p.ingredients.join(", ")}</p>
                </div>
              )}

              {/* CTA Button */}
              <div className="mt-auto">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={22} />
                  Commander sur WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {p.description && (
            <div className="mt-16 pt-16 border-t border-gray-200">
              <h2 className="text-2xl font-display font-bold text-chocolate mb-6">Description</h2>
              <div className="prose prose-chocolate max-w-none">
                <p className="text-chocolate/80 leading-relaxed whitespace-pre-line">{getLocalized(p.description)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}