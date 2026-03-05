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

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      email,
      firstName,
      lastName = "",
      address,
      apartment = "",
      city,
      state,
      pincode,
    } = body || {};

    if (!email || !firstName || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "Missing required address fields" },
        { status: 400 }
      );
    }

    const normalized = {
      userId: new mongoose.Types.ObjectId(userId),
      email: String(email).trim(),
      firstName: String(firstName).trim(),
      lastName: String(lastName || "").trim(),
      address: String(address).trim(),
      apartment: String(apartment || "").trim(),
      city: String(city).trim(),
      state: String(state).trim(),
      pincode: String(pincode).trim(),
    };

    // Check if this exact address already exists for this user
    const existing = await Address.findOne(normalized);
    if (existing) {
      return NextResponse.json({ address: existing, duplicated: true });
    }

    let saved;
    try {
      saved = await Address.create(normalized);
    } catch (err) {
      // Handle race-condition on unique index
      if (err.code === 11000) {
        const again = await Address.findOne(normalized);
        return NextResponse.json({ address: again, duplicated: true });
      }
      throw err;
    }

    return NextResponse.json({ address: saved, duplicated: false });
  } catch (err) {
    console.error("SAVE ADDRESS ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
