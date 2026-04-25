"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  // Numéro tunisien fictif
  const phoneNumber = "21650123456";
  const defaultMessage = "Bonjour Cajuta, je voudrais avoir plus d'informations sur vos produits.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 p-4 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}
