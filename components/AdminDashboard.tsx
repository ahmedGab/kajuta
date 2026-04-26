"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin, isAdminLoggedIn } from "@/lib/adminAuth";
import { resetSiteContent, resetProducts } from "@/lib/storage";
import AdminParagraphEditor from "./AdminParagraphEditor";
import AdminProductEditor from "./AdminProductEditor";
import AdminFAQEditor from "./AdminFAQEditor";
import AdminTestimonialEditor from "./AdminTestimonialEditor";
import AdminImageEditor from "./AdminImageEditor";
import AdminPacksEditor from "./AdminPacksEditor";
import AdminFooterEditor from "./AdminFooterEditor";
import AdminColorEditor from "./AdminColorEditor";
import AdminSectionVisibility from "./AdminSectionVisibility";
import AdminCustomSections from "./AdminCustomSections";
import AdminHeaderEditor from "./AdminHeaderEditor";
import { LayoutDashboard, LogOut, FileText, Package, Image as ImageIcon, MessageSquare, HelpCircle, Eye, RefreshCw, Gift, Footprints, Palette, Layout, Layers, Menu } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("header");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAdminLoggedIn()) {
      router.push("/cajuta-admin-login");
    }
  }, [router]);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/cajuta-admin-login");
  };

  const handleReset = async () => {
    if (confirm("Attention ! Ceci va remettre le contenu par défaut depuis Supabase. Continuer ?")) {
      await resetSiteContent();
      await resetProducts();
      window.location.reload();
    }
  };

  if (!isClient) return <div className="min-h-screen bg-gray-50 p-8 flex justify-center">Chargement...</div>;

  const tabs = [
    { id: "header", name: "Header", icon: <Menu size={18} /> },
    { id: "paragraphes", name: "Paragraphes", icon: <FileText size={18} /> },
    { id: "produits", name: "Produits", icon: <Package size={18} /> },
    { id: "packs", name: "Packs", icon: <Gift size={18} /> },
    { id: "custom", name: "Sections+", icon: <Layers size={18} /> },
    { id: "footer", name: "Footer", icon: <Footprints size={18} /> },
    { id: "couleurs", name: "Couleurs", icon: <Palette size={18} /> },
    { id: "sections", name: "Sections", icon: <Layout size={18} /> },
    { id: "images", name: "Images", icon: <ImageIcon size={18} /> },
    { id: "avis", name: "Avis Clients", icon: <MessageSquare size={18} /> },
    { id: "faq", name: "FAQ", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Fixed */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-50">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <span className="font-display font-bold text-xl text-green">
            CAJUTA<span className="text-caramel">.</span> Admin
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Gestion</div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-green/10 text-green" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>

          <div className="mt-8 px-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Actions</div>
            <a href="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 mb-1">
              <Eye size={18} /> Prévisualiser le site
            </a>
            <button onClick={handleReset} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50">
              <RefreshCw size={18} /> Réinitialiser défaut
            </button>
          </div>
</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 lg:p-12 ml-64">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-display font-bold text-chocolate flex items-center gap-3">
              <LayoutDashboard className="text-green" /> 
               Bienvenue dans le dashboard Cajuta
            </h1>
            <p className="text-gray-500 mt-2">Gérez le contenu de votre site facilement (Changements sauvegardés localement).</p>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            {activeTab === "header" && <AdminHeaderEditor />}
            {activeTab === "paragraphes" && <AdminParagraphEditor />}
            {activeTab === "produits" && <AdminProductEditor />}
            {activeTab === "packs" && <AdminPacksEditor />}
            {activeTab === "custom" && <AdminCustomSections />}
            {activeTab === "footer" && <AdminFooterEditor />}
            {activeTab === "couleurs" && <AdminColorEditor />}
            {activeTab === "sections" && <AdminSectionVisibility />}
            {activeTab === "images" && <AdminImageEditor />}
            {activeTab === "avis" && <AdminTestimonialEditor />}
            {activeTab === "faq" && <AdminFAQEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
