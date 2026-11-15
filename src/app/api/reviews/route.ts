import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import Review from "@/models/Review";
import { SEED_REVIEWS } from "@/data/seedReviews";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({
      reviews: SEED_REVIEWS.map((r, i) => ({
        id: `seed-rev-${i}`,
        name: r.name,
        service: r.service,
        duration: r.duration,
        rating: r.rating,
        message: r.message,
        ts: r.createdAt.getTime(),
      })),
      dbConfigured: false,
    });
  }

  try {
    await connectToDatabase();
    let docs = await Review.find().sort({ createdAt: -1 }).lean();

    // If database is empty or needs seeding with client reviews
    if (!docs || docs.length === 0) {
      await Review.insertMany(SEED_REVIEWS);
      docs = await Review.find().sort({ createdAt: -1 }).lean();
    }

    const reviews = docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      service: d.service,
      duration: d.duration || "",
      rating: d.rating,
      message: d.message,
      ts: new Date(d.createdAt).getTime(),
    }));

    return NextResponse.json({ reviews, dbConfigured: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json(
      {
        error: msg,
        reviews: SEED_REVIEWS.map((r, i) => ({
          id: `seed-rev-${i}`,
          name: r.name,
          service: r.service,
          duration: r.duration,
          rating: r.rating,
          message: r.message,
          ts: r.createdAt.getTime(),
        })),
        dbConfigured: true,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request payload." },
        { status: 400 }
      );
    }

    const name = String(body?.name || "").trim().slice(0, 50);
    const service = String(body?.service || "Body Transformation")
      .trim()
      .slice(0, 60);
    const duration = String(body?.duration || "").trim().slice(0, 30);
    const rating = Math.min(5, Math.max(1, Number(body?.rating) || 5));
    const message = String(body?.message || "").trim().slice(0, 500);

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and review message are required." },
        { status: 400 }
      );
    }

    if (isMongoConfigured()) {
      try {
        await connectToDatabase();
        const doc = await Review.create({
          name,
          service,
          duration,
          rating,
          message,
        });

        return NextResponse.json(
          {
            review: {
              id: String(doc._id),
              name: doc.name,
              service: doc.service,
              duration: doc.duration || "",
              rating: doc.rating,
              message: doc.message,
              ts: new Date(doc.createdAt).getTime(),
            },
          },
          { status: 201 }
        );
      } catch (dbErr) {
        console.error("[api/reviews POST] db error:", dbErr);
        const fallbackId = `rev-${Date.now()}`;
        return NextResponse.json(
          {
            review: {
              id: fallbackId,
              name,
              service,
              duration,
              rating,
              message,
              ts: Date.now(),
            },
          },
          { status: 201 }
        );
      }
    } else {
      const fallbackId = `rev-${Date.now()}`;
      return NextResponse.json(
        {
          review: {
            id: fallbackId,
            name,
            service,
            duration,
            rating,
            message,
            ts: Date.now(),
          },
        },
        { status: 201 }
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save review";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
