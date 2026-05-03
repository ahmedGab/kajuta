"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin, isAdminLoggedIn } from "@/lib/adminAuth";
import { resetSiteContent, resetProducts } from "@/lib/storage";
import * as db from "@/lib/db";
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
import AdminSocialEditor from "./AdminSocialEditor";
import AdminHeroEditor from "./AdminHeroEditor";
import { LayoutDashboard, LogOut, FileText, Package, Image as ImageIcon, MessageSquare, HelpCircle, Eye, RefreshCw, Gift, Footprints, Palette, Layout, Layers, Menu, Share2, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("header");
  const [isClient, setIsClient] = useState(false);
  const [logo, setLogo] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAdminLoggedIn()) {
      router.push("/cajuta-admin-login");
    }
    db.getSiteContent().then((data) => {
      if (data?.logo) {
        setLogo(data.logo);
      }
    });
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

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isClient) return <div className="min-h-screen bg-gray-50 p-8 flex justify-center">Chargement...</div>;

  const tabs = [
    { id: "header", name: "Header", icon: <Menu size={18} /> },
    { id: "hero", name: "Hero", icon: <Sparkles size={18} /> },
    { id: "paragraphes", name: "Paragraphes", icon: <FileText size={18} /> },
    { id: "produits", name: "Produits", icon: <Package size={18} /> },
    { id: "packs", name: "Packs", icon: <Gift size={18} /> },
    { id: "custom", name: "Sections+", icon: <Layers size={18} /> },
    { id: "footer", name: "Footer", icon: <Footprints size={18} /> },
    { id: "social", name: "Social", icon: <Share2 size={18} /> },
    { id: "couleurs", name: "Couleurs", icon: <Palette size={18} /> },
    { id: "sections", name: "Sections", icon: <Layout size={18} /> },
    { id: "images", name: "Images", icon: <ImageIcon size={18} /> },
    { id: "avis", name: "Avis Clients", icon: <MessageSquare size={18} /> },
    { id: "faq", name: "FAQ", icon: <HelpCircle size={18} /> },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        {logo ? (
          <img src={logo} alt="CAJUTA" className="h-8 w-auto object-contain" />
        ) : (
          <span className="font-display font-bold text-xl text-green">
            CAJUTA<span className="text-caramel">.</span> Admin
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Gestion</div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
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
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
          </button>
          {logo ? (
            <img src={logo} alt="CAJUTA" className="h-7 w-auto object-contain" />
          ) : (
            <span className="font-display font-bold text-lg text-green">
              CAJUTA<span className="text-caramel">.</span>
            </span>
          )}
          <div className="w-10" />
        </div>

        <div className="p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-chocolate flex items-center gap-3">
                <LayoutDashboard className="text-green" /> 
                Bienvenue dans le dashboard Cajuta
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">Gérez le contenu de votre site facilement (Changements sauvegardés localement).</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
              {activeTab === "header" && <AdminHeaderEditor />}
              {activeTab === "hero" && <AdminHeroEditor />}
              {activeTab === "paragraphes" && <AdminParagraphEditor />}
              {activeTab === "produits" && <AdminProductEditor />}
              {activeTab === "packs" && <AdminPacksEditor />}
              {activeTab === "custom" && <AdminCustomSections />}
              {activeTab === "footer" && <AdminFooterEditor />}
              {activeTab === "social" && <AdminSocialEditor />}
              {activeTab === "couleurs" && <AdminColorEditor />}
              {activeTab === "sections" && <AdminSectionVisibility />}
              {activeTab === "images" && <AdminImageEditor />}
              {activeTab === "avis" && <AdminTestimonialEditor />}
              {activeTab === "faq" && <AdminFAQEditor />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
