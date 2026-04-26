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
    const productName = typeof data.name === 'object' ? (data.name.fr || data.name.ar || '') : data.name;
    const productDesc = typeof data.description === 'object' ? (data.description.fr || data.description.ar || '') : data.description;
    schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      image: data.image,
      description: productDesc,
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