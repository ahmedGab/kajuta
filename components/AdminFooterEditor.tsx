"use client";

import React, { useState } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { LocalizedString } from "@/lib/types";
import { Save } from "lucide-react";

export default function AdminFooterEditor() {
  const content = getSiteContent();
  const [notification, setNotification] = useState("");

  const [description, setDescription] = useState<LocalizedString>(content.footer.description);
  const [quickLinksTitle, setQuickLinksTitle] = useState<LocalizedString>(content.footer.quickLinks.title);
  const [contactTitle, setContactTitle] = useState<LocalizedString>(content.footer.contact.title);
  const [deliveryZonesTitle, setDeliveryZonesTitle] = useState<LocalizedString>(content.footer.deliveryZones.title);
  const [address, setAddress] = useState<LocalizedString>(content.footer.contact.address);
  const [phone, setPhone] = useState<LocalizedString>(content.footer.contact.phone);
  const [email, setEmail] = useState<LocalizedString>(content.footer.contact.email);

  const handleSave = () => {
    const newContent = { ...content };
    newContent.footer = {
      ...newContent.footer,
      description,
      quickLinks: {
        ...newContent.footer.quickLinks,
        title: quickLinksTitle,
      },
      deliveryZones: {
        ...newContent.footer.deliveryZones,
        title: deliveryZonesTitle,
      },
      contact: {
        title: contactTitle,
        address,
        phone,
        email,
      },
    };
    saveSiteContent(newContent);
    setNotification("Footer sauvegardé avec succès !");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      {/* Description */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Description de la marque</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Français</label>
            <textarea className="w-full p-2 border rounded h-24" value={description.fr} onChange={(e) => setDescription({ ...description, fr: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">العربية</label>
            <textarea className="w-full p-2 border rounded h-24" value={description.ar} onChange={(e) => setDescription({ ...description, ar: e.target.value })} dir="rtl" />
          </div>
        </div>
      </div>

      {/* Liens Rapides */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Liens Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Titre (FR)</label>
            <input type="text" className="w-full p-2 border rounded" value={quickLinksTitle.fr} onChange={(e) => setQuickLinksTitle({ ...quickLinksTitle, fr: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Titre (AR)</label>
            <input type="text" className="w-full p-2 border rounded" value={quickLinksTitle.ar} onChange={(e) => setQuickLinksTitle({ ...quickLinksTitle, ar: e.target.value })} dir="rtl" />
          </div>
        </div>
      </div>

      {/* Zones de Livraison */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Zones de Livraison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Titre (FR)</label>
            <input type="text" className="w-full p-2 border rounded" value={deliveryZonesTitle.fr} onChange={(e) => setDeliveryZonesTitle({ ...deliveryZonesTitle, fr: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Titre (AR)</label>
            <input type="text" className="w-full p-2 border rounded" value={deliveryZonesTitle.ar} onChange={(e) => setDeliveryZonesTitle({ ...deliveryZonesTitle, ar: e.target.value })} dir="rtl" />
          </div>
          {content.footer.deliveryZones.zones.map((zone, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2">
              <input type="text" className="w-full p-2 border rounded" value={zone.fr} onChange={(e) => {
                const newZones = [...content.footer.deliveryZones.zones];
                newZones[idx] = { ...newZones[idx], fr: e.target.value };
              }} placeholder={`Zone ${idx + 1} (FR)`} />
              <input type="text" className="w-full p-2 border rounded" value={zone.ar} onChange={(e) => {
                const newZones = [...content.footer.deliveryZones.zones];
                newZones[idx] = { ...newZones[idx], ar: e.target.value };
              }} placeholder={`المنطقة ${idx + 1} (AR)`} dir="rtl" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Titre (FR)</label>
            <input type="text" className="w-full p-2 border rounded" value={contactTitle.fr} onChange={(e) => setContactTitle({ ...contactTitle, fr: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Titre (AR)</label>
            <input type="text" className="w-full p-2 border rounded" value={contactTitle.ar} onChange={(e) => setContactTitle({ ...contactTitle, ar: e.target.value })} dir="rtl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Adresse (FR)</label>
            <textarea className="w-full p-2 border rounded" value={address.fr} onChange={(e) => setAddress({ ...address, fr: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">العنوان (AR)</label>
            <textarea className="w-full p-2 border rounded" value={address.ar} onChange={(e) => setAddress({ ...address, ar: e.target.value })} dir="rtl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Téléphone</label>
            <input type="text" className="w-full p-2 border rounded" value={phone.fr} onChange={(e) => setPhone({ ...phone, fr: e.target.value, ar: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input type="text" className="w-full p-2 border rounded" value={email.fr} onChange={(e) => setEmail({ ...email, fr: e.target.value, ar: e.target.value })} />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
        <Save size={18} /> Sauvegarder le Footer
      </button>
    </div>
  );
}