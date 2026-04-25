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
import { getSiteContent } from "@/lib/storage";
import { SectionVisibility } from "@/lib/types";

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
  "hero", "trustBar", "products", "whyChooseUs", "story", "occasions", "packs", "testimonials", "delivery", "faq", "cta"
];

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
  const [visibility, setVisibility] = useState<SectionVisibility | null>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>(defaultOrder);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const content = getSiteContent();
    setVisibility(content.visibility || defaultVisibility);
    setSectionOrder(content.sectionOrder || defaultOrder);
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
        {sectionOrder.map((key) => (
          <React.Fragment key={key}>
            {renderSection(key)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}