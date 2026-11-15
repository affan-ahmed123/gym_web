import mongoose, { Schema, Document, Model } from "mongoose";

export interface INutrition extends Document {
  title: string;
  category: string;
  price: string;
  servingSize?: string;
  description: string;
  imageUrl: string;
  badge?: string;
  featured?: boolean;
  createdAt: Date;
}

const NutritionSchema = new Schema<INutrition>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Whey Protein",
    },
    price: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    servingSize: {
      type: String,
      default: "",
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
      maxlength: 40,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Nutrition: Model<INutrition> =
  mongoose.models.Nutrition ||
  mongoose.model<INutrition>("Nutrition", NutritionSchema);

export default Nutrition;

