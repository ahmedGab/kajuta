export type Language = "fr" | "ar";

export type LocalizedString = {
  fr: string;
  ar: string;
};

export type LocalizedParagraphs = {
  fr: string[];
  ar: string[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  price: number;
  weight: string;
  alt: string;
  ingredients: string[];
  benefits: string[];
  occasions: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type Testimonial = {
  id: string;
  firstName: string;
  city: string;
  rating: number;
  comment: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type Pack = {
  id: string;
  name: string;
  description: string;
  price: number;
  products: string[];
};

export type Occasion = {
  id: string;
  name: string;
  description: string;
};

export type SectionKey = "story" | "delivery" | "occasions" | "about";

export type SiteContent = {
  logo?: string;
  hero: {
    title: LocalizedString;
    subtitle: LocalizedString;
    image: string;
    primaryButton: LocalizedString;
    secondaryButton: LocalizedString;
  };
  trust: {
    items: LocalizedParagraphs;
  };
  story: {
    title: LocalizedString;
    paragraphs: LocalizedParagraphs;
    image?: string;
  };
  delivery: {
    title: LocalizedString;
    paragraphs: LocalizedParagraphs;
  };
  occasions: {
    title: LocalizedString;
    paragraphs: LocalizedParagraphs;
  };
  about: {
    title: LocalizedString;
    paragraphs: LocalizedParagraphs;
  };
  packs: {
    title: LocalizedString;
    items: Pack[];
  };
  finalCta: {
    title: LocalizedString;
    text: LocalizedString;
  };
};