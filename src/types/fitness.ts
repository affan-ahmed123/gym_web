export interface ReviewItem {
  id: string;
  name: string;
  service: string;
  duration: string;
  rating: number;
  message: string;
  ts: number;
}

export type ConsultationStatus = "new" | "contacted" | "scheduled";

export interface ConsultationItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number | null;
  goal: string;
  fitnessLevel: string;
  trainingType: string;
  preferredTime: string;
  healthNotes: string;
  message: string;
  status: ConsultationStatus;
  ts: number;
}

export interface WorkoutVideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl?: string;
  tag?: string;
  cue?: string;
  durationSeconds?: number;
}

export interface ProfilePhotoMeta {
  url: string | null;
  width: number;
  height: number;
  provider: "cloudinary" | "local_mongodb" | "none";
  cloudinaryConfigured: boolean;
}

export interface HealthStatus {
  configured: boolean;
  connected: boolean;
  message: string;
}

export interface NutritionProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  servingSize?: string;
  description: string;
  imageUrl: string;
  badge?: string;
  featured?: boolean;
  createdAt?: number;
}
