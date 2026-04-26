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

const faqToImport = [
  {
    id: "f1",
    data: {
      id: "f1",
      questionFr: "Où livrez-vous ?",
      questionAr: "أين تسلمون؟",
      answerFr: "Nous livrons partout en Tunisie ! Tunis, Sfax, Sousse, Bizerte, Nabeul et toutes les autres régions du pays avec nos partenaires de livraison rapides.",
      answerAr: "نوصل في كل مكان في تونس! تونس، صفاقس، سوسة، بنزرت، نابل وجميع المناطق الاخرى."
    }
  },
  {
    id: "f2",
    data: {
      id: "f2",
      questionFr: "Comment puis-je passer commande ?",
      questionAr: "كيف يمكنني الطلب؟",
      answerFr: "C'est très simple : parcourez notre site, choisissez les produits ou packs qui vous plaisent et cliquez sur 'Commander sur WhatsApp'. Nous prendrons en charge votre commande rapidement.",
      answerAr: "بسيط جدا: تصفح موقعنا، اختر المنتجات او الحزم التي تعجبك وانقر على 'اطلب عبر واتساب'."
    }
  },
  {
    id: "f3",
    data: {
      id: "f3",
      questionFr: "Combien de temps se conservent les produits ?",
      questionAr: "كم من tiempo se conservan los productos?",
      answerFr: "Nos fruits secs caramélisés se conservent jusqu'à 6 mois dans un endroit sec, à l'abri de l'humidité et de la chaleur grâce à nos sachets refermables qui préservent leur croquant.",
      answerAr: "الفواكة الجافة المكرملة تبقى حتى 6 اشهر في مكان جاف بعيدا عن الرطوبة والحرارة."
    }
  },
  {
    id: "f4",
    data: {
      id: "f4",
      questionFr: "Proposez-vous des coffrets cadeaux ?",
      questionAr: "هل تقدمون صناديق هدايا؟",
      answerFr: "Absolument. Nous proposons des packs et des coffrets spéciaux pour l'Aïd, le Ramadan et les grandes occasions avec un packaging luxueux.",
      answerAr: "بالتأكيد. نقدم حزم وصناديق خاصة للعيد ورمضان والمناسبات الكبيرة."
    }
  }
];

async function checkExisting() {
  console.log("\n🔍 Vérification des FAQs existantes dans Supabase...\n");

  const { data, error } = await supabase
    .from("faq")
    .select("id, data")
    .limit(10);

  if (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    console.log(`⚠️  ${data.length} FAQ(s) trouvée(s):\n`);
    data.forEach((f, i) => console.log(`   ${i + 1}. ${f.data?.questionFr || f.id}`));
    return data;
  } else {
    console.log("✅ Aucune FAQ existante\n");
    return [];
  }
}

async function importFAQ() {
  console.log("🚀 Script d'import des FAQs vers Supabase\n");
  console.log("=".repeat(60) + "\n");

  const existing = await checkExisting();

  if (existing === null) {
    console.log("❌ Impossible de se connecter à Supabase");
    process.exit(1);
  }

  console.log("📦 FAQs à importer:\n");
  faqToImport.forEach((f, i) => console.log(`   ${i + 1}. ${f.data.questionFr}`));

  if (existing.length > 0) {
    console.log("\n⚠️  Des FAQs existent déjà. Voulez-vous:");
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "Que voulez-vous faire?",
      choices: [
        "1. Écraser toutes les FAQs existantes",
        "2. Ajouter les nouvelles FAQs",
        "3. Annuler l'opération"
      ]
    });

    if (action.includes("Annuler")) {
      console.log("\n❌ Opération annulée");
      process.exit(0);
    }

    if (action.includes("Écraser")) {
      console.log("\n🗑️  Suppression des FAQs existantes...\n");
      await supabase.from("faq").delete().not("id", "is", null);
      console.log("✅ FAQs existantes supprimées\n");
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("Import automatique de toutes les FAQs:\n");

  const confirmed = faqToImport;

  if (confirmed.length === 0) {
    console.log("\n❌ Aucune FAQ sélectionnée. Opération annulée.");
    process.exit(0);
  }

  console.log(`\n📤 Import de ${confirmed.length} FAQ(s)...\n`);

  let success = 0;
  for (const f of confirmed) {
    const { error } = await supabase.from("faq").upsert(f, { onConflict: "id" });
    if (error) {
      console.error(`   ❌ Erreur pour "${f.data.questionFr}":`, error.message);
    } else {
      console.log(`   ✅ "${f.data.questionFr}" - Importée`);
      success++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Résumé: ✅ ${success} FAQ(s) importée(s)\n`);
  console.log("🎉 Import terminé!\n");
}

importFAQ().catch(console.error);