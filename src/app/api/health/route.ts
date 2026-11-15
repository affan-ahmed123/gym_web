import { NextResponse } from "next/server";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        connected: false,
        message: "MONGODB_URI not configured in .env.local",
      },
      { status: 200 }
    );
  }

  try {
    await connectToDatabase();
    return NextResponse.json({
      configured: true,
      connected: true,
      message: "Connected to MongoDB Atlas",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json(
      {
        configured: true,
        connected: false,
        message: msg,
      },
      { status: 500 }
    );
  }
}

