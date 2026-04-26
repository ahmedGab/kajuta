import { createClient } from "@supabase/supabase-js";
import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variables d'environnement manquantes");
  console.log("   Assurez-vous que .env.local contient:");
  console.log("   - NEXT_PUBLIC_SUPABASE_URL");
  console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const siteContentToImport = {
  id: "main",
  data: {
    visibility: {
      hero: true,
      trustBar: true,
      products: true,
      whyChooseUs: true,
      story: true,
      occasions: true,
      packs: true,
      testimonials: true,
      delivery: true,
      faq: true,
      cta: true
    },
    logo: "",
    hero: {
      title: { fr: "Le vrai goût du fruit sec caramélisé", ar: "الطعم الحقيقي للفواكة الجافة المكرملة" },
      subtitle: {
        fr: "Découvrez notre collection artisanale de fruits secs caramélisés premium, fabricada en Tunisie. Croquant, gourmand et irrésistible.",
        ar: "اكتشف مجموعتنا الحرفية من الفواكة الجافة المكرملة الفاخرة، المصنعة في تونس. قرمشة ولذيذة ولا تقاوم."
      },
      image: "https://images.unsplash.com/photo-1599598425947-33004bb15286?auto=format&fit=crop&q=80&w=1200",
      primaryButton: { fr: "Découvrir nos saveurs", ar: "اكتشف النكهات" },
      secondaryButton: { fr: "Commander sur WhatsApp", ar: "اطلب عبر واتساب" }
    },
    trust: {
      items: {
        fr: ["100% Artisanal", "Qualité Premium", "Livraison Rapide", "Paiement à la livraison"],
        ar: ["حرفي 100%", "جودة فاخرة", "توصيل سريع", "دفع عند الاستلام"]
      }
    },
    story: {
      title: { fr: "Notre Histoire", ar: "قصتنا" },
      paragraphs: {
        fr: [
          "Cajuta est née d'une passion pour les saveurs authentiques et les recettes traditionnelles revisitées.",
          "Notre mission est de réinventer l'expérience du fruit sec en Tunisie en proposant une caramélisation parfaite.",
          "Chaque fournée est préparée avec soin dans nos ateliers, avec des ingrédients de premier choix."
        ],
        ar: [
          "كاجوتا ولدت من شغف بالنكهات الاصيلة والوصفات التقليدية المعاد ابتكارها.",
          "مهمتنا هي اعادة اختراع تجربة الفواكة الجافة في تونس من خلال تقديم كراميل مثالي.",
          "كل دفعة محضرة بعناية في ورشتنا باستخدام مكونات من الدرجةالاولى."
        ]
      },
      image: "https://images.unsplash.com/photo-1621293954908-907159247fc8?w=800&q=80"
    },
    delivery: {
      title: { fr: "Livraison partout en Tunisie", ar: "توصيل في تونس" },
      paragraphs: {
        fr: [
          "Que vous soyez à Tunis, Ariana, Ben Arous, Sfax, Sousse, Nabeul ou Bizerte, Cajuta arrive chez vous.",
          "Nous travaillons avec les meilleurs transporteurs pour vous garantir une livraison rapide.",
          "Les frais de livraison sont fixes et vous ne payez qu'à la réception de votre colis."
        ],
        ar: [
          "سواء كنت في تونس او اريانة او بن عروس او صفاقس او سوسة او نابل او بنزرت، كاجوتا تصل اليك.",
          "نعمل مع شركات الشحن لاجل ضمان ل�� توصيل سريع.",
          "رسوم التوصيل ثابتة وتدفع فقط عند استلام طردك."
        ]
      }
    },
    occasions: {
      title: { fr: "Pour toutes vos occasions tunisiennes", ar: "لكل مناسباتك التونسية" },
      paragraphs: {
        fr: [
          "Un cadeau gourmand est toujours une bonne idée. Nos produits sont conçus pour sublimer vos moments de partage.",
          "Pendant le Ramadan, nos fruits secs accompagnent vos soirées. Lors de l'Aïd, nos coffrets font le bonheur de vos familles.",
          "Mariages, fiançailles, naissances, ou simples cadeaux d'affaires... Offrir Cajuta, c'est offrir l'excellence."
        ],
        ar: [
          "الهدية اللذيذة فكرة جيدة دوما. منتجاتنا مصممة لترتقي بلحظات المشاركة.",
          "خلال شهر رمضان، الفواكة الجافة تصحب سهراتك. خلال العيد، صناديقنا Joy of العائلات.",
          "زواج، خطبة، ولادة، او هدايا عمل بسيطة... تقديم كاجوتا يعني تقديم التميز."
        ]
      }
    },
    about: {
      title: { fr: "À propos de Cajuta", ar: "حول كاجوتا" },
      paragraphs: {
        fr: [
          "Cajuta, marque tunisienne d'excellence, se spécialise dans la caramélisation de fruits secs hauts de gamme.",
          "Notre équipe d'artisans passionnés sélectionne les meilleurs calibres de noix de cajou, amandes, noisettes et pistaches.",
          "Rejoignez des centaines de clients satisfaits qui ont fait de nos produits leur péché mignon !"
        ],
        ar: [
          "كاجوتا، علامة تونسية متخصصة، تتخصص في كراميل الفواكة الجافة الفاخرة.",
          "فريق الحرفيين المتحمسين لدينا يختار احسن احجام الكاجو واللوز والبندق والفستق.",
          "انضم الى مئات العملاء satisfaits الذين جعلوا من منتجاتنا ذنبهم المفضل."
        ]
      }
    },
    packs: {
      title: { fr: "Nos Packs & Offres", ar: "عروضنا والحزم" },
      paragraphs: {
        fr: ["Nos packs sont parfaits pour offrir ou se faire plaisir. Chaque coffret est préparé avec soin."],
        ar: ["حزمتنا مثالية للهدايا او للاستمتاع. كل صندوق محضر بعناية."]
      },
      items: [
        {
          id: "pack-decouverte",
          nameFr: "Pack Découverte",
          nameAr: "حزمة الاكتشاف",
          descriptionFr: "Idéal pour goûter : 4 sachets de 100g (Amandes, Cajou, Noisette, Pistache).",
          descriptionAr: "مثالي للتذوق: 4 أكياس من 100 غ (لوز، كاجو، بندق، فستق).",
          price: 85,
          products: []
        },
        {
          id: "pack-famille",
          nameFr: "Pack Famille",
          nameAr: "حزمة العائلة",
          descriptionFr: "Pour toute la famille : 1kg de Mix Cajuta + 500g d'Amandes au choix.",
          descriptionAr: "للعائلة: 1 كغ من ميكس كاجوتا + 500 غ لوز اختياري.",
          price: 155,
          products: []
        },
        {
          id: "pack-cadeau",
          nameFr: "Pack Cadeau VIP",
          nameAr: "حزمة الهدية VIP",
          descriptionFr: "Dans un coffret luxueux : Assortiment de nos 4 best-sellers.",
          descriptionAr: "في صندوق فاخر: تشكيلة من أفضل 4 منتجات.",
          price: 120,
          products: []
        },
        {
          id: "pack-evenement",
          nameFr: "Pack Événement",
          nameAr: "حزمة المناسبة",
          descriptionFr: "Pour vos cérémonies : Sur devis, personnalisation disponible.",
          descriptionAr: "للمناسبات: حسب الطلب، إمكانية التخصيص.",
          price: 0,
          products: []
        }
      ]
    },
    footer: {
      description: {
        fr: "Fruits secs caramélisés en Tunisie. Une expérience artisanale, gourmande et premium.",
        ar: "فواكة جافة مكرملة في تونس. تجربة حرفية ولذيذة وفاخرة."
      },
      quickLinks: {
        title: { fr: "Liens Rapides", ar: "روابط سريعة" },
        links: [
          { label: { fr: "Accueil", ar: "الرئيسية" }, href: "/" },
          { label: { fr: "Nos Produits", ar: "منتجاتنا" }, href: "/produits" },
          { label: { fr: "Notre Histoire", ar: "قصتنا" }, href: "/a-propos" },
          { label: { fr: "FAQ", ar: "الأسئلة الشائعة" }, href: "/faq" }
        ]
      },
      deliveryZones: {
        title: { fr: "Nos Zones de Livraison", ar: "مناطق التوصيل" },
        zones: [
          { fr: "Tunis & Banlieue", ar: "تونس وضواحيها" },
          { fr: "Sfax", ar: "صفاقس" },
          { fr: "Sousse & Monastir", ar: "سوسة والمنستير" },
          { fr: "Nabeul & Hammamet", ar: "نابل والحمامات" }
        ]
      },
      contact: {
        title: { fr: "Contact", ar: "اتصل بنا" },
        address: { fr: "Atelier Artisanal\nTunis, Tunisie", ar: "ورشة حرفية\nتونس، تونس" },
        phone: { fr: "+216 50 123 456", ar: "+216 50 123 456" },
        email: { fr: "contact@cajuta.tn", ar: "contact@cajuta.tn" }
      },
      paragraphs: {
        fr: ["© 2024 Cajuta. Tous droits réservés.", "Fruits secs caramélisés artisanaux fabriqués en Tunisie avec passion."],
        ar: ["© 2024 كاجوتا. جميع الحقوق محفوظة.", "فواكة جافة مكرملة حرفية مصنوعة في تونس بالشغف."]
      }
    },
    finalCta: {
      title: { fr: "Prêt à craquer ?", ar: "جاهز للقرمشة؟" },
      text: { fr: "Passez votre commande maintenant et recevez vos délices dans les plus brefs délais.", ar: "قدم طلبك الان واستلم لذيذاتك في اقرب وقت ممكن." },
      button: { fr: "Commander", ar: "اطلب الآن" }
    },
    images: {},
    sectionOrder: [
      { key: "hero", label: "Hero" },
      { key: "trustBar", label: "Barre de confiance" },
      { key: "products", label: "Produits" },
      { key: "whyChooseUs", label: "Pourquoi nous choisir" },
      { key: "story", label: "Notre histoire" },
      { key: "occasions", label: "Occasions" },
      { key: "packs", label: "Packs" },
      { key: "testimonials", label: "Avis clients" },
      { key: "delivery", label: "Livraison" },
      { key: "faq", label: "FAQ" },
      { key: "cta", label: "Call to Action" }
    ],
    customSections: []
  }
};

async function importSiteContent() {
  console.log("🚀 Script d'import du contenu du site vers Supabase\n");
  console.log("=".repeat(60) + "\n");

  console.log("📤 Import du contenu principal...\n");

  const { error } = await supabase
    .from("site_content")
    .upsert(siteContentToImport, { onConflict: "id" });

  if (error) {
    console.error("❌ Erreur lors de l'import:", error.message);
    process.exit(1);
  }

  console.log("✅ Contenu du site importé avec succès !\n");
  console.log("📊 Détails:");
  console.log("   - Hero section");
  console.log("   - Trust bar");
  console.log("   - Story");
  console.log("   - Delivery info");
  console.log("   - Occasions");
  console.log("   - Packs");
  console.log("   - Footer");
  console.log("   - Final CTA\n");
  console.log("🎉 Import terminé!\n");
}

importSiteContent().catch(console.error);