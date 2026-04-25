import React from "react";
import { defaultFAQ } from "@/data/faq";

interface JsonLdProps {
  type: "FAQPage" | "Product";
  data?: any;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  let schema = {};

  if (type === "FAQPage") {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: defaultFAQ.map((item) => ({
        "@type": "Question",
        name: item.questionFr,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answerFr,
        },
      })),
    };
  } else if (type === "Product" && data) {
    schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name,
      image: data.image,
      description: data.description,
      offers: {
        "@type": "Offer",
        url: `https://cajuta.tn/produits/${data.slug}`,
        priceCurrency: "TND",
        price: data.price,
        availability: "https://schema.org/InStock",
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
