"use client";

import React, { useState, useMemo } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { Save } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBYfvlrd5kZm9Qjvg-84pjSEFutkZ5BDQI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cajuta-web.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cajuta-web",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cajuta-web.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "948485082985",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:948485082985:web:f2f7bc02d1f721bdd1b7f8",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

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

  const uploadFileWithProgress = (file: File, key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("Starting upload with config:", {
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      });
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'uploaded_file';
      const filename = `${uniqueSuffix}-${safeName}`;
      
      const storageRef = ref(storage, `uploads/${filename}`);
      
      console.log("Storage ref created:", storageRef.fullPath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgressHelper((prev) => ({ ...prev, [key]: Math.round(progress) }));
        },
        (error) => {
          console.error("Upload error:", error);
          setUploadProgressHelper((prev) => {
            const newObj = { ...prev };
            delete newObj[key];
            return newObj;
          });
          reject(new Error(error.message || "Upload failed"));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgressHelper((prev) => {
              const newObj = { ...prev };
              delete newObj[key];
              return newObj;
            });
            resolve(downloadURL);
          } catch (error) {
            reject(new Error("Failed to get download URL"));
          }
        }
      );
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
      console.error("Upload error:", err);
      setNotification(`Erreur lors de l'upload: ${err.message}`);
    } finally {
      if (type === "hero") setIsUploadingHero(false);
      if (type === "story") setIsUploadingStory(false);
      if (type === "logo") setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    const newContent = { ...content };
    newContent.hero = { ...newContent.hero, image: heroImage };
    if (storyImage) {
      newContent.story = { ...newContent.story, image: storyImage };
    }
    newContent.logo = logoImage;
    
    const success = await saveSiteContent(newContent);
    if (success) {
      setNotification("Images sauvegardées avec succès !");
    } else {
      setNotification("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`px-4 py-3 rounded-lg border ${
          notification.includes("succès") 
            ? "bg-green/10 text-green border-green/20" 
            : "bg-red-10 text-red border-red/20"
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
    </div>
  );
}