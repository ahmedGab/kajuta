"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SiteContent } from "@/lib/types";

export default function AdminImageEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState("");
  const [storyImage, setStoryImage] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [notification, setNotification] = useState("");
  
  const [uploadProgressHelper, setUploadProgressHelper] = useState<{ [key: string]: number }>({});
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      if (data) {
        setHeroImage(data.hero.image);
        setStoryImage(data.story?.image || "");
        setLogoImage(data.logo || "");
      }
      setLoading(false);
    });
  }, []);

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'uploaded_file';
    const filename = `${uniqueSuffix}-${safeName}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filename);

    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "story" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "hero") setIsUploadingHero(true);
    if (type === "story") setIsUploadingStory(true);
    if (type === "logo") setIsUploadingLogo(true);

    setUploadProgressHelper(prev => ({ ...prev, [type]: 10 }));

    try {
      const url = await uploadFileToSupabase(file);
      
      if (type === "hero") setHeroImage(url);
      if (type === "story") setStoryImage(url);
      if (type === "logo") setLogoImage(url);
      
      setUploadProgressHelper(prev => ({ ...prev, [type]: 100 }));
      setNotification(`Image ${type} téléchargée avec succès. N'oubliez pas de sauvegarder !`);
    } catch(err: any) {
      console.error("Upload error:", err);
      setNotification(`Erreur lors de l'upload: ${err.message}`);
    } finally {
      if (type === "hero") setIsUploadingHero(false);
      if (type === "story") setIsUploadingStory(false);
      if (type === "logo") setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    const newContent = { ...content };
    newContent.hero = { ...newContent.hero, image: heroImage };
    if (storyImage) {
      newContent.story = { ...newContent.story, image: storyImage };
    }
    newContent.logo = logoImage;
    
    const success = await db.saveSiteContent(newContent);
    if (success) {
      setNotification("Images sauvegardées avec succès !");
    } else {
      setNotification("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : (
      <>
      {notification && (
        <div className={`px-4 py-3 rounded-lg border ${
          notification.includes("succès") 
            ? "bg-green/10 text-green border-green/20" 
            : "bg-red-10 text-red border-red-20"
        }`}>
          {notification}
        </div>
      )}

      {/* Hero Image */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold mb-4">Image Hero</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "hero")}
          disabled={isUploadingHero}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green file:text-white hover:file:bg-green/90"
        />
        {isUploadingHero && uploadProgressHelper.hero !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green h-2.5 rounded-full" style={{ width: `${uploadProgressHelper.hero}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{uploadProgressHelper.hero}%</p>
          </div>
        )}
        {heroImage && (
          <div className="mt-4">
            <img src={heroImage} alt="Hero Preview" className="max-h-48 rounded-lg object-cover" />
          </div>
        )}
      </div>

      {/* Story Image */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold mb-4">Image Notre Histoire</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "story")}
          disabled={isUploadingStory}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green file:text-white hover:file:bg-green/90"
        />
        {isUploadingStory && uploadProgressHelper.story !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green h-2.5 rounded-full" style={{ width: `${uploadProgressHelper.story}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{uploadProgressHelper.story}%</p>
          </div>
        )}
        {storyImage && (
          <div className="mt-4">
            <img src={storyImage} alt="Story Preview" className="max-h-48 rounded-lg object-cover" />
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold mb-4">Logo du Site</h3>
        <label className="block text-sm font-semibold mb-2">URL du Logo ou Fichier Local (PNG/JPG/SVG)</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={logoImage}
            onChange={(e) => setLogoImage(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
          />
          <label className="px-4 py-2 bg-green text-white rounded-lg cursor-pointer hover:bg-green/90 transition-colors">
            <span>Parcourir</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "logo")}
              disabled={isUploadingLogo}
              className="hidden"
            />
          </label>
        </div>
        {isUploadingLogo && uploadProgressHelper.logo !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green h-2.5 rounded-full" style={{ width: `${uploadProgressHelper.logo}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{uploadProgressHelper.logo}%</p>
          </div>
        )}
        {logoImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <img src={logoImage} alt="Preview Logo" className="max-h-full max-w-full object-contain" />
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green/90 transition-colors"
      >
        <Save size={20} />
        Sauvegarder les Images
      </button>
      </>
      )}
    </div>
  );
}