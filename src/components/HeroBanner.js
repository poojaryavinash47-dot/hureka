"use client";

export default function HeroBanner({ title, breadcrumb }) {
  return (
    <section className="about-banner">
      <div className="about-banner-overlay">
        <h1>{title}</h1>
        <p>{breadcrumb}</p>
      </div>
    </section>
  );
}
