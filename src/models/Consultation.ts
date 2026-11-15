import mongoose, { Schema, Document, Model } from "mongoose";

export type ConsultationStatus = "new" | "contacted" | "scheduled";

export interface IConsultation extends Document {
  name: string;
  phone: string;
  email: string;
  age?: number;
  goal: string;
  fitnessLevel: string;
  trainingType: string;
  preferredTime: string;
  healthNotes: string;
  message: string;
  status: ConsultationStatus;
  createdAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    email: { type: String, required: true, trim: true, maxlength: 120 },
    age: { type: Number, min: 10, max: 90 },
    goal: { type: String, required: true, trim: true, maxlength: 120 },
    fitnessLevel: { type: String, default: "Beginner", trim: true },
    trainingType: {
      type: String,
      default: "In-Person Training",
      trim: true,
    },
    preferredTime: { type: String, default: "Flexible", trim: true },
    healthNotes: { type: String, default: "", trim: true, maxlength: 300 },
    message: { type: String, default: "", trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["new", "contacted", "scheduled"],
      default: "new",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Consultation: Model<IConsultation> =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>("Consultation", ConsultationSchema);

export default Consultation;

