import { FAQItem, Testimonial } from "@/lib/types";

export const defaultTestimonials: Testimonial[] = [
  {
    id: "t1",
    firstName: "Amira",
    city: "Tunis",
    rating: 5,
    comment: "Excellent ! Les noix de cajou caramélisées sont un pur délice. Emballage très premium, parfait pour offrir pendant le Ramadan."
  },
  {
    id: "t2",
    firstName: "Sami",
    city: "Sfax",
    rating: 5,
    comment: "Livraison rapide et produit de très haute qualité. Les pistaches sont exceptionnelles, on sent vraiment le fait-maison."
  },
  {
    id: "t3",
    firstName: "Yasmine",
    city: "Sousse",
    rating: 4,
    comment: "Le Mix Cajuta a eu un succès fou auprès de mes invités. Le caramel est croquant et pas trop sucré. Je recommanderai avec plaisir."
  }
];

export const defaultFAQ: FAQItem[] = [
  {
    id: "f1",
    question: "Où livrez-vous ?",
    answer: "Nous livrons partout en Tunisie ! Tunis, Sfax, Sousse, Bizerte, Nabeul et toutes les autres régions du pays avec nos partenaires de livraison rapides."
  },
  {
    id: "f2",
    question: "Comment puis-je passer commande ?",
    answer: "C'est très simple : parcourez notre site, choisissez les produits ou packs qui vous plaisent et cliquez sur 'Commander sur WhatsApp'. Nous prendrons en charge votre commande rapidement."
  },
  {
    id: "f3",
    question: "Combien de temps se conservent les produits ?",
    answer: "Nos fruits secs caramélisés se conservent jusqu'à 6 mois dans un endroit sec, à l'abri de l'humidité et de la chaleur grâce à nos sachets refermables qui préservent leur croquant."
  },
  {
    id: "f4",
    question: "Proposez-vous des coffrets cadeaux ?",
    answer: "Absolument. Nous proposons des packs et des coffrets spéciaux pour l'Aïd, le Ramadan et les grandes occasions avec un packaging luxueux."
  }
];
