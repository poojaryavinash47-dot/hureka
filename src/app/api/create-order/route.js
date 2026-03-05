import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getProductBySlug } from "@/lib/wooCommerce";

/* ================= GET AUTHED USER ================= */
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
    console.error("ORDER JWT ERROR:", err.message);
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

/* ================= CREATE ORDER (POST) ================= */
export async function POST(req) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { billing, items, subtotal, tax, total } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items to order" },
        { status: 400 }
      );
    }

    if (!billing || !billing.firstName || !billing.address || !billing.city || !billing.state || !billing.pincode) {
      return NextResponse.json(
        { success: false, error: "Incomplete billing details" },
        { status: 400 }
      );
    }

    const { ORDERS_URL, KEY, SECRET } = getWooConfig();

    // Map app cart items (slug-based IDs) to WooCommerce product IDs
    const lineItems = [];

    for (const item of items) {
      const slug = item.productId || item.slug;
      const qty = Number(item.qty || 1);
      const price = Number(item.price || 0);

      if (!slug || !qty) continue;

      const wooProduct = await getProductBySlug(slug);

      if (!wooProduct || !wooProduct.id) {
        console.warn("Woo product not found for slug", slug);
        continue;
      }

      lineItems.push({
        product_id: wooProduct.id,
        quantity: qty,
        total: String(price * qty),
        name: item.name,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Unable to map products to WooCommerce" },
        { status: 400 }
      );
    }

    const orderPayload = {
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,
      billing: {
        first_name: billing.firstName,
        last_name: billing.lastName || "",
        address_1: billing.address,
        address_2: billing.apartment || "",
        city: billing.city,
        state: billing.state,
        postcode: billing.pincode,
        country: "IN",
        email: user.email,
        phone: billing.phone || "",
      },
      shipping: {
        first_name: billing.firstName,
        last_name: billing.lastName || "",
        address_1: billing.address,
        address_2: billing.apartment || "",
        city: billing.city,
        state: billing.state,
        postcode: billing.pincode,
        country: "IN",
      },
      line_items: lineItems,
      customer_note: `Hureka app order for user ${user._id}`,
      meta_data: [
        { key: "hureka_user_id", value: String(user._id) },
        { key: "hureka_subtotal", value: String(subtotal ?? "") },
        { key: "hureka_tax", value: String(tax ?? "") },
        { key: "hureka_total", value: String(total ?? "") },
      ],
    };

    const response = await fetch(
      `${ORDERS_URL}?consumer_key=${KEY}&consumer_secret=${SECRET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WooCommerce order error", response.status, data);
      return NextResponse.json(
        {
          success: false,
          error:
            data?.message ||
            data?.error ||
            "Failed to create order",
        },
        { status: response.status || 500 }
      );
    }

    const order = {
      id: data.id,
      status: data.status,
      date_created: data.date_created,
      line_items: data.line_items,
      total: data.total,
      billing: data.billing,
      shipping: data.shipping,
    };

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("CREATE ORDER ERROR", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
