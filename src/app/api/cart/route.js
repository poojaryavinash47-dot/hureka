import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

/* ================= GET USER FROM TOKEN ================= */
async function getUserIdFromToken() {
  try {
    const cookieStore = await cookies(); // ✅ MUST AWAIT in Next 15
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id; // userId from JWT
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return null;
  }
}

/* ================= GET CART ================= */
export async function GET() {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({
      items: cart?.items || [],
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return NextResponse.json({ items: [] });
  }
}

/* ================= ADD TO CART ================= */
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

    const product = await req.json();

    if (!product?.productId) {
      return NextResponse.json(
        { error: "Invalid product" },
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

    const existingItem = cart.items.find(
      (item) => item.productId === product.productId
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.items.push({
        productId: product.productId,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        qty: 1,
      });
    }

    await cart.save();

    return NextResponse.json({
      items: cart.items,
    });
  } catch (err) {
    console.error("POST CART ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE QTY ================= */
export async function PUT(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const { productId, qty } = await req.json();

    if (!productId || typeof qty !== "number") {
      return NextResponse.json({ items: [] });
    }

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    const item = cart.items.find(
      (item) => item.productId === productId
    );

    if (item) {
      item.qty = Math.max(1, qty);
    }

    await cart.save();

    return NextResponse.json({
      items: cart.items,
    });
  } catch (err) {
    console.error("PUT CART ERROR:", err);
    return NextResponse.json({ items: [] });
  }
}

/* ================= REMOVE ITEM ================= */
export async function DELETE(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ items: [] });
    }

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    await cart.save();

    return NextResponse.json({
      items: cart.items,
    });
  } catch (err) {
    console.error("DELETE CART ERROR:", err);
    return NextResponse.json({ items: [] });
  }
}