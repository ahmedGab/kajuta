import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const InstagramIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const FacebookIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;


export default function Footer() {
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
              Fruits secs caramélisés en Tunisie. Une expérience artisanale, gourmande et premium pour sublimer vos moments de partage.
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
            <h3 className="font-display font-semibold text-lg mb-5 text-white">Liens Rapides</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-mint hover:text-honey transition-colors">Accueil</Link></li>
              <li><Link href="/produits" className="text-mint hover:text-honey transition-colors">Nos Produits</Link></li>
              <li><Link href="/a-propos" className="text-mint hover:text-honey transition-colors">Notre Histoire</Link></li>
              <li><Link href="/faq" className="text-mint hover:text-honey transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Targeted Cities */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-5 text-white">Nos Zones de Livraison</h3>
            <ul className="space-y-3">
              <li className="text-mint flex items-center gap-2"><MapPin size={16} /> Tunis & Banlieue</li>
              <li className="text-mint flex items-center gap-2"><MapPin size={16} /> Sfax</li>
              <li className="text-mint flex items-center gap-2"><MapPin size={16} /> Sousse & Monastir</li>
              <li className="text-mint flex items-center gap-2"><MapPin size={16} /> Nabeul & Hammamet</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-5 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="text-mint flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-0.5 text-honey" />
                <span>Atelier Artisanal<br/>Tunis, Tunisie</span>
              </li>
              <li className="text-mint flex items-center gap-3">
                <Phone size={20} className="shrink-0 text-honey" />
                <span>+216 50 123 456</span>
              </li>
              <li className="text-mint flex items-center gap-3">
                <Mail size={20} className="shrink-0 text-honey" />
                <span>contact@cajuta.tn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-olive pt-8 text-center sm:flex sm:justify-between sm:items-center">
          <p className="text-mint/80 text-sm mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Cajuta. Tous droits réservés. Fruits secs caramélisés Tunisie.
          </p>
          <div className="flex justify-center flex-wrap gap-4 text-sm text-mint/80">
            <Link href="#" className="hover:text-honey">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-honey">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
