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
    console.error("JWT ERROR (sync):", err.message);
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

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cart) {
      cart = await Cart.create({
        userId: new mongoose.Types.ObjectId(userId),
        items: [],
      });
    }

    for (const raw of items) {
      if (!raw?.productId) continue;

      const quantity = Math.max(1, Number(raw.quantity ?? raw.qty ?? 1) || 1);
      const price = Number(raw.price) || 0;
      const title = raw.title || raw.name || "";
      const image = raw.image || "";

      const existing = cart.items.find(
        (item) => item.productId === raw.productId
      );

      if (existing) {
        existing.qty += quantity;
      } else {
        cart.items.push({
          productId: raw.productId,
          name: title,
          price,
          image,
          qty: quantity,
        });
      }
    }

    await cart.save();

    return NextResponse.json({ items: cart.items });
  } catch (err) {
    console.error("CART SYNC ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
