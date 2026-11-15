import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import {
  isCloudinaryConfigured,
  uploadImage,
  deleteImage,
} from "@/lib/cloudinary";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  const cloudinaryConfigured = isCloudinaryConfigured();

  if (!isMongoConfigured()) {
    return NextResponse.json({
      photoUrl: null,
      width: 800,
      height: 1000,
      provider: "none",
      cloudinaryConfigured,
      dbConfigured: false,
    });
  }

  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOne({ key: "profile" }).lean();
    return NextResponse.json({
      photoUrl: doc?.photoUrl || null,
      width: doc?.photoWidth || 800,
      height: doc?.photoHeight || 1000,
      provider: doc?.photoProvider || "local_mongodb",
      publicId: doc?.photoPublicId || "",
      cloudinaryConfigured,
      dbConfigured: true,
    });
  } catch {
    return NextResponse.json({
      photoUrl: null,
      width: 800,
      height: 1000,
      provider: "none",
      cloudinaryConfigured,
      dbConfigured: true,
    });
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MONGODB_URI is not configured in .env.local." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const rawPhoto = typeof body?.photoUrl === "string" ? body.photoUrl : "";
    const width = Math.min(2400, Math.max(300, Number(body?.width) || 800));
    const height = Math.min(3000, Math.max(300, Number(body?.height) || 1000));
    const crop = body?.crop === "thumb" ? "thumb" : "fill";

    if (!rawPhoto || (!rawPhoto.startsWith("data:image/") && !rawPhoto.startsWith("http"))) {
      return NextResponse.json(
        { error: "Valid image data or URL is required." },
        { status: 400 }
      );
    }

    // Process image through Cloudinary (or optimized fallback)
    const uploadRes = await uploadImage(rawPhoto, {
      width,
      height,
      crop,
      gravity: "face",
    });

    await connectToDatabase();

    const existing = await SiteSettings.findOne({ key: "profile" });
    if (existing?.photoPublicId && existing.photoPublicId !== uploadRes.publicId) {
      await deleteImage(existing.photoPublicId).catch(() => { });
    }

    const doc = await SiteSettings.findOneAndUpdate(
      { key: "profile" },
      {
        key: "profile",
        photoUrl: uploadRes.url,
        photoWidth: uploadRes.width,
        photoHeight: uploadRes.height,
        photoProvider: uploadRes.provider,
        photoPublicId: uploadRes.publicId || "",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      photoUrl: doc.photoUrl,
      width: doc.photoWidth,
      height: doc.photoHeight,
      provider: doc.photoProvider,
      cloudinaryConfigured: isCloudinaryConfigured(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save photo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MONGODB_URI is not configured in .env.local." },
      { status: 503 }
    );
  }

  try {
    await connectToDatabase();
    const existing = await SiteSettings.findOne({ key: "profile" });
    if (existing?.photoPublicId) {
      await deleteImage(existing.photoPublicId).catch(() => { });
    }

    await SiteSettings.findOneAndUpdate(
      { key: "profile" },
      {
        key: "profile",
        photoUrl: null,
        photoPublicId: "",
      },
      { upsert: true }
    );

    return NextResponse.json({
      photoUrl: null,
      cloudinaryConfigured: isCloudinaryConfigured(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to remove photo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
