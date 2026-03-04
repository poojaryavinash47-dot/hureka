import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Premium Wellness Supplements</h1>
       
        <Link href="/shop/joint-care">
          <button className="hero-shop-btn">SHOP NOW</button>
        </Link>
      </div>
    </section>
  );
}