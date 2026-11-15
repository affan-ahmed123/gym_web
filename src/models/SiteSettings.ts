import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkoutVideo {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl?: string;
  tag?: string;
  cue?: string;
  durationSeconds?: number;
}

export interface ISiteSettings extends Document {
  key: string;
  photoUrl: string | null;
  photoWidth?: number;
  photoHeight?: number;
  photoProvider?: string;
  photoPublicId?: string;
  heroPhotoUrl?: string | null;
  workoutVideos: IWorkoutVideo[];
  updatedAt: Date;
}

const WorkoutVideoSchema = new Schema<IWorkoutVideo>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: "Workout" },
    videoUrl: { type: String, required: true },
    posterUrl: { type: String, default: "" },
    tag: { type: String, default: "" },
    cue: { type: String, default: "" },
    durationSeconds: { type: Number, default: 7 },
  },
  { _id: false }
);

const DEFAULT_REAL_VIDEOS: IWorkoutVideo[] = [
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

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, default: "profile" },
    photoUrl: { type: String, default: "/ahsan-cutout.png" },
    photoWidth: { type: Number, default: 800 },
    photoHeight: { type: Number, default: 1000 },
    photoProvider: { type: String, default: "local" },
    photoPublicId: { type: String, default: "" },
    heroPhotoUrl: { type: String, default: "/ahsan-cutout.png" },
    workoutVideos: {
      type: [WorkoutVideoSchema],
      default: DEFAULT_REAL_VIDEOS,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
