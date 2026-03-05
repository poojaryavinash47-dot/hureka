import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.id).select("-password").lean();
    return user || null;
  } catch (err) {
    console.error("GET-ORDERS JWT ERROR:", err.message);
    return null;
  }
}

function getWooConfig() {
  const baseUrl = process.env.WOO_STORE_URL;
  const KEY = process.env.WOO_CONSUMER_KEY;
  const SECRET = process.env.WOO_CONSUMER_SECRET;

  if (!baseUrl || !KEY || !SECRET) {
    throw new Error("Missing WooCommerce configuration (store URL / keys)");
  }

  const ORDERS_URL = `${baseUrl.replace(/\/$/, "")}/wp-json/wc/v3/orders`;

  return { ORDERS_URL, KEY, SECRET };
}

export async function GET(req) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const emailParam = url.searchParams.get("email");
    const email = user.email;

    // Optional safety: ensure the requested email matches the logged-in user
    if (emailParam && emailParam.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { ORDERS_URL, KEY, SECRET } = getWooConfig();

    // Fetch orders and filter by billing email (guest orders supported)
    const params = new URLSearchParams({
      search: email,
      per_page: "50",
    });

    const ordersRes = await fetch(
      `${ORDERS_URL}?${params.toString()}&consumer_key=${KEY}&consumer_secret=${SECRET}`,
      { cache: "no-store" }
    );

    if (!ordersRes.ok) {
      const errBody = await ordersRes.json().catch(() => ({}));
      console.error("Woo orders fetch error", ordersRes.status, errBody);
      return NextResponse.json(
        {
          success: false,
          error:
            errBody?.message ||
            errBody?.error ||
            "Failed to fetch orders from WooCommerce",
        },
        { status: ordersRes.status || 500 }
      );
    }

    const rawOrders = await ordersRes.json();

    const filtered = (rawOrders || []).filter((order) => {
      const billingEmail = order?.billing?.email;
      return (
        billingEmail &&
        billingEmail.toLowerCase() === email.toLowerCase()
      );
    });

    const orders = filtered.map((order) => ({
      id: order.id,
      status: order.status,
      date_created: order.date_created,
      line_items: (order.line_items || []).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        total: item.total,
        price: item.price,
        image:
          item.image?.src ||
          (Array.isArray(item.meta_data)
            ? item.meta_data.find((m) => m.key === "_thumbnail_id")?.value
            : null),
      })),
      total: order.total,
      billing: order.billing,
      shipping: order.shipping,
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET-ORDERS ERROR", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
