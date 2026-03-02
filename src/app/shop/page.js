export default function ShopPage() {
  return (
    <section className="shop-page">
      <h1 className="page-title">Shop</h1>
      <p className="page-subtitle">Choose a category</p>

      <div className="shop-categories">
        <a href="/shop/joint-care" className="category-card">Joint Care</a>
        <a href="/shop/hair-care" className="category-card">Hair Care</a>
        <a href="/shop/bone-calcium" className="category-card">Bone & Calcium</a>
                <a href="/shop/multivitamins" className="category-card">Multivitamins</a>

        <a href="/shop/immunity-support" className="category-card">Immunity Support</a>
      </div>
    </section>
  );
}