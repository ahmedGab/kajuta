"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import * as db from "@/lib/db";
import { getLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";

const InstagramIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const FacebookIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;

export default function Footer() {
  const [content, setContent] = useState<any>(null);
  const [lang, setLang] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.footer) {
        setContent(data.footer);
      }
    });
  }, []);

  if (!mounted || !content) {
    return <footer className="bg-green text-white pt-16 pb-8"></footer>;
  }

  return (
    <footer className="bg-green text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-3xl tracking-tight text-white">
                CAJUTA<span className="text-honey">.</span>
              </span>
            </Link>
            <p className="text-mint text-sm leading-relaxed mb-6">
              {content.description?.[lang]}
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-olive/50 flex items-center justify-center hover:bg-caramel transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-olive/50 flex items-center justify-center hover:bg-caramel transition-colors">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-5 text-white">{content.quickLinks?.title?.[lang]}</h3>
            <ul className="space-y-3">
              {(content.quickLinks?.links || []).map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.href} className="text-mint hover:text-honey transition-colors">{link.label?.[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Targeted Cities */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-5 text-white">{content.deliveryZones?.title?.[lang]}</h3>
            <ul className="space-y-3">
              {(content.deliveryZones?.zones || []).map((zone: any, idx: number) => (
                <li key={idx} className="text-mint flex items-center gap-2"><MapPin size={16} /> {zone?.[lang]}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-5 text-white">{content.contact?.title?.[lang]}</h3>
            <ul className="space-y-4">
              <li className="text-mint flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-0.5 text-honey" />
                <span style={{ whiteSpace: "pre-line" }}>{content.contact?.address?.[lang]}</span>
              </li>
              <li className="text-mint flex items-center gap-3">
                <Phone size={20} className="shrink-0 text-honey" />
                <span>{content.contact?.phone?.[lang]}</span>
              </li>
              <li className="text-mint flex items-center gap-3">
                <Mail size={20} className="shrink-0 text-honey" />
                <span>{content.contact?.email?.[lang]}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-olive pt-8 text-center sm:flex sm:flex-col sm:items-center gap-2">
          {(content.paragraphs?.[lang] || []).map((para: string, idx: number) => (
            <p key={idx} className="text-mint/80 text-sm">{para}</p>
          ))}
          <div className="flex justify-center flex-wrap gap-4 text-sm text-mint/80 mt-2">
            <Link href="#" className="hover:text-honey">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-honey">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}