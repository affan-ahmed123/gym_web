import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  service: string;
  duration: string;
  rating: number;
  message: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    service: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;

