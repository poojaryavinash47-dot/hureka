import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/wooCommerce";

/* helper to split products into rows of 6 */
const chunkProducts = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default async function LatestProducts() {
  const products = await getProducts();

  // Map WooCommerce data → your UI format
  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    mrp: p.regular_price,
    image: p.images?.[0]?.src || "/placeholder.png",
    category: p.categories?.[0]?.name || "",
  }));

  const productRows = chunkProducts(formattedProducts, 6);

  return (
    <section className="latest-products">
      <p className="section-subtitle">Chemical Free</p>
      <h2 className="section-title">Latest Products</h2>

      <div className="products-rows">
        {productRows.map((row, rowIndex) => (
          <div className="products-row" key={rowIndex}>
            {row.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}