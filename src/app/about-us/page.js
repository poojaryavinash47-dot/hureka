"use client";

import HeroBanner from "@/components/HeroBanner";

export default function AboutPage() {
  return (
    <>
      {/* FULL WIDTH ABOUT BANNER */}
      <HeroBanner title="ABOUT" breadcrumb="Home / About" />

      {/* PAGE CONTENT (CONSTRAINED) */}
      <section className="about-page">

        {/* WHO WE ARE */}
        <div className="about-split">
          <div className="about-image-frame">
            <div className="frame-bg"></div>
            <img
              src="/about/about-who-we-are.png"
              alt="Natural wellness ingredients"
            />
          </div>

          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              HUREKA is a wellness-driven brand focused on creating high-quality,
              science-backed skincare and health products. We believe everyday
              wellness should be simple, effective, and accessible.
            </p>
          </div>
        </div>

        {/* OUR MISSION */}
        <div className="about-split reverse">
          <div className="about-image-frame">
            <div className="frame-bg"></div>
            <img
              src="/about/about-mission.png"
              alt="Wellness research"
            />
          </div>

          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              Our mission is to empower healthier lifestyles through carefully
              formulated products that combine modern research with
              nature-inspired ingredients.
            </p>
          </div>
        </div>

        {/* WHY CHOOSE */}
        <div className="about-why">
          <h2>Why Choose HUREKA</h2>
          <img
            src="/about/why-choose-hureka.png"
            alt="Why choose HUREKA"
          />
        </div>

      </section>

      {/* ✅ FULL WIDTH OUR PROMISE (MOVED OUTSIDE) */}
      <section className="about-promise">
        <h2>Our Promise</h2>
        <p>
          Every HUREKA product is created with care, responsibility,
          and attention to detail — because your wellness deserves
          nothing less.
        </p>
      </section>
    </>
  );
}