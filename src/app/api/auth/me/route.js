import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  console.log("---- /api/auth/me HIT ----");

  const token = req.cookies.get("token")?.value;
  console.log("TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN");
    return NextResponse.json({ user: null });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
  } catch (err) {
    console.log("JWT VERIFY FAILED:", err.message);
    return NextResponse.json({ user: null });
  }

  await connectDB();

  const user = await User.findById(decoded.id).select("-password");
  console.log("USER FROM DB:", user);

  if (!user) {
    console.log("USER NOT FOUND IN DB");
    return NextResponse.json({ user: null });
  }

  console.log("AUTH SUCCESS");
  return NextResponse.json({ user });
}