"use client";

import React, { useState } from "react";
import { getProducts, saveProducts } from "@/lib/storage";
import { Product } from "@/lib/types";
import { Edit2, Plus, Trash2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminProductEditor() {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempPreview, setTempPreview] = useState<string>("");

  const uploadFileWithProgress = async (file: File): Promise<string> => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'uploaded_file';
    const filename = `${uniqueSuffix}-${safeName}`;
    
    setUploadProgress(30);
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    setUploadProgress(70);

    if (error) {
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filename);

    setUploadProgress(100);
    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setIsUploading(true);
    setUploadProgress(0);
    const preview = URL.createObjectURL(file);
    setTempPreview(preview);

    try {
      const url = await uploadFileWithProgress(file);
      setEditingProduct({ ...editingProduct, image: url });
      setTempPreview("");
      showNotification("Image téléchargée avec succès.");
    } catch (err) {
      alert("Erreur lors de l'upload: " + (err as Error).message);
      setTempPreview("");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const syncAndSave = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
    showNotification("Changements des produits sauvegardés !");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingProduct({
      id: `product-${Date.now()}`,
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      image: "",
      price: 0,
      weight: "",
      alt: "",
      ingredients: [],
      benefits: [],
      occasions: [],
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    
    editingProduct.slug = editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    let newProducts: Product[];
    if (isAdding) {
      newProducts = [...products, editingProduct];
    } else {
      newProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    }
    
    setProducts(newProducts);
    await saveProducts(newProducts);
    
    setEditingProduct(null);
    setIsAdding(false);
    showNotification(isAdding ? "Produit ajouté !" : "Produit modifié !");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    const newProducts = products.filter(p => p.id !== id);
    syncAndSave(newProducts);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="px-4 py-3 rounded-lg bg-green/10 text-green border border-green/20 font-medium">
          {notification}
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            {product.image && (
              <img src={product.image} alt={product.alt || product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
            )}
            <h4 className="font-bold text-chocolate">{product.name}</h4>
            <p className="text-sm text-gray-500">{product.shortDescription}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-green">{product.price} TND</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={handleAdd} className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-green hover:text-green transition-colors h-full min-h-[200px]">
          <Plus size={32} />
          <span className="mt-2">Ajouter un produit</span>
        </button>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-chocolate">
                {isAdding ? 'Ajouter un produit' : 'Modifier le produit'}
              </h3>
              <button onClick={() => { setEditingProduct(null); setIsAdding(false); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prix (TND)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Poids</label>
                <input
                  type="text"
                  value={editingProduct.weight}
                  onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                  placeholder="ex: 250g"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description courte</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description complète</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green file:text-white hover:file:bg-green/90"
                />
                {(tempPreview || editingProduct.image) && (
                  <div className="mt-2">
                    <img src={tempPreview || editingProduct.image} alt="Preview" className="h-32 object-cover rounded-lg" />
                  </div>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">URL de l'image (optionnel)</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Alt de l'image</label>
                <input
                  type="text"
                  value={editingProduct.alt}
                  onChange={(e) => setEditingProduct({ ...editingProduct, alt: e.target.value })}
                  placeholder="{nom du produit}"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green/90 transition-colors">
                <Save size={20} />
                Sauvegarder
              </button>
              <button onClick={() => { setEditingProduct(null); setIsAdding(false); }} className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}