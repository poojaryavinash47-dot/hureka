import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Address from "@/models/Address";

async function getUserIdFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    console.error("ADDRESS JWT ERROR:", err.message);
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ address: null });
    }

    const address = await Address.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ address: address || null });
  } catch (err) {
    console.error("GET ADDRESS ERROR:", err);
    return NextResponse.json(
      { address: null },
      { status: 500 }
    );
  }
}
