"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { LocalizedString, SiteContent } from "@/lib/types";
import { Save } from "lucide-react";

export default function AdminFooterEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const [description, setDescription] = useState<LocalizedString>({ fr: "", ar: "" });
  const [quickLinksTitle, setQuickLinksTitle] = useState<LocalizedString>({ fr: "", ar: "" });
  const [contactTitle, setContactTitle] = useState<LocalizedString>({ fr: "", ar: "" });
  const [deliveryZonesTitle, setDeliveryZonesTitle] = useState<LocalizedString>({ fr: "", ar: "" });
  const [phone, setPhone] = useState<LocalizedString>({ fr: "", ar: "" });
  const [email, setEmail] = useState<LocalizedString>({ fr: "", ar: "" });
  const [zones, setZones] = useState<LocalizedString[]>([]);
  const [address, setAddress] = useState<LocalizedString>({ fr: "", ar: "" });

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      if (data) {
        setDescription(data.footer.description);
        setQuickLinksTitle(data.footer.quickLinks.title);
        setContactTitle(data.footer.contact.title);
        setDeliveryZonesTitle(data.footer.deliveryZones.title);
        setAddress(data.footer.contact.address);
        setPhone(data.footer.contact.phone);
        setEmail(data.footer.contact.email);
        setZones(data.footer.deliveryZones.zones);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!content) return;
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
        zones,
      },
      contact: {
        title: contactTitle,
        address,
        phone,
        email,
      },
    };
    await db.saveSiteContent(newContent);
    setNotification("Footer sauvegardé avec succès !");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : (
      <>
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
          {zones.map((zone, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2">
              <input type="text" className="w-full p-2 border rounded" value={zone.fr} onChange={(e) => {
                const newZones = [...zones];
                newZones[idx] = { ...newZones[idx], fr: e.target.value };
                setZones(newZones);
              }} placeholder={`Zone ${idx + 1} (FR)`} />
              <input type="text" className="w-full p-2 border rounded" value={zone.ar} onChange={(e) => {
                const newZones = [...zones];
                newZones[idx] = { ...newZones[idx], ar: e.target.value };
                setZones(newZones);
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
      </>
      )}
    </div>
  );
}