import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

async function getUserIdFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    console.error("JWT ERROR (clear cart):", err.message);
    return null;
  }
}

export async function DELETE() {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return NextResponse.json({ items: [] });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    return NextResponse.json(
      { items: [] },
      { status: 500 }
    );
  }
}
