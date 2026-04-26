import React from "react";

interface JsonLdProps {
  type: "FAQPage" | "Product";
  data?: any;
  faqData?: any[];
}

export default function JsonLd({ type, data, faqData }: JsonLdProps) {
  let schema = {};

  if (type === "FAQPage" && faqData) {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((item: any) => ({
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