"use client";

import { useEffect, useState } from "react";
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

export default function Home() {
  const [visibility, setVisibility] = useState<SectionVisibility>(defaultVisibility);

  useEffect(() => {
    const content = getSiteContent();
    if (content.visibility) {
      setVisibility(content.visibility);
    }
  }, []);

  return (
    <>
      <JsonLd type="FAQPage" />
      <div className="flex flex-col">
        {visibility.hero && <Hero />}
        {visibility.trustBar && <TrustBar />}
        {visibility.products && <ProductsSection />}
        {visibility.whyChooseUs && <WhyChooseUs />}
        {visibility.story && <StorySection />}
        {visibility.occasions && <OccasionsSection />}
        {visibility.packs && <PacksSection />}
        {visibility.testimonials && <Testimonials />}
        {visibility.delivery && <DeliverySection />}
        {visibility.faq && <FAQSection />}
        {visibility.cta && <CTASection />}
      </div>
    </>
  );
}