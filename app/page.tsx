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

export default function Home() {
  return (
    <>
      <JsonLd type="FAQPage" />
      <div className="flex flex-col">
        <Hero />
        <TrustBar />
        <ProductsSection />
        <WhyChooseUs />
        <StorySection />
        <OccasionsSection />
        <PacksSection />
        <Testimonials />
        <DeliverySection />
        <FAQSection>
        <CTASection />
      </div>
    </>
  );
}
