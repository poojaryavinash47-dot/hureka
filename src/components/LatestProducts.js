import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/wooCommerce";

export default async function LatestProducts() {
  const products = await getProducts();

  // Map WooCommerce data → UI format and sort by newest first
  const formattedProducts = products
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      mrp: p.regular_price,
      image: p.images?.[0]?.src || "/placeholder.png",
      category: p.categories?.[0]?.name || "",
      createdAt: p.date_created || p.date_created_gmt || null,
    }))
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const latestProducts = formattedProducts.slice(0, 8);

  return (
    <section className="latest-products">
      <p className="section-subtitle">Chemical Free</p>
      <h2 className="section-title">Latest Products</h2>

      <div className="latest-products-container">
        {latestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}