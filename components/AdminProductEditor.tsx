"use client";

import React, { useState, useMemo } from "react";
import { getProducts, saveProducts } from "@/lib/storage";
import { Product } from "@/lib/types";
import { Edit2, Plus, Trash2, Save, X } from "lucide-react";
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

export default function AdminProductEditor() {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempPreview, setTempPreview] = useState<string>("");

const uploadFileWithProgress = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'uploaded_file';
    const filename = `${uniqueSuffix}-${safeName}`;
    
    const storageRef = ref(storage, `uploads/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        reject(new Error(error.message || "Upload failed"));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(new Error("Failed to get download URL"));
        }
      }
    );
  });
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
      weight: "250g",
      alt: "",
      ingredients: [],
      benefits: [],
      occasions: [],
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingProduct) return;
    
    let newProducts;
    if (isAdding) {
      newProducts = [...products, editingProduct];
    } else {
      newProducts = products.map((p) => p.id === editingProduct.id ? editingProduct : p);
    }
    
    syncAndSave(newProducts);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      const newProducts = products.filter(p => p.id !== id);
      syncAndSave(newProducts);
    }
  };

  const handleArrayChange = (field: keyof Product, value: string) => {
    if (!editingProduct) return;
    const arrayValues = value.split(",").map(i => i.trim()).filter(i => i);
    setEditingProduct({ ...editingProduct, [field]: arrayValues });
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      {editingProduct ? (
         <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">{isAdding ? "Ajouter un produit" : `Modifier ${editingProduct.name}`}</h3>
            <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nom</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Slug URL</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.slug} onChange={(e) => setEditingProduct({...editingProduct, slug: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Prix (TND)</label>
              <input type="number" className="w-full p-2 border rounded" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Poids</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.weight} onChange={(e) => setEditingProduct({...editingProduct, weight: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description courte</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.shortDescription} onChange={(e) => setEditingProduct({...editingProduct, shortDescription: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description longue</label>
              <textarea className="w-full p-2 border rounded h-24" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Image du produit</label>
              <div className="flex gap-6">
                <div className="flex-1">
                  <input type="text" className="w-full p-2 border rounded mb-2" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="https://..." />
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-500">OU</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green/10 file:text-green
                        hover:file:bg-green/20"
                    />
                  </div>
                  {isUploading && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="text-xs text-green font-semibold mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  {tempPreview ? (
                    <img src={tempPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : editingProduct.image ? (
                    <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Aucune image</div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Texte ALT image</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.alt} onChange={(e) => setEditingProduct({...editingProduct, alt: e.target.value})} />
            </div>
            
             <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Ingrédients (séparés par virgule)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.ingredients.join(", ")} onChange={(e) => handleArrayChange("ingredients", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Bénéfices (séparés par virgule)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.benefits.join(", ")} onChange={(e) => handleArrayChange("benefits", e.target.value)} />
            </div>
             <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Occasions (séparées par virgule)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingProduct.occasions.join(", ")} onChange={(e) => handleArrayChange("occasions", e.target.value)} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
              <Save size={18} /> Sauvegarder Produit
            </button>
          </div>
         </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Liste des produits ({products.length})</h3>
            <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2 text-sm">
              <Plus size={16} /> Ajouter Produit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {product.image && <img src={product.image} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.price} TND / {product.weight}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
