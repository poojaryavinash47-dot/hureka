const API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
const KEY = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
const SECRET = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

/* Get all products */
export async function getProducts() {
  const res = await fetch(
    `${API_URL}/products?consumer_key=${KEY}&consumer_secret=${SECRET}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Woo API error", res.status);
    throw new Error("Failed to fetch products from WooCommerce");
  }

  return res.json();
}

/* Get single product by slug */
export async function getProductBySlug(slug) {
  const res = await fetch(
    `${API_URL}/products?slug=${slug}&consumer_key=${KEY}&consumer_secret=${SECRET}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  return data[0]; // WooCommerce returns array
}

/* Get single product by numeric ID */
export async function getProductById(id) {
  if (!id) throw new Error("Product ID is required");

  const res = await fetch(
    `${API_URL}/products/${id}?consumer_key=${KEY}&consumer_secret=${SECRET}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Woo API error (product by id)", res.status);
    throw new Error("Failed to fetch product from WooCommerce");
  }

  return res.json();
}

/* Derive the base store URL (without /wp-json/...) */
function getStoreBaseUrl() {
  if (!API_URL) return "";
  const match = API_URL.match(/^(.*)\/wp-json\//);
  return (match ? match[1] : API_URL).replace(/\/$/, "");
}

/* WooCommerce placeholder image URL (fallback when product has no image) */
export function getWooPlaceholderImage() {
  const base = getStoreBaseUrl();
  if (!base) return "/products/default.png";
  return `${base}/wp-content/plugins/woocommerce/assets/images/placeholder.png`;
}