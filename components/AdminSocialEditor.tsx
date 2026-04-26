"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { SiteContent, SocialLinks } from "@/lib/types";
import { Save, MessageCircle } from "lucide-react";

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const MusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3"/>
  </svg>
);

export default function AdminSocialEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const [whatsappDisplay, setWhatsappDisplay] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [facebookDisplay, setFacebookDisplay] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramDisplay, setInstagramDisplay] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokDisplay, setTiktokDisplay] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [youtubeDisplay, setYoutubeDisplay] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      if (data?.footer?.socialLinks) {
        const social = data.footer.socialLinks;
        setWhatsappDisplay(social.whatsapp.display);
        setWhatsappPhone(social.whatsapp.phone || "");
        setFacebookDisplay(social.facebook.display);
        setFacebookUrl(social.facebook.url || "");
        setInstagramDisplay(social.instagram.display);
        setInstagramUrl(social.instagram.url || "");
        setTiktokDisplay(social.tiktok.display);
        setTiktokUrl(social.tiktok.url || "");
        setYoutubeDisplay(social.youtube.display);
        setYoutubeUrl(social.youtube.url || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!content) return;
    const newContent = { ...content };
    newContent.footer = {
      ...newContent.footer,
      socialLinks: {
        whatsapp: { display: whatsappDisplay, phone: whatsappPhone },
        facebook: { display: facebookDisplay, url: facebookUrl },
        instagram: { display: instagramDisplay, url: instagramUrl },
        tiktok: { display: tiktokDisplay, url: tiktokUrl },
        youtube: { display: youtubeDisplay, url: youtubeUrl },
      },
    };
    await db.saveSiteContent(newContent);
    setNotification("Réseaux sociaux sauvegardés !");
    setTimeout(() => setNotification(""), 3000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-green" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-chocolate">Réseaux Sociaux</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-lg hover:bg-olive transition-colors"
        >
          <Save size={18} />
          Sauvegarder
        </button>
      </div>

      {notification && (
        <div className="bg-green/10 text-green px-4 py-2 rounded-lg">{notification}</div>
      )}

      <div className="grid gap-6">
        {/* WhatsApp */}
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-green" size={24} />
              <span className="font-medium">WhatsApp</span>
            </div>
            <Toggle checked={whatsappDisplay} onChange={setWhatsappDisplay} />
          </div>
          {whatsappDisplay && (
            <input
              type="text"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="+21650123456"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green/50"
            />
          )}
        </div>

        {/* Facebook */}
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FacebookIcon />
              <span className="font-medium">Facebook</span>
            </div>
            <Toggle checked={facebookDisplay} onChange={setFacebookDisplay} />
          </div>
          {facebookDisplay && (
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/votrepage"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green/50"
            />
          )}
        </div>

        {/* Instagram */}
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <InstagramIcon />
              <span className="font-medium">Instagram</span>
            </div>
            <Toggle checked={instagramDisplay} onChange={setInstagramDisplay} />
          </div>
          {instagramDisplay && (
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/votrepage"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green/50"
            />
          )}
        </div>

        {/* TikTok */}
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <MusicIcon />
              <span className="font-medium">TikTok</span>
            </div>
            <Toggle checked={tiktokDisplay} onChange={setTiktokDisplay} />
          </div>
          {tiktokDisplay && (
            <input
              type="url"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://tiktok.com/@votrepage"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green/50"
            />
          )}
        </div>

        {/* YouTube */}
        <div className="bg-white p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <YoutubeIcon />
              <span className="font-medium">YouTube</span>
            </div>
            <Toggle checked={youtubeDisplay} onChange={setYoutubeDisplay} />
          </div>
          {youtubeDisplay && (
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@votrechaine"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green/50"
            />
          )}
        </div>
      </div>
    </div>
  );
}