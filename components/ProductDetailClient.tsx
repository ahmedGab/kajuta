"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsSync } from "@/lib/storage";
import { Product } from "@/lib/types";
import JsonLd from "@/components/JsonLd";
import { ChevronRight, ShoppingCart, Check, Info } from "lucide-react";
import * as db from "@/lib/db";

export default function ProductDetailClient({ initialProduct, slug }: { initialProduct?: Product, slug: string }) {
  const [product, setProduct] = useState<Product | undefined>(initialProduct);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadProduct = async () => {
      try {
        const supabaseProducts = await db.getProducts();
        if (supabaseProducts && supabaseProducts.length > 0) {
          const found = supabaseProducts.find((p: Product) => p.slug === slug);
          if (found) {
            setProduct(found);
          }
        } else {
          // Fallback to localStorage
          const storedProducts = getProductsSync();
          const found = storedProducts.find((p) => p.slug === slug);
          if (found) {
            setProduct(found);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        // Fallback to localStorage
        const storedProducts = getProductsSync();
        const found = storedProducts.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
        }
      }
    };

    loadProduct();
  }, [slug]);

  if (!mounted) {
    if (!initialProduct) return null;
  } else if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-display font-bold text-chocolate mb-4">Produit introuvable</h1>
        <p className="text-gray-500 mb-8">Ce produit n'existe malheureusement pas ou a été supprimé.</p>
        <Link href="/produits" className="btn-primary py-2 px-6">Retour aux produits</Link>
      </div>
    );
  }

  const p = product || initialProduct;
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
            <Link href="/" className="hover:text-caramel transition-colors">
              <ChevronRight size={16} className="rotate-180" />
            </Link>
            <Link href="/" className="hover:text-caramel transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-caramel transition-colors">Produits</Link>
            <span>/</span>
            <span className="text-chocolate font-medium">{p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.alt || p.name}
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
              <span className="text-sm text-caramel font-medium mb-3 uppercase tracking-wider">{p.weight}</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-chocolate mb-4">{p.name}</h1>
              <p className="text-lg text-chocolate/70 mb-6">{p.shortDescription}</p>
              
              <div className="text-3xl font-bold text-green mb-8">{p.price} TND</div>

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
                <p className="text-chocolate/80 leading-relaxed whitespace-pre-line">{p.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}