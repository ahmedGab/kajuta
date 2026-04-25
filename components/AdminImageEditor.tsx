"use client";

import React, { useState } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { Save } from "lucide-react";

export default function AdminImageEditor() {
  const content = getSiteContent();
  const [heroImage, setHeroImage] = useState(content.hero.image);
  const [storyImage, setStoryImage] = useState(content.story?.image || "");
  const [logoImage, setLogoImage] = useState(content.logo || "");
  const [notification, setNotification] = useState("");
  
  const [uploadProgressHelper, setUploadProgressHelper] = useState<{ [key: string]: number }>({});
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Helper file uploader avec barre de progression XHR
  const uploadFileWithProgress = (file: File, key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgressHelper(prev => ({ ...prev, [key]: Math.round(percentComplete) }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success) resolve(data.url);
            else reject(new Error(data.error));
          } catch(e) {
            reject(new Error("Invalid response"));
          }
        } else {
          reject(new Error("Server error"));
        }
        setUploadProgressHelper(prev => {
           const newObj = {...prev};
           delete newObj[key];
           return newObj;
        });
      };
      
      xhr.onerror = () => {
        setUploadProgressHelper(prev => {
           const newObj = {...prev};
           delete newObj[key];
           return newObj;
        });
        reject(new Error("Network error"));
      };

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "story" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "hero") setIsUploadingHero(true);
    if (type === "story") setIsUploadingStory(true);
    if (type === "logo") setIsUploadingLogo(true);

    try {
      const url = await uploadFileWithProgress(file, type);
      if (type === "hero") setHeroImage(url);
      if (type === "story") setStoryImage(url);
      if (type === "logo") setLogoImage(url);
      setNotification(`Image ${type} téléchargée avec succès. N'oubliez pas de sauvegarder !`);
    } catch(err: any) {
      alert("Erreur lors de l'upload: " + err.message);
    } finally {
      if (type === "hero") setIsUploadingHero(false);
      if (type === "story") setIsUploadingStory(false);
      if (type === "logo") setIsUploadingLogo(false);
    }
  };

  const handleSave = () => {
    const newContent = { ...content };
    newContent.hero.image = heroImage;
    if(newContent.story) newContent.story.image = storyImage;
    newContent.logo = logoImage;
    saveSiteContent(newContent);
    setNotification("Images sauvegardées avec succès.");
    setTimeout(() => setNotification(""), 3000);
  };

  const renderProgressBar = (key: string) => {
    if (uploadProgressHelper[key] !== undefined) {
      return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-green h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgressHelper[key]}%` }}></div>
          <p className="text-xs text-green font-semibold mt-1">{uploadProgressHelper[key]}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg font-medium">{notification}</div>
      )}

        <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold mb-4">Logo du Site</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-semibold mb-2">URL du Logo ou Fichier Local (PNG/JPG/SVG)</label>
            <div className="mb-4">
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded mb-2" 
                value={logoImage} 
                onChange={(e) => setLogoImage(e.target.value)} 
                placeholder="/chemin-vers-logo.png ou https://..."
              />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-medium text-gray-500">OU</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo")}
                  disabled={isUploadingLogo}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green/10 file:text-green hover:file:bg-green/20"
                />
              </div>
              {renderProgressBar("logo")}
            </div>
            <p className="text-xs text-gray-500">Un fond transparent (PNG ou SVG) est recommandé pour le logo.</p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm relative flex items-center justify-center p-4">
              {logoImage ? (
                <img src={logoImage} alt="Preview Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-gray-400">Aucun logo configuré (Texte natif utilisé)</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold mb-4">Image Hero (Accueil)</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-semibold mb-2">URL de l&apos;image principale ou Fichier Local</label>
            <div className="mb-4">
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded mb-2" 
                value={heroImage} 
                onChange={(e) => setHeroImage(e.target.value)} 
                placeholder="https://..."
              />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-medium text-gray-500">OU</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "hero")}
                  disabled={isUploadingHero}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green/10 file:text-green
                    hover:file:bg-green/20"
                />
              </div>
              {renderProgressBar("hero")}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm relative">
              {heroImage ? (
                <img src={heroImage} alt="Preview Hero" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Aucune image</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-6">
        <h3 className="font-bold mb-4">Image Histoire (À propos)</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-semibold mb-2">URL de l&apos;image Histoire ou Fichier Local</label>
            <div className="mb-4">
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded mb-2" 
                value={storyImage} 
                onChange={(e) => setStoryImage(e.target.value)} 
                placeholder="https://..."
              />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-medium text-gray-500">OU</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "story")}
                  disabled={isUploadingStory}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green/10 file:text-green
                    hover:file:bg-green/20"
                />
              </div>
              {renderProgressBar("story")}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm relative">
              {storyImage ? (
                <img src={storyImage} alt="Preview Story" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Aucune image</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
        <Save size={18} /> Sauvegarder les images
      </button>
    </div>
  );
}
