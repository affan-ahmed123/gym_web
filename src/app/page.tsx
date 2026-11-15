import React from "react";
import { FitnessApp } from "@/components/FitnessApp";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import Review from "@/models/Review";
import SiteSettings from "@/models/SiteSettings";
import { SEED_REVIEWS, type SeedReview } from "@/data/seedReviews";
import type { ReviewItem, WorkoutVideoItem } from "@/types/fitness";

export const dynamic = "force-dynamic";

async function getInitialData(): Promise<{
  reviews: ReviewItem[];
  photoUrl: string | null;
  photoWidth: number;
  photoHeight: number;
  photoProvider: string;
  workoutVideos: WorkoutVideoItem[];
}> {
  if (!isMongoConfigured()) {
    return {
      reviews: [],
      photoUrl: "/ahsan-cutout.png",
      photoWidth: 800,
      photoHeight: 1000,
      photoProvider: "local",
      workoutVideos: [],
    };
  }

  try {
    await connectToDatabase();
    let [reviewDocs, profileDoc] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).lean(),
      SiteSettings.findOne({ key: "profile" }).lean(),
    ]);

    if (!reviewDocs || reviewDocs.length === 0) {
      await Review.insertMany(SEED_REVIEWS).catch(() => {});
      reviewDocs = await Review.find().sort({ createdAt: -1 }).lean();
    }

    const reviews: ReviewItem[] = (reviewDocs && reviewDocs.length > 0
      ? reviewDocs
      : SEED_REVIEWS.map((r: SeedReview, idx: number) => ({
          _id: `seed-${idx}`,
          name: r.name,
          service: r.service,
          duration: r.duration,
          rating: r.rating,
          message: r.message,
          createdAt: r.createdAt,
        }))
    ).map((d: any) => ({
      id: String(d._id),
      name: d.name,
      service: d.service,
      duration: d.duration || "",
      rating: d.rating,
      message: d.message,
      ts: new Date(d.createdAt).getTime(),
    }));

    return {
      reviews,
      photoUrl: profileDoc?.photoUrl || "/ahsan-cutout.png",
      photoWidth: profileDoc?.photoWidth || 800,
      photoHeight: profileDoc?.photoHeight || 1000,
      photoProvider: profileDoc?.photoProvider || "local",
      workoutVideos: profileDoc?.workoutVideos || [],
    };
  } catch {
    return {
      reviews: [],
      photoUrl: "/ahsan-cutout.png",
      photoWidth: 800,
      photoHeight: 1000,
      photoProvider: "local",
      workoutVideos: [],
    };
  }
}

export default async function HomePage() {
  const {
    reviews,
    photoUrl,
    photoWidth,
    photoHeight,
    photoProvider,
    workoutVideos,
  } = await getInitialData();

  return (
    <FitnessApp
      initialReviews={reviews}
      initialPhotoUrl={photoUrl}
      initialPhotoWidth={photoWidth}
      initialPhotoHeight={photoHeight}
      initialPhotoProvider={photoProvider}
      initialWorkoutVideos={workoutVideos}
    />
  );
}
