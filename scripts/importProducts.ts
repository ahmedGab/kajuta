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

const productsToImport = [
  {
    id: "amandes-caramelisees",
    name: "Amandes Caramélisées",
    slug: "amandes-caramelisees",
    shortDescription: "Des amandes croquantes enrobées d'un délicieux caramel artisanal.",
    description: "Découvrez l'équilibre parfait entre le croquant de nos amandes sélectionnées et la douceur de notre caramel traditionnel. Chaque amande est caramélisée à la main avec passion et savoir-faire pour vous offrir une expérience gourmande inoubliable, idéale pour accompagner vos thés ou comme en-cas premium.",
    image: "https://images.unsplash.com/photo-1599598425947-33004bb15286?auto=format&fit=crop&q=80&w=800",
    price: 35,
    weight: "250g",
    alt: "Amandes caramélisées croquantes de Cajuta, Tunisie",
    ingredients: ["Amandes de premier choix", "Sucre raffiné", "Beurre artisanal", "Pincée de sel de mer"],
    benefits: ["Riche en vitamine E", "Source d'énergie naturelle", "Sans conservateurs", "Texture parfaitement croustillante"],
    occasions: ["Ramadan", "Aid", "Cadeaux", "Réception d'invités"],
    seoTitle: "Amandes Caramélisées Premium Tunisie | Cajuta",
    seoDescription: "Achetez les meilleures amandes caramélisées en Tunisie. Des fruits secs croquants et une caramélisation artisanale. Livraison express dans toute la Tunisie."
  },
  {
    id: "cajou-caramelisees",
    name: "Noix de Cajou Caramélisées",
    slug: "noix-de-cajou-caramelisees",
    shortDescription: "La noblesse de la noix de cajou sublimée par un caramel fondant.",
    description: "Nos noix de cajou géantes sont délicatement grillées puis enrobées dans un bain de caramel onctueux. Le mariage entre la texture beurrée de la cajou et le croquant du caramel crée une symphonie de saveurs. Un véritable délice pour les épicuriens cherchant un snack haut de gamme.",
    image: "https://images.unsplash.com/photo-1536555134114-1e07cb5b5c96?auto=format&fit=crop&q=80&w=800",
    price: 45,
    weight: "250g",
    alt: "Noix de cajou caramélisées premium, Cajuta",
    ingredients: ["Noix de cajou Premium (Calibre W240)", "Sucre blanc", "Extrait de vanille", "Sel"],
    benefits: ["Riche en minéraux (Magnésium, Cuivre)", "Goût beurré unique", "Gourmandise haut de gamme", "Fabrication artisanale tunisienne"],
    occasions: ["Soirées en famille", "Cadeau d'affaires", "Aid", "Événements festifs"],
    seoTitle: "Noix de Cajou Caramélisées Tunisie | Snack Premium | Cajuta",
    seoDescription: "Goûtez nos noix de cajou caramélisées à la perfection. Un en-cas premium et gourmand. Cajuta livre partout en Tunisie (Tunis, Sfax, Sousse...)."
  },
  {
    id: "noisettes-caramelisees",
    name: "Noisettes Caramélisées",
    slug: "noisettes-caramelisees",
    shortDescription: "Des noisettes torréfiées avec amour sous une fine couche de caramel.",
    description: "Retrouvez le goût authentique des noisettes grâce à notre procédé de caramélisation douce. La fine couche de sucre vient révéler la puissance aromatique de nos noisettes soigneusement sélectionnées. Un régal irrésistible qui ravira petits et grands.",
    image: "https://images.unsplash.com/photo-1596706927909-66c5a0ec7b98?auto=format&fit=crop&q=80&w=800",
    price: 40,
    weight: "250g",
    alt: "Noisettes caramélisées fondantes, Cajuta Tunisie",
    ingredients: ["Noisettes torréfiées entières", "Sucre cristallisé", "Miel naturel"],
    benefits: ["Antioxydants", "Vitamine B et fibres", "Arôme intense", "Réconfortant"],
    occasions: ["Soirées hivernales", "Fêtes", "Anniversaires", "Cadeaux gourmands"],
    seoTitle: "Noisettes Caramélisées Artisanales | Cajuta Tunisie",
    seoDescription: "Savourez l'excellence avec nos noisettes caramélisées artisanales. La qualité Cajuta livrée chez vous en un clic."
  },
  {
    id: "pistaches-caramelisees",
    name: "Pistaches Caramélisées",
    slug: "pistaches-caramelisees",
    shortDescription: "L'or vert des fruits secs dans une robe caramélisée craquante.",
    description: "Une explosion de couleurs et de saveurs ! Nos pistaches décortiquées sont caramélisées très finement pour conserver leur couleur verte vibrante et leur goût si particulier sans être trop sucrées. Le choix ultime pour impressionner vos convives.",
    image: "https://images.unsplash.com/photo-1619604106566-f542af42526c?auto=format&fit=crop&q=80&w=800",
    price: 55,
    weight: "200g",
    alt: "Pistaches vertes caramélisées, Cajuta",
    ingredients: ["Pistaches décortiquées top qualité", "Sucre", "Une touche d'eau de rose"],
    benefits: ["Excellente source de protéines", "Visuel exceptionnel", "Subtil mélange de saveurs", "Raffinement garanti"],
    occasions: ["Fiançailles", "Mariages", "Cadeaux VIP", "Ramadan"],
    seoTitle: "Pistaches Caramélisées | Fruits secs premium | Cajuta",
    seoDescription: "Optez pour nos pistaches caramélisées d'exception. Un produit rare et raffiné pour vos grandes occasions. Commandez sur Cajuta."
  },
  {
    id: "mix-cajuta",
    name: "Mix Cajuta",
    slug: "mix-cajuta",
    shortDescription: "Le meilleur de nos 4 variétés réunies dans un même sachet.",
    description: "Vous n'arrivez pas à vous décider ? Le Mix Cajuta rassemble avec harmonie nos amandes, noix de cajou, noisettes et pistaches caramélisées. Chaque bouchée est une nouvelle surprise. Parfait pour découvrir notre savoir-faire ou pour offrir.",
    image: "https://images.unsplash.com/photo-1608039783021-6116a558f0dd?auto=format&fit=crop&q=80&w=800",
    price: 45,
    weight: "250g",
    alt: "Assortiment de fruits secs caramélisés Mix Cajuta",
    ingredients: ["Amandes", "Noix de Cajou", "Noisettes", "Pistaches", "Caramel artisanal"],
    benefits: ["Découverte de toutes les saveurs", "Idéal pour partager", "Palette de couleurs et textures", "Parfait équilibre"],
    occasions: ["Coffee break", "Box Ramadan", "Cadeaux de fin d'année", "Toute occasion"],
    seoTitle: "Assortiment Fruits Secs Caramélisés Tunisie | Mix Cajuta",
    seoDescription: "Craquez pour le Mix Cajuta : cajou, pistaches, noisettes et amandes caramélisés. L'assortiment gourmand suprême en Tunisie."
  }
];

async function checkExistingProducts() {
  console.log("\n🔍 Vérification des produits existants dans Supabase...\n");
  
  const { data, error } = await supabase
    .from("products")
    .select("id, data")
    .limit(10);

  if (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    console.log(`⚠️  ${data.length} produit(s) trouvé(s) dans Supabase:\n`);
    data.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.data?.name || p.id}`);
    });
    return data;
  } else {
    console.log("✅ Aucun produit existant dans Supabase\n");
    return [];
  }
}

async function importProducts() {
  console.log("🚀 Script d'import des produits Cajuta vers Supabase\n");
  console.log("=" .repeat(60) + "\n");

  const existingProducts = await checkExistingProducts();

  if (existingProducts === null) {
    console.log("❌ Impossible de se connecter à Supabase");
    console.log("   Vérifiez les variables d'environnement:");
    console.log("   - NEXT_PUBLIC_SUPABASE_URL");
    console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  if (existingProducts.length > 0) {
    console.log("\n⚠️  Des produits existent déjà. Voulez-vous:");
    console.log("   1. Écraser tous les produits existants");
    console.log("   2. Ajouter les nouveaux produits (garder les existants)");
    console.log("   3. Annuler l'opération\n");

    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "Que voulez-vous faire?",
      choices: [
        "1. Écraser tous les produits existants",
        "2. Ajouter les nouveaux produits",
        "3. Annuler l'opération"
      ]
    });

    if (action === "3" || action.includes("Annuler")) {
      console.log("\n❌ Opération annulée par l'utilisateur");
      process.exit(0);
    }

    if (action.includes("Écraser")) {
      console.log("\n🗑️  Suppression des produits existants...\n");
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .not("id", "is", null);

      if (deleteError) {
        console.error("❌ Erreur lors de la suppression:", deleteError.message);
        process.exit(1);
      }
      console.log("✅ Produits existants supprimés\n");
    }
  }

  console.log("📦 Produits à importer:\n");
  productsToImport.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.name} (ID: ${p.id})`);
  });

  console.log("\n" + "=".repeat(60));
  console.log("Confirmation requise pour chaque produit:\n");

  const confirmedProducts = [];

  for (const product of productsToImport) {
    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Importer "${product.name}"?`,
      default: true
    });

    if (confirm) {
      confirmedProducts.push(product);
      console.log(`   ✅ ${product.name} - Confirmed`);
    } else {
      console.log(`   ❌ ${product.name} - Skipped`);
    }
  }

  if (confirmedProducts.length === 0) {
    console.log("\n❌ Aucun produit sélectionné. Opération annulée.");
    process.exit(0);
  }

  console.log(`\n📤 Import de ${confirmedProducts.length} produit(s)...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of confirmedProducts) {
    const record = {
      id: product.id,
      data: product
    };

    const { error } = await supabase
      .from("products")
      .upsert(record, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Erreur pour ${product.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`   ✅ ${product.name} - Imported successfully`);
      successCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Résumé de l'import:");
  console.log(`   ✅ ${successCount} produit(s) importé(s) avec succès`);
  if (errorCount > 0) {
    console.log(`   ❌ ${errorCount} erreur(s)`);
  }
  console.log("\n🎉 Import terminé!\n");
}

importProducts().catch(console.error);