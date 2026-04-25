"use client";

import React, { useEffect, useState } from "react";
import JsonLd from "../components/JsonLd";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductsSection from "@/components/ProductsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import StorySection from "@/components/StorySection";
import OccasionsSection from "@/components/OccasionsSection";
import PacksSection from "@/components/PacksSection";
import Testimonials from "@/components/Testimonials";
import DeliverySection from "@/components/DeliverySection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import CustomSectionsRenderer from "@/components/CustomSectionsRenderer";
import { SectionVisibility, SiteContent } from "@/lib/types";
import { defaultSiteContent } from "@/data/siteContent";
import * as db from "@/lib/db";

const defaultVisibility: SectionVisibility = {
  hero: true,
  trustBar: true,
  products: true,
  whyChooseUs: true,
  story: true,
  occasions: true,
  packs: true,
  testimonials: true,
  delivery: true,
  faq: true,
  cta: true,
};

const defaultOrder = [
  { key: "hero", label: "Hero" },
  { key: "trustBar", label: "TrustBar" },
  { key: "products", label: "Products" },
  { key: "whyChooseUs", label: "WhyChooseUs" },
  { key: "story", label: "Story" },
  { key: "occasions", label: "Occasions" },
  { key: "packs", label: "Packs" },
  { key: "testimonials", label: "Testimonials" },
  { key: "delivery", label: "Delivery" },
  { key: "faq", label: "FAQ" },
  { key: "cta", label: "CTA" },
];

type SectionOrderItem = { key: string; label: string };

const sectionComponents: Record<string, React.ReactNode> = {
  hero: <Hero />,
  trustBar: <TrustBar />,
  products: <ProductsSection />,
  whyChooseUs: <WhyChooseUs />,
  story: <StorySection />,
  occasions: <OccasionsSection />,
  packs: <PacksSection />,
  testimonials: <Testimonials />,
  delivery: <DeliverySection />,
  faq: <FAQSection />,
  cta: <CTASection />,
};

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [visibility, setVisibility] = useState<SectionVisibility | null>(null);
  const [sectionOrder, setSectionOrder] = useState<SectionOrderItem[]>(defaultOrder);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadContent = async () => {
      try {
        const supabaseContent = await db.getSiteContent();
        if (supabaseContent) {
          setContent(supabaseContent);
          setVisibility(supabaseContent.visibility || defaultVisibility);
          
          const storedOrder = supabaseContent.sectionOrder as SectionOrderItem[] | undefined;
          if (storedOrder && storedOrder.length > 0) {
            setSectionOrder(storedOrder);
          }
        }
      } catch (error) {
        console.error("Error loading content:", error);
        setVisibility(defaultVisibility);
      }
    };

    loadContent();
  }, []);

  if (!mounted || visibility === null) {
    return <div style={{ display: 'none' }}></div>;
  }

  const renderSection = (key: string) => {
    if (key === "custom") return <CustomSectionsRenderer />;
    if (!visibility[key as keyof SectionVisibility]) return null;
    return sectionComponents[key];
  };

  return (
    <>
      <JsonLd type="FAQPage" />
      <div className="flex flex-col">
        {sectionOrder.map((item, idx) => (
          <React.Fragment key={`${item.key}-${idx}`}>
            {renderSection(item.key)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}