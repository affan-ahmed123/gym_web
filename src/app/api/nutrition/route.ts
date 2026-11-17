import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Nutrition from "@/models/Nutrition";
import type { NutritionProduct } from "@/types/fitness";

const DEFAULT_PRODUCTS: NutritionProduct[] = [
  {
    id: "nutr-protein-1",
    title: "100% Gold Standard Whey Isolate",
    category: "Whey Protein",
    price: "PKR 18,500",
    servingSize: "2.27 kg (5 lbs) · 74 Servings",
    description:
      "25g pure micro-filtered whey isolate per scoop with 5.5g BCAAs and 4g Glutamine. Zero sugar, instantized for rapid muscle recovery and lean muscle growth.",
    imageUrl:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1000&q=80",
    badge: "Best Seller",
    featured: true,
  },
  {
    id: "nutr-creatine-2",
    title: "Creapure® Micronized Creatine Monohydrate",
    category: "Creatine",
    price: "PKR 6,800",
    servingSize: "300g · 60 Servings (5g per scoop)",
    description:
      "100% pharmaceutical-grade unflavored micronized creatine monohydrate. Saturates intramuscular phosphocreatine stores for explosive strength, power, and cell hydration.",
    imageUrl:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1000&q=80",
    badge: "Strength Essential",
    featured: true,
  },
  {
    id: "nutr-preworkout-3",
    title: "Explosive Nitric Oxide Pre-Workout Matrix",
    category: "Pre-Workout",
    price: "PKR 8,500",
    servingSize: "390g · 30 Intense Servings",
    description:
      "Loaded with 6g L-Citrulline Malate, 3.2g Beta-Alanine, and 300mg Caffeine Anhydrous for skin-splitting pumps, razor focus, and unmatched muscular endurance.",
    imageUrl:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=80",
    badge: "High Stimulant",
    featured: true,
  },
  {
    id: "nutr-bcaa-4",
    title: "Essential BCAA + Electrolyte Hydration Fuel",
    category: "Recovery & Aminos",
    price: "PKR 7,200",
    servingSize: "420g · 30 Servings",
    description:
      "Fermented 2:1:1 Leucine, Isoleucine & Valine complex infused with raw coconut water powder and pink Himalayan salt to optimize intra-workout stamina.",
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
    badge: "Intra-Workout",
    featured: true,
  },
  {
    id: "nutr-vitamins-5",
    title: "Elite Athlete Daily Multivitamin & Zinc Matrix",
    category: "Vitamins & Health",
    price: "PKR 4,800",
    servingSize: "90 Tablets · 45 Servings",
    description:
      "Comprehensive micronutrient foundation with high-potency Vitamin D3, Zinc, Magnesium Bisglycinate, and antioxidant botanicals for peak immune defense.",
    imageUrl:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=1000&q=80",
    badge: "Daily Vitality",
    featured: true,
  },
  {
    id: "nutr-gainer-6",
    title: "Anabolic Mass Gainer Pro Matrix",
    category: "Whey Protein",
    price: "PKR 14,200",
    servingSize: "5.4 kg (12 lbs) · 32 Servings",
    description:
      "1,250 high-quality calories and 50g precision protein blend per serving designed for hardgainers looking to pack on serious, dense muscle mass.",
    imageUrl:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1000&q=80",
    badge: "Mass Fuel",
    featured: true,
  },
];

let memoryProducts: NutritionProduct[] = [...DEFAULT_PRODUCTS];

export async function GET() {
  try {
    await connectToDatabase();
    let docs = await Nutrition.find({}).sort({ createdAt: -1 }).lean();

    // If MongoDB is connected but has no documents yet, seed default rich products into the database
    if (!docs || docs.length === 0) {
      try {
        await Nutrition.insertMany(
          DEFAULT_PRODUCTS.map((p) => ({
            title: p.title,
            category: p.category,
            price: p.price,
            servingSize: p.servingSize,
            description: p.description,
            imageUrl: p.imageUrl,
            badge: p.badge,
            featured: p.featured,
          }))
        );
        docs = await Nutrition.find({}).sort({ createdAt: -1 }).lean();
      } catch (seedErr) {
        console.warn("Could not seed default nutrition into MongoDB:", seedErr);
      }
    }

    if (docs && docs.length > 0) {
      const products: NutritionProduct[] = docs.map((d: any) => ({
        id: d._id.toString(),
        title: d.title,
        category: d.category,
        price: d.price,
        servingSize: d.servingSize || "",
        description: d.description,
        imageUrl: d.imageUrl,
        badge: d.badge || "",
        featured: Boolean(d.featured),
        createdAt: d.createdAt ? new Date(d.createdAt).getTime() : Date.now(),
      }));
      memoryProducts = [...products];
      return NextResponse.json({ products, source: "mongodb" });
    }

    return NextResponse.json({ products: memoryProducts, source: "memory" });
  } catch (err) {
    console.error("[api/nutrition GET] error:", err);
    return NextResponse.json({
      products: memoryProducts,
      source: "fallback",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, price, servingSize, description, imageUrl, badge, featured } = body;

    if (!title || !description || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Title, Price, Description, and Image are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const created = await Nutrition.create({
      title: title.trim(),
      category: (category || "Whey Protein").trim(),
      price: price.trim(),
      servingSize: (servingSize || "").trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      badge: (badge || "").trim(),
      featured: Boolean(featured),
    });

    const docs = await Nutrition.find({}).sort({ createdAt: -1 }).lean();
    const products: NutritionProduct[] = docs.map((d: any) => ({
      id: d._id.toString(),
      title: d.title,
      category: d.category,
      price: d.price,
      servingSize: d.servingSize || "",
      description: d.description,
      imageUrl: d.imageUrl,
      badge: d.badge || "",
      featured: Boolean(d.featured),
      createdAt: d.createdAt ? new Date(d.createdAt).getTime() : Date.now(),
    }));

    return NextResponse.json(
      {
        success: true,
        product: {
          id: created._id.toString(),
          title: created.title,
          category: created.category,
          price: created.price,
          servingSize: created.servingSize,
          description: created.description,
          imageUrl: created.imageUrl,
          badge: created.badge,
          featured: created.featured,
        },
        products,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[api/nutrition POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create nutrition product." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    // Always filter out from in-memory store
    memoryProducts = memoryProducts.filter((p) => p.id !== id);

    try {
      await connectToDatabase();

      const count = await Nutrition.countDocuments();
      if (count === 0) {
        // If MongoDB was not populated, seed everything except the deleted product
        const toSeed = DEFAULT_PRODUCTS.filter((p) => p.id !== id).map((p) => ({
          title: p.title,
          category: p.category,
          price: p.price,
          servingSize: p.servingSize,
          description: p.description,
          imageUrl: p.imageUrl,
          badge: p.badge,
          featured: p.featured,
        }));
        if (toSeed.length > 0) {
          await Nutrition.insertMany(toSeed);
        }
      } else {
        // Try deleting by MongoDB ObjectId or matching title
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await Nutrition.findByIdAndDelete(id);
        } else {
          const target = DEFAULT_PRODUCTS.find((p) => p.id === id);
          if (target) {
            await Nutrition.deleteOne({ title: target.title });
          } else {
            await Nutrition.findByIdAndDelete(id).catch(() => {});
          }
        }
      }

      const docs = await Nutrition.find({}).sort({ createdAt: -1 }).lean();
      const products: NutritionProduct[] = docs.map((d: any) => ({
        id: d._id.toString(),
        title: d.title,
        category: d.category,
        price: d.price,
        servingSize: d.servingSize || "",
        description: d.description,
        imageUrl: d.imageUrl,
        badge: d.badge || "",
        featured: Boolean(d.featured),
        createdAt: d.createdAt ? new Date(d.createdAt).getTime() : Date.now(),
      }));

      memoryProducts = [...products];
      return NextResponse.json({ success: true, products });
    } catch {
      // Return in-memory list if MongoDB is not reachable
      return NextResponse.json({ success: true, products: memoryProducts });
    }
  } catch (err: any) {
    console.error("[api/nutrition DELETE] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}

