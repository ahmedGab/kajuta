"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { CustomSection, CustomSectionItem, ContentBlockType, SiteContent } from "@/lib/types";
import { Plus, Trash2, Save, X, Edit2, Image as ImageIcon, Type, AlignLeft, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

const contentTypes: { type: ContentBlockType; label: string; icon: typeof Type; description: string }[] = [
  { type: "text", label: "Texte", icon: Type, description: "Titre + paragraphe" },
  { type: "card", label: "Carte", icon: AlignLeft, description: "Carte avec icône" },
  { type: "image", label: "Image", icon: ImageIcon, description: "Image avec texte" },
  { type: "stat", label: "Statistique", icon: Type, description: "Chiffre + description" },
];

const backgroundOptions = [
  { value: "background" as const, label: "Fond Principal", preview: "bg-background" },
  { value: "cream" as const, label: "Crème", preview: "bg-cream" },
  { value: "white" as const, label: "Blanc", preview: "bg-white" },
  { value: "green" as const, label: "Vert Foncé", preview: "bg-green" },
  { value: "green-light" as const, label: "Vert Clair", preview: "bg-mint" },
  { value: "caramel" as const, label: "Caramel", preview: "bg-caramel" },
];

const columnOptions = [
  { value: 1 as const, label: "1 colonne" },
  { value: 2 as const, label: "2 colonnes" },
  { value: 3 as const, label: "3 colonnes" },
  { value: 4 as const, label: "4 colonnes" },
];

type ContentBlock = {
  id: string;
  type: "text" | "card" | "image" | "stat";
  titleFr: string;
  titleAr: string;
  contentFr: string;
  contentAr: string;
  icon?: string;
  image?: string;
  number?: string;
};

const uploadFileWithProgress = async (file: File, onProgress: (percent: number) => void): Promise<string> => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'uploaded_file';
  const filename = `${uniqueSuffix}-${safeName}`;
  
  onProgress(30);
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });

  onProgress(70);

  if (error) {
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filename);

  onProgress(100);
  return publicUrl;
};

export default function AdminCustomSections() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [notification, setNotification] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [editingBlocks, setEditingBlocks] = useState<ContentBlock[]>([]);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      setSections((data as any)?.customSections || []);
      setLoading(false);
    });
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAdd = () => {
    const newSection: CustomSection = {
      id: `section-${Date.now()}`,
      enabled: true,
      titleFr: "",
      titleAr: "",
      columns: 3,
      background: "background",
      items: [],
      order: sections.length,
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
    setEditingBlocks([]);
    setSelectedBlock(null);
  };

  const handleSave = async () => {
    if (!editingSection || !content) return;
    const updatedSections = sections.map(s => {
      if (s.id === editingSection?.id) {
        return {
          ...editingSection,
          items: convertBlocksToItems(editingBlocks),
        };
      }
      return s;
    });
    const newContent = { ...content, customSections: updatedSections };
    await db.saveSiteContent(newContent);
    showNotification("Sections sauvegardées !");
    setEditingSection(null);
    setSelectedBlock(null);
    setEditingBlocks([]);
    window.location.reload();
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette section ?")) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const handleMoveSection = (id: string, direction: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === id);
    if (direction === "up" && idx > 0) {
      const newSections = [...sections];
      [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
      setSections(newSections.map((s, i) => ({ ...s, order: i })));
    } else if (direction === "down" && idx < sections.length - 1) {
      const newSections = [...sections];
      [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
      setSections(newSections.map((s, i) => ({ ...s, order: i })));
    }
  };

  const convertItemsToBlocks = (items: CustomSectionItem[]): ContentBlock[] => {
    return items.map(item => ({
      id: item.id,
      type: "text" as const,
      titleFr: "",
      titleAr: "",
      contentFr: item.contentFr,
      contentAr: item.contentAr,
      image: item.image,
    }));
  };

  const convertBlocksToItems = (blocks: ContentBlock[]): CustomSectionItem[] => {
    return blocks.map(block => ({
      id: block.id,
      contentFr: block.titleFr + "\n" + block.contentFr,
      contentAr: block.titleAr + "\n" + block.contentAr,
      image: block.image,
    }));
  };

  const handleEditSection = (section: CustomSection) => {
    const blocks = section.items.map(item => ({
      id: item.id,
      type: item.image ? "image" as const : "text" as const,
      titleFr: item.contentFr.split("\n")[0] || "",
      titleAr: item.contentAr.split("\n")[0] || "",
      contentFr: item.contentFr.split("\n").slice(1).join("\n") || "",
      contentAr: item.contentAr.split("\n").slice(1).join("\n") || "",
      image: item.image,
    }));
    setEditingSection(section);
    setSelectedBlock(null);
    setEditingBlocks(blocks);
  };

  const handleAddBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      titleFr: "",
      titleAr: "",
      contentFr: "",
      contentAr: "",
    };
    const newBlocks = [...editingBlocks, newBlock];
    setEditingBlocks(newBlocks);
    setEditingSection(editingSection ? { ...editingSection, items: convertBlocksToItems(newBlocks) } : null);
    setSelectedBlock(newBlock);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const newBlocks = editingBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
    setEditingBlocks(newBlocks);
    setEditingSection(editingSection ? { ...editingSection, items: convertBlocksToItems(newBlocks) } : null);
    setSelectedBlock(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = editingBlocks.filter(b => b.id !== blockId);
    setEditingBlocks(newBlocks);
    setEditingSection(editingSection ? { ...editingSection, items: convertBlocksToItems(newBlocks) } : null);
    setSelectedBlock(null);
  };

  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    const idx = editingBlocks.findIndex(b => b.id === blockId);
    const newBlocks = [...editingBlocks];
    if (direction === "up" && idx > 0) {
      [newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]];
    } else if (direction === "down" && idx < newBlocks.length - 1) {
      [newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]];
    }
    setEditingBlocks(newBlocks);
    setEditingSection(editingSection ? { ...editingSection, items: convertBlocksToItems(newBlocks) } : null);
  };

  const currentBlocks = editingBlocks;

  // Edit Section View
  if (editingSection) {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[editingSection.columns];

    return (
      <div className="space-y-6">
        {notification && (
          <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
            {notification}
          </div>
        )}

        {/* Section Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">Modifier la Section</h3>
            <button onClick={() => { setEditingSection(null); setSelectedBlock(null); setEditingBlocks([]); }} className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Titre (Français)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingSection.titleFr} onChange={(e) => setEditingSection({ ...editingSection, titleFr: e.target.value })} placeholder="Ex: Nos Services" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">العنوان (عربي)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingSection.titleAr} onChange={(e) => setEditingSection({ ...editingSection, titleAr: e.target.value })} placeholder="مثال: خدماتنا" dir="rtl" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Colonnes</label>
              <select className="w-full p-2 border rounded" value={editingSection.columns} onChange={(e) => setEditingSection({ ...editingSection, columns: Number(e.target.value) as 1 | 2 | 3 | 4 })}>
                {columnOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Couleur de fond</label>
              <div className="flex flex-wrap gap-2">
                {backgroundOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setEditingSection({ ...editingSection, background: opt.value as any })}
                    className={`w-10 h-10 rounded-lg ${opt.preview} border-2 ${editingSection.background === opt.value ? 'border-green ring-2 ring-green/30' : 'border-gray-200'}`}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Block Buttons */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h4 className="font-semibold mb-4">Ajouter un élément</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contentTypes.map(({ type, label, icon: Icon, description }) => (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-green hover:bg-green/5 transition-all text-center group"
              >
                <Icon size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-green" />
                <span className="font-semibold text-sm">{label}</span>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Blocks List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Éléments ({currentBlocks.length})</h4>
            <span className="text-sm text-gray-500">Colonnes: {editingSection.columns}</span>
          </div>

          {currentBlocks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Aucun élément. Cliquez sur "Ajouter un élément" pour commencer.</p>
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-4`}>
              {currentBlocks.map((block, idx) => (
                <div key={block.id} className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedBlock?.id === block.id ? 'border-green bg-green/5' : 'border-gray-200 hover:border-green/50'
                }`}>
                  <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-semibold text-green">
                    #{idx + 1} {block.type === "card" ? "Carte" : block.type === "image" ? "Image" : block.type === "stat" ? "Stat" : "Texte"}
                  </div>
                  <div className="flex justify-end gap-1 mb-2">
                    <button onClick={() => handleMoveBlock(block.id, "up")} disabled={idx === 0} className="p-1 text-gray-400 hover:text-green disabled:opacity-30">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => handleMoveBlock(block.id, "down")} disabled={idx === currentBlocks.length - 1} className="p-1 text-gray-400 hover:text-green disabled:opacity-30">
                      <ChevronDown size={16} />
                    </button>
                    <button onClick={() => setSelectedBlock(block)} className="p-1 text-blue-400 hover:text-blue-600">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteBlock(block.id)} className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {block.type === "text" && (
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">{block.titleFr || "Titre du texte"}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{block.contentFr || "Contenu..."}</p>
                    </div>
                  )}
                  {block.type === "card" && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Type size={20} className="text-green" />
                      </div>
                      <p className="font-semibold text-sm">{block.titleFr || "Titre de la carte"}</p>
                      <p className="text-xs text-gray-500">{block.contentFr || "Description..."}</p>
                    </div>
                  )}
                  {block.type === "image" && (
                    <div>
                      {block.image ? (
                        <img src={block.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-300" />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 line-clamp-2">{block.contentFr || "Légende de l'image..."}</p>
                    </div>
                  )}
                  {block.type === "stat" && (
                    <div className="text-center">
                      <span className="text-2xl font-bold text-caramel">{block.number || "0"}</span>
                      <p className="font-semibold text-sm mt-1">{block.titleFr || "Titre statistic"}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Block Panel */}
        {selectedBlock && (
          <div className="bg-cream p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold mb-4">Modifier l&apos;élément - {selectedBlock.type}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Titre (FR)</label>
                <input type="text" className="w-full p-2 border rounded" value={selectedBlock.titleFr} onChange={(e) => handleUpdateBlock(selectedBlock.id, { titleFr: e.target.value })} placeholder="Titre" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">العنوان (AR)</label>
                <input type="text" className="w-full p-2 border rounded" value={selectedBlock.titleAr} onChange={(e) => handleUpdateBlock(selectedBlock.id, { titleAr: e.target.value })} placeholder="العنوان" dir="rtl" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Contenu (FR)</label>
                <textarea className="w-full p-2 border rounded h-24" value={selectedBlock.contentFr} onChange={(e) => handleUpdateBlock(selectedBlock.id, { contentFr: e.target.value })} placeholder="Contenu en français..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">المحتوى (AR)</label>
                <textarea className="w-full p-2 border rounded h-24" value={selectedBlock.contentAr} onChange={(e) => handleUpdateBlock(selectedBlock.id, { contentAr: e.target.value })} placeholder="المحتوى بالعربية..." dir="rtl" />
              </div>
              {selectedBlock.type === "stat" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Chiffre (ex: 100+)</label>
                  <input type="text" className="w-full p-2 border rounded" value={selectedBlock.number || ""} onChange={(e) => handleUpdateBlock(selectedBlock.id, { number: e.target.value })} placeholder="100+" />
                </div>
              )}
              {selectedBlock.type === "image" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input type="text" className="w-full p-2 border rounded mb-2" value={selectedBlock.image || ""} onChange={(e) => handleUpdateBlock(selectedBlock.id, { image: e.target.value })} placeholder="https://..." />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">OU</span>
                        <label className="flex items-center gap-2 px-4 py-2 bg-green/10 text-green rounded-lg cursor-pointer hover:bg-green/20 text-sm font-semibold">
                          <Upload size={16} />
                          <span>Uploader une image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || !selectedBlock) return;
                            setUploadingBlockId(selectedBlock.id);
                            setUploadProgress(0);
                            try {
                              const url = await uploadFileWithProgress(file, setUploadProgress);
                              handleUpdateBlock(selectedBlock.id, { image: url });
                            } catch (err) {
                              alert("Erreur lors de l'upload: " + (err as Error).message);
                            } finally {
                              setUploadingBlockId(null);
                              setUploadProgress(0);
                            }
                          }} />
                        </label>
                      </div>
                      {uploadingBlockId === selectedBlock.id && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                          <p className="text-xs text-green font-semibold mt-1">{uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                    {selectedBlock.image && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        <img src={selectedBlock.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedBlock(null)} className="btn-secondary py-2 px-4 mt-4">Fermer</button>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => { setEditingSection(null); setSelectedBlock(null); }} className="btn-secondary py-2 px-6">Annuler</button>
          <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
            <Save size={18} /> Sauvegarder
          </button>
        </div>
      </div>
    );
  }

  // Main List View
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Sections Personnalisées ({sections.length})</h3>
          <p className="text-gray-500 text-sm">Créez des sections avec texte, cartes, images et statistiques</p>
        </div>
        <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouvelle Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Aucune section personnalisée</h4>
          <p className="text-gray-500 mb-4">Créez des sections avec le contenu de votre choix : texte, cartes, images, statistiques...</p>
          <button onClick={handleAdd} className="btn-primary py-2 px-6 inline-flex items-center gap-2">
            <Plus size={18} /> Créer une section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={section.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="flex gap-1">
                <button onClick={() => handleMoveSection(section.id, "up")} disabled={idx === 0} className="p-1 text-gray-400 hover:text-green disabled:opacity-30">
                  <ChevronUp size={18} />
                </button>
                <button onClick={() => handleMoveSection(section.id, "down")} disabled={idx === sections.length - 1} className="p-1 text-gray-400 hover:text-green disabled:opacity-30">
                  <ChevronDown size={18} />
                </button>
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{section.titleFr || "Sans titre"}</h4>
                <p className="text-sm text-gray-500">
                  {columnOptions.find(c => c.value === section.columns)?.label} • {backgroundOptions.find(b => b.value === section.background)?.label} • {section.items.length} éléments
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${section.enabled ? "bg-green/10 text-green" : "bg-gray-100 text-gray-500"}`}>
                {section.enabled ? "Actif" : "Inactif"}
              </span>
              <button onClick={() => handleEditSection(section)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(section.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}