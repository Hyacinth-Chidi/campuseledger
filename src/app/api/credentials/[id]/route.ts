import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const credential = await Credential.findById(id)
    .populate("issuerId", "institutionName")
    .populate("holderId", "name email");

  if (!credential) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Students may only view their own credential; institutions their own issued
  // ones; employers can look up any credential by id (that's the point of
  // verification) but only receive non-sensitive fields.
  if (session.role === "student" && credential.holderId._id.toString() !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.role === "institution" && credential.issuerId._id.toString() !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ credential });
}
