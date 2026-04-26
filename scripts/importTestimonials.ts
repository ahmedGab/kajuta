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

const testimonialsToImport = [
  {
    id: "t1",
    data: {
      id: "t1",
      firstName: "Amira",
      city: "Tunis",
      rating: 5,
      comment: "Excellent ! Les noix de cajou caramélisées sont un pur délice. Emballage très premium, parfait pour offrir pendant le Ramadan."
    }
  },
  {
    id: "t2",
    data: {
      id: "t2",
      firstName: "Sami",
      city: "Sfax",
      rating: 5,
      comment: "Livraison rapide et produit de très haute qualité. Les pistaches sont exceptionnelles, on sent vraiment le fait-maison."
    }
  },
  {
    id: "t3",
    data: {
      id: "t3",
      firstName: "Yasmine",
      city: "Sousse",
      rating: 4,
      comment: "Le Mix Cajuta a eu un succès fou auprès de mes invités. Le caramel est croquant et pas trop sucré. Je recommanderai avec plaisir."
    }
  }
];

async function checkExisting() {
  console.log("\n🔍 Vérification des témoignages existants dans Supabase...\n");

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, data")
    .limit(10);

  if (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    console.log(`⚠️  ${data.length} témoignage(s) trouvé(s):\n`);
    data.forEach((t, i) => console.log(`   ${i + 1}. ${t.data?.firstName || t.id}`));
    return data;
  } else {
    console.log("✅ Aucun témoignage existant\n");
    return [];
  }
}

async function importTestimonials() {
  console.log("🚀 Script d'import des témoignages vers Supabase\n");
  console.log("=".repeat(60) + "\n");

  const existing = await checkExisting();

  if (existing === null) {
    console.log("❌ Impossible de se connecter à Supabase");
    process.exit(1);
  }

  console.log("📦 Témoignages à importer:\n");
  testimonialsToImport.forEach((t, i) => console.log(`   ${i + 1}. ${t.data.firstName} - ${t.data.city}`));

  if (existing.length > 0) {
    console.log("\n⚠️  Des témoignages existent déjà. Voulez-vous:");
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "Que voulez-vous faire?",
      choices: [
        "1. Écraser tous les témoignages existants",
        "2. Ajouter les nouveaux témoignages",
        "3. Annuler l'opération"
      ]
    });

    if (action.includes("Annuler")) {
      console.log("\n❌ Opération annulée");
      process.exit(0);
    }

    if (action.includes("Écraser")) {
      console.log("\n🗑️  Suppression des témoignages existants...\n");
      await supabase.from("testimonials").delete().not("id", "is", null);
      console.log("✅ Témoignages existants supprimés\n");
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("Import automatique de tous les témoignages:\n");

  const confirmed = testimonialsToImport;

  if (confirmed.length === 0) {
    console.log("\n❌ Aucun témoignage sélectionné. Opération annulée.");
    process.exit(0);
  }

  console.log(`\n📤 Import de ${confirmed.length} témoignage(s)...\n`);

  let success = 0;
  for (const t of confirmed) {
    const { error } = await supabase.from("testimonials").upsert(t, { onConflict: "id" });
    if (error) {
      console.error(`   ❌ Erreur pour ${t.data.firstName}:`, error.message);
    } else {
      console.log(`   ✅ ${t.data.firstName} - Importé`);
      success++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Résumé: ✅ ${success} témoignage(s) importé(s)\n`);
  console.log("🎉 Import terminé!\n");
}

importTestimonials().catch(console.error);