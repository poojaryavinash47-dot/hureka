import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { id: decoded.id, name: decoded.name };
  } catch (err) {
    console.error("Review auth error", err.message);
    return null;
  }
}

// GET /api/reviews?productId=slug
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    const reviewCount = reviews.length;
    const avgRating =
      reviewCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    return NextResponse.json({
      reviews,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount,
    });
  } catch (err) {
    console.error("GET reviews error", err);
    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(req) {
  try {
    await connectDB();
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Prevent duplicate review by same user for same product
    const existing = await Review.findOne({
      productId,
      userId: user.id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      productId,
      userId: user.id,
      username: user.name || "User",
      rating: numericRating,
      comment,
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("POST review error", err);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
