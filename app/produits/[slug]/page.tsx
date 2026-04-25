import React from "react";
import { defaultProducts } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = defaultProducts.find((p) => p.slug === params.slug);
  
  if (!product) {
    return { title: "Détails Produit | Cajuta" };
  }

  return {
    title: product.seoTitle || `${product.name} | Cajuta`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: [{ url: product.image || "https://images.unsplash.com/photo-1608039783021-6116a558f0dd?w=800&q=80" }],
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // We grab default product for initial SSR, but let Client sync with localStorage
  const defaultProduct = defaultProducts.find((p) => p.slug === params.slug);

  return <ProductDetailClient initialProduct={defaultProduct} slug={params.slug} />;
}
