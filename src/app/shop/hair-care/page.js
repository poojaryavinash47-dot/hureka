"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/wooCommerce";

export default function HairCarePage() {
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("all");
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();

        // ✅ FILTER ONLY HAIR CARE PRODUCTS FROM WOOCOMMERCE
        const hairCareProducts = allProducts
          .filter((p) =>
            p.categories?.some(
              (cat) => cat.slug === "hair-care"
            )
          )
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            mrp: p.regular_price,
            image: p.images?.[0]?.src || "/placeholder.png",
            category: p.categories?.[0]?.name || "",
          }));

        setProducts(hairCareProducts);
        setFiltered(hairCareProducts);
      } catch (error) {
        console.error("Failed to load Hair Care products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = () => {
    let data = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (price === "below300") {
      data = data.filter((p) => p.price < 300);
    } else if (price === "300to500") {
      data = data.filter(
        (p) => p.price >= 300 && p.price <= 500
      );
    } else if (price === "above500") {
      data = data.filter((p) => p.price > 500);
    }

    setFiltered(data);
  };

  if (loading) {
    return <p style={{ padding: "80px" }}>Loading products...</p>;
  }

  return (
    <section className="category-page">
      <div className="category-container">
        {/* LEFT SIDEBAR */}
        <aside className="filter-sidebar">
          <h3 className="filter-title">Filter</h3>

          <div className="filter-block">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search product..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-block">
            <label>Price</label>
            <select
              className="price-select"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="all">All</option>
              <option value="below300">Below ₹300</option>
              <option value="300to500">₹300 – ₹500</option>
              <option value="above500">Above ₹500</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="filter-search-btn"
          >
            Search
          </button>
        </aside>

        {/* PRODUCTS */}
        <div className="products-area">
          <div className="products-grid">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p>No Hair Care products found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}