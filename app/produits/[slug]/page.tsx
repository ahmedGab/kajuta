"use client";

import React, { useEffect, useState } from "react";
import ProductDetailClient from "@/components/ProductDetailClient";
import { Product } from "@/lib/types";
import * as db from "@/lib/db";

interface ProductDetailPageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const products = await db.getProducts();
        const found = products.find((p) => p.slug === params.slug);
        
        if (found) {
          setProduct(found);
        } else {
          setError("Produit introuvable");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-display font-bold text-chocolate mb-4">
          {error || "Produit introuvable"}
        </h1>
        <a href="/produits" className="btn-primary py-2 px-6">
          Retour aux produits
        </a>
      </div>
    );
  }

  return <ProductDetailClient initialProduct={product} slug={params.slug} />;
}