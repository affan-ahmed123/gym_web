import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

/**
 * Checks whether a real MongoDB Atlas connection string is configured.
 */
export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI?.trim() || "";
  return Boolean(
    uri &&
      (uri.startsWith("mongodb+srv://") || uri.startsWith("mongodb://")) &&
      !uri.includes("<username>") &&
      !uri.includes("<password>")
  );
}

/**
 * Connects to MongoDB Atlas using a cached Mongoose connection for Next.js.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!isMongoConfigured()) {
    throw new Error(
      "MONGODB_URI is not configured in .env.local. Add your MongoDB Atlas connection string."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI!.trim();
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 6000,
      dbName: "ahsan_fitness",
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

