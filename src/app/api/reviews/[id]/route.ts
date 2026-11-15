import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await connectToDatabase();
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true, id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete review";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

