"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  { slug: "joint-care", title: "Joint Care", image: "/products/lotion.png" },
  { slug: "hair-care", title: "Hair Care", image: "/products/oilfree.png" },
  { slug: "bone-calcium", title: "Bone & Calcium", image: "/products/sunscreen2.png" },
  { slug: "multivitamins", title: "Multivitamins", image: "/products/promo-lotion.png" },
  { slug: "immunity-support", title: "Immunity Support", image: "/products/sunscreen1.png" },
];

export default function HomeCategorySlider() {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* ✅ Detect screen size safely */
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen(); // initial
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ✅ Auto slide */
  useEffect(() => {
    const delay = isMobile ? 2000 : 3000;

    const interval = setInterval(() => {
      setStartIndex((prev) => {
        if (isMobile) {
          return (prev + 1) % categories.length;
        } else {
          return prev === 0 ? 2 : 0;
        }
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isMobile]);

  /* ✅ Build visible cards WITHOUT window */
  const visibleCards = isMobile
    ? [categories[startIndex]]
    : [
        categories[startIndex],
        categories[(startIndex + 1) % categories.length],
        categories[(startIndex + 2) % categories.length],
      ];

  return (
    <section className="category-slider-section">
      <h2 className="section-title">Shop by Category</h2>

      <div className="slider-viewport">
        <div className="slider-track">
          {visibleCards.map((cat) => (
            <div key={cat.slug} className="category-card">
              <div className="card-image">
                <img src={cat.image} alt={cat.title} />
              </div>

              <h3>{cat.title}</h3>

              {/* ✅ SHOP NOW BUTTON */}
              <Link href={`/shop/${cat.slug}`} className="shop-now-btn">
                Shop Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}