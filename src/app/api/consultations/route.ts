import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import Consultation from "@/models/Consultation";

export async function GET() {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ consultations: [], dbConfigured: false });
  }

  try {
    await connectToDatabase();
    const docs = await Consultation.find().sort({ createdAt: -1 }).lean();
    const consultations = docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      phone: d.phone,
      email: d.email,
      age: d.age ?? null,
      goal: d.goal,
      fitnessLevel: d.fitnessLevel,
      trainingType: d.trainingType,
      preferredTime: d.preferredTime,
      healthNotes: d.healthNotes,
      message: d.message,
      status: d.status,
      ts: new Date(d.createdAt).getTime(),
    }));

    return NextResponse.json({ consultations, dbConfigured: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        error:
          "MongoDB Atlas configured nahi hai. .env.local mein MONGODB_URI add karein.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const name = String(body?.name || "").trim().slice(0, 80);
    const phone = String(body?.phone || "").trim().slice(0, 40);
    const email = String(body?.email || "").trim().slice(0, 120);
    const goal = String(body?.goal || "").trim().slice(0, 120);

    if (!name || !phone || !email || !goal) {
      return NextResponse.json(
        { error: "Name, Phone, Email aur Goal zaroor bharein." },
        { status: 400 }
      );
    }

    const parsedAge = body?.age ? Number(body.age) : undefined;
    const age =
      parsedAge && !Number.isNaN(parsedAge) && parsedAge >= 10 && parsedAge <= 90
        ? parsedAge
        : undefined;

    await connectToDatabase();
    const doc = await Consultation.create({
      name,
      phone,
      email,
      age,
      goal,
      fitnessLevel: String(body?.fitnessLevel || "Beginner").trim(),
      trainingType: String(
        body?.trainingType || "In-Person (Private Studio - Malir Cantt)"
      ).trim(),
      preferredTime: String(body?.preferredTime || "Flexible").trim(),
      healthNotes: String(body?.healthNotes || "").trim().slice(0, 300),
      message: String(body?.message || "").trim().slice(0, 1000),
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        id: String(doc._id),
      },
      { status: 201 }
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Failed to submit consultation";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

