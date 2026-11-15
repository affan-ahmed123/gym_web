import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import SiteSettings, { IWorkoutVideo } from "@/models/SiteSettings";

const DEFAULT_VIDEOS: IWorkoutVideo[] = [
  {
    id: "vid-1",
    title: "Barbell Back Squat & Lower Body Power",
    category: "Strength & Hypertrophy",
    videoUrl: "/videos/1.mp4",
    posterUrl: "",
    tag: "Leg Mastery · 4 Sets × 8 Reps",
    cue: "Drive knees out · Chest tall · Explode through heels",
    durationSeconds: 7,
  },
  {
    id: "vid-2",
    title: "Incline Dumbbell Chest Press & Pec Contraction",
    category: "Chest Hypertrophy",
    videoUrl: "/videos/3.mp4",
    posterUrl: "",
    tag: "Hypertrophy Tempo · 3-1-1 Cadence",
    cue: "Controlled eccentric deep stretch · Lock elbows at 85%",
    durationSeconds: 7,
  },
  {
    id: "vid-3",
    title: "Overhead Dumbbell Shoulder Press",
    category: "Deltoid Conditioning",
    videoUrl: "/videos/5.mp4",
    posterUrl: "",
    tag: "Shoulder Boulders · 4 Sets × 10 Reps",
    cue: "Engage core · Push vertically through full range · Controlled descent",
    durationSeconds: 7,
  },
  {
    id: "vid-4",
    title: "Bent-Over Barbell Row & Lat Thickness",
    category: "Back & Posterior Chain",
    videoUrl: "/videos/6.mp4",
    posterUrl: "",
    tag: "Lat Hypertrophy · Strict Form",
    cue: "Hinge at hips · Pull elbows behind torso · Squeeze scapula",
    durationSeconds: 7,
  },
  {
    id: "vid-5",
    title: "Strict Standing Bicep Curls & Peak Contraction",
    category: "Arm Sculpting",
    videoUrl: "/videos/10.mp4",
    posterUrl: "",
    tag: "Bicep Peak · Isolated Contraction",
    cue: "Pin elbows to ribs · Supinate pinky at the apex · Zero momentum",
    durationSeconds: 7,
  },
  {
    id: "vid-6",
    title: "Athletic Core Stabilization & Anti-Rotation",
    category: "Core & Kinetic Power",
    videoUrl: "/videos/11.mp4",
    posterUrl: "",
    tag: "Functional Core · Kinetic Stability",
    cue: "Brace deep transverse abdominis · Maintain rigid torso align",
    durationSeconds: 7,
  },
  {
    id: "vid-7",
    title: "Dynamic Kinetic Mobility & Explosive Conditioning",
    category: "Functional Athleticism",
    videoUrl: "/videos/12.mp4",
    posterUrl: "",
    tag: "Athletic Conditioning · Full Agility",
    cue: "Triple extension · Smooth decelerations · Max metabolic output",
    durationSeconds: 7,
  },
];

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ videos: DEFAULT_VIDEOS, dbConfigured: false });
  }

  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOne({ key: "profile" }).lean();
    
    // If videos don't exist, are old mixkit placeholders, or have .MOV (which fails in Chrome)
    const needsUpgrade =
      !doc?.workoutVideos ||
      doc.workoutVideos.length === 0 ||
      doc.workoutVideos.some(
        (v: any) =>
          v.videoUrl?.includes("mixkit.co") || v.videoUrl?.includes(".MOV")
      );

    if (needsUpgrade) {
      await SiteSettings.findOneAndUpdate(
        { key: "profile" },
        { workoutVideos: DEFAULT_VIDEOS },
        { upsert: true }
      );
      return NextResponse.json({ videos: DEFAULT_VIDEOS, dbConfigured: true });
    }

    return NextResponse.json({ videos: doc.workoutVideos, dbConfigured: true });
  } catch {
    return NextResponse.json({ videos: DEFAULT_VIDEOS, dbConfigured: true });
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
    const { video, videos } = body;

    await connectToDatabase();

    // If an entire updated array of videos is sent
    if (Array.isArray(videos)) {
      const doc = await SiteSettings.findOneAndUpdate(
        { key: "profile" },
        { workoutVideos: videos },
        { upsert: true, new: true }
      );
      return NextResponse.json({ videos: doc.workoutVideos });
    }

    // If a single new video is added
    if (video && video.videoUrl && video.title) {
      const newVideo: IWorkoutVideo = {
        id: video.id || `vid-${Date.now()}`,
        title: String(video.title).trim(),
        category: String(video.category || "Workout").trim(),
        videoUrl: String(video.videoUrl).trim(),
        posterUrl: String(video.posterUrl || "").trim(),
        tag: String(video.tag || "Workout Form").trim(),
      };

      const doc = await SiteSettings.findOneAndUpdate(
        { key: "profile" },
        { $push: { workoutVideos: newVideo } },
        { upsert: true, new: true }
      );

      return NextResponse.json({ videos: doc.workoutVideos, added: newVideo });
    }

    return NextResponse.json({ error: "Invalid video data" }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save video";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await SiteSettings.findOneAndUpdate(
      { key: "profile" },
      { $pull: { workoutVideos: { id } } },
      { new: true }
    );

    return NextResponse.json({ videos: doc?.workoutVideos || [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete video";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

