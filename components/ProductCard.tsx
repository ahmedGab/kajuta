import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product, Language } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  language?: Language;
}

export default function ProductCard({ product, language = "fr" }: ProductCardProps) {
  const isRTL = language === "ar";
  const name = product.name?.[language] || product.name?.fr || product.name?.ar || "";
  const shortDesc = product.shortDescription?.[language] || product.shortDescription?.fr || product.shortDescription?.ar || "";
  const weight = product.weight?.[language] || product.weight?.fr || product.weight?.ar || "";
  
  return (
    <div className="card-premium group flex flex-col h-full bg-white relative">
      <Link href={`/produits/${product.slug}`} className="block relative aspect-square overflow-hidden bg-mint/20">
        <Image
          src={product.image || "https://images.unsplash.com/photo-1608039783021-6116a558f0dd?w=800&q=80"}
          alt={product.alt || name || "Produit Cajuta"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={`absolute top-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-chocolate shadow-sm ${isRTL ? 'right-4 left-auto' : 'left-4'}`}>
          {weight}
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-semibold mb-2 text-chocolate group-hover:text-green transition-colors">
          <Link href={`/produits/${product.slug}`}>{name}</Link>
        </h3>
        <p className="text-sm text-chocolate/70 mb-6 flex-grow line-clamp-2" style={{ direction: isRTL ? "rtl" : "ltr" }}>
          {shortDesc}
        </p>
        
        <div className={`flex items-center justify-between mt-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="font-display font-bold text-2xl text-caramel">
            {product.price} <span className="text-base text-chocolate/60">TND</span>
          </div>
          <a
            href={`https://wa.me/21650123456?text=${encodeURIComponent(isRTL ? `مرحبا، أريد طلب ${name}` : `Bonjour Cajuta, je veux commander: ${name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-mint text-green flex items-center justify-center hover:bg-green hover:text-white transition-colors duration-300"
            aria-label={isRTL ? `طلب ${name}` : `Commander ${name}`}
          >
            <ShoppingCart size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}