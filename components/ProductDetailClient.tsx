"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/storage";
import { Product } from "@/lib/types";
import JsonLd from "@/components/JsonLd";
import { ChevronRight, ShoppingCart, Check, Info } from "lucide-react";

export default function ProductDetailClient({ initialProduct, slug }: { initialProduct?: Product, slug: string }) {
  const [product, setProduct] = useState<Product | undefined>(initialProduct);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, check localStorage to see if there's an updated version or a newly added product
    const storedProducts = getProducts();
    const found = storedProducts.find((p) => p.slug === slug);
    if (found) {
      setProduct(found);
    }
  }, [slug]);

  if (!mounted) {
    if (!initialProduct) return null; // Avoid hydration mismatch on newly added products
  } else if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-display font-bold text-chocolate mb-4">Produit introuvable</h1>
        <p className="text-gray-500 mb-8">Ce produit n'existe malheureusement pas ou a été supprimé.</p>
        <Link href="/produits" className="btn-primary py-2 px-6">Retour aux produits</Link>
      </div>
    );
  }

  const p = product || initialProduct; // fallback during SSR
  if (!p) return null;

  const waMessage = `Bonjour Cajuta, je veux commander: ${p.name} (${p.weight})`;
  const waUrl = `https://wa.me/21650123456?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      <JsonLd type="Product" data={p} />
      <div className="bg-background min-h-screen py-10 md:py-20">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-chocolate/60 mb-10">
            <Link href="/" className="hover:text-caramel">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/produits" className="hover:text-caramel">Produits</Link>
            <ChevronRight size={14} />
            <span className="text-chocolate font-medium">{p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-mint/20 shadow-soft">
              <Image
                src={p.image || "https://images.unsplash.com/photo-1608039783021-6116a558f0dd?w=800&q=80"}
                alt={p.alt || p.name || "Produit Cajuta"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-chocolate shadow-sm">
                {p.weight}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-chocolate mb-4">
                {p.name}
              </h1>
              
              <div className="font-display font-bold text-4xl text-caramel mb-8">
                {p.price} <span className="text-xl text-chocolate/60 font-medium">TND</span>
              </div>
              
              <p className="text-lg text-chocolate/80 leading-relaxed mb-10">
                {p.description}
              </p>
              
              <div className="space-y-8 mb-10">
                {/* Ingredients */}
                {p.ingredients && p.ingredients.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-lg text-chocolate mb-4">
                    <Info size={20} className="text-green" />
                    Ingrédients
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {p.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-chocolate/70">
                        <Check size={18} className="text-mint shrink-0 mt-0.5" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                )}

                {/* Benefits */}
                {(p.benefits.length > 0 || p.occasions.length > 0) && (
                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-lg text-chocolate mb-4">
                    <Info size={20} className="text-green" />
                    Avantages & Occasions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {p.benefits.map((benefit, idx) => (
                      <span key={`ben-${idx}`} className="px-3 py-1.5 bg-white border border-mint rounded-full text-sm text-chocolate/70">
                        {benefit}
                      </span>
                    ))}
                    {p.occasions.map((occ, idx) => (
                      <span key={`occ-${idx}`} className="px-3 py-1.5 bg-honey/10 border border-honey/20 rounded-full text-sm text-caramel">
                        Spécial {occ}
                      </span>
                    ))}
                  </div>
                </div>
                )}
              </div>
              
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-4 px-8 text-lg w-full flex items-center justify-center shadow-green"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Commander sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
