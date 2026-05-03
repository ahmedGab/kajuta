"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { Language, SiteContent } from "@/lib/types";
import { Save, Globe, Eye, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminHeroEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("fr");
  const [previewLanguage, setPreviewLanguage] = useState<Language>("fr");
  const [notification, setNotification] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitleFr, setSubtitleFr] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [primaryButtonFr, setPrimaryButtonFr] = useState("");
  const [primaryButtonAr, setPrimaryButtonAr] = useState("");
  const [secondaryButtonFr, setSecondaryButtonFr] = useState("");
  const [secondaryButtonAr, setSecondaryButtonAr] = useState("");
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      if (data?.hero) {
        setTitleFr(data.hero.title?.fr || "");
        setTitleAr(data.hero.title?.ar || "");
        setSubtitleFr(data.hero.subtitle?.fr || "");
        setSubtitleAr(data.hero.subtitle?.ar || "");
        setPrimaryButtonFr(data.hero.primaryButton?.fr || "");
        setPrimaryButtonAr(data.hero.primaryButton?.ar || "");
        setSecondaryButtonFr(data.hero.secondaryButton?.fr || "");
        setSecondaryButtonAr(data.hero.secondaryButton?.ar || "");
        setHeroImage(data.hero.image || "");
      }
      setLoading(false);
    });
  }, []);

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, "_") : "uploaded_file";
    const filename = `${uniqueSuffix}-${safeName}`;

    const { data, error } = await supabase.storage.from("images").upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filename);

    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFileToSupabase(file);
      setHeroImage(url);
      setNotification("Image hero téléchargée avec succès. N'oubliez pas de sauvegarder !");
    } catch (err: any) {
      setNotification(`Erreur lors de l'upload: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    const newContent = {
      ...content,
      hero: {
        ...content.hero,
        title: { fr: titleFr, ar: titleAr },
        subtitle: { fr: subtitleFr, ar: subtitleAr },
        primaryButton: { fr: primaryButtonFr, ar: primaryButtonAr },
        secondaryButton: { fr: secondaryButtonFr, ar: secondaryButtonAr },
        image: heroImage,
      },
    };
    const success = await db.saveSiteContent(newContent);
    if (success) {
      setNotification("Section Hero sauvegardée avec succès !");
    } else {
      setNotification("Erreur lors de la sauvegarde");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {notification && (
        <div
          className={`px-4 py-3 rounded-lg border ${
            notification.includes("succès")
              ? "bg-green/10 text-green border-green/20"
              : "bg-red-10 text-red border-red-20"
          }`}
        >
          {notification}
        </div>
      )}

      {/* Language Selector for Editing */}
      <div className="bg-green/5 p-4 rounded-xl border border-green/20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="text-green w-5 h-5" />
            <span className="font-semibold text-gray-700">Langue à modifier :</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage("fr")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedLanguage === "fr"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Français
            </button>
            <button
              onClick={() => setSelectedLanguage("ar")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedLanguage === "ar"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Arabe
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Image Hero</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green file:text-white hover:file:bg-green/90 mb-4"
        />
        <label className="block text-sm font-semibold mb-2">Ou collez l'URL de l'image</label>
        <input
          type="text"
          value={heroImage}
          onChange={(e) => setHeroImage(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
        />
        {heroImage && (
          <div className="mt-4">
            <img src={heroImage} alt="Hero Preview" className="max-h-48 rounded-lg object-cover" />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Titre</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Français</label>
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Arabe</label>
            <input
              type="text"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Sous-titre</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Français</label>
            <textarea
              value={subtitleFr}
              onChange={(e) => setSubtitleFr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50 min-h-[100px]"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Arabe</label>
            <textarea
              value={subtitleAr}
              onChange={(e) => setSubtitleAr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50 min-h-[100px]"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Primary Button */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Bouton principal</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Français</label>
            <input
              type="text"
              value={primaryButtonFr}
              onChange={(e) => setPrimaryButtonFr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Arabe</label>
            <input
              type="text"
              value={primaryButtonAr}
              onChange={(e) => setPrimaryButtonAr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Secondary Button */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Bouton secondaire</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Français</label>
            <input
              type="text"
              value={secondaryButtonFr}
              onChange={(e) => setSecondaryButtonFr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Arabe</label>
            <input
              type="text"
              value={secondaryButtonAr}
              onChange={(e) => setSecondaryButtonAr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green/90 transition-colors"
      >
        <Save size={20} />
        Sauvegarder la section Hero
      </button>

      {/* Preview */}
      <div className="bg-green/5 p-4 rounded-xl border border-green/20">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="text-green w-5 h-5" />
            <span className="font-semibold text-gray-700">Prévisualisation :</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewLanguage("fr")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                previewLanguage === "fr"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Français
            </button>
            <button
              onClick={() => setPreviewLanguage("ar")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                previewLanguage === "ar"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Arabe
            </button>
          </div>
        </div>

        <div className="bg-cream rounded-xl overflow-hidden relative min-h-[300px] flex items-center">
          {heroImage && (
            <img
              src={heroImage}
              alt="Hero background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="relative z-10 p-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey/10 text-caramel text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-caramel"></span>
              {previewLanguage === "ar" ? "جودة حرفية تونسية" : "Qualité Artisanale Tunisienne"}
            </div>
            <h1
              className={`text-3xl md:text-4xl font-bold text-chocolate leading-tight mb-4 ${
                previewLanguage === "ar" ? "text-right" : "text-left"
              }`}
              style={{ direction: previewLanguage === "ar" ? "rtl" : "ltr" }}
            >
              {previewLanguage === "ar" ? titleAr : titleFr}
            </h1>
            <p
              className={`text-base text-chocolate/80 mb-6 ${
                previewLanguage === "ar" ? "text-right" : "text-left"
              }`}
              style={{ direction: previewLanguage === "ar" ? "rtl" : "ltr" }}
            >
              {previewLanguage === "ar" ? subtitleAr : subtitleFr}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-3 ${
                previewLanguage === "ar" ? "sm:flex-row-reverse" : ""
              }`}
            >
              <span className="btn-primary py-3 px-6 text-center text-sm">
                {previewLanguage === "ar" ? primaryButtonAr : primaryButtonFr}
              </span>
              <span className="btn-secondary py-3 px-6 text-center text-sm bg-white/50 backdrop-blur-sm">
                {previewLanguage === "ar" ? secondaryButtonAr : secondaryButtonFr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
