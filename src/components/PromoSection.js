export default function PromoSection() {
  return (
    <section className="promo-section">
      <div className="promo-container">
        {/* LEFT IMAGE */}
        <div className="promo-image">
          <img src="/products/promo-lotion.png" alt="Sunscreen Lotion" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="promo-content">
          <h2>Sunscreen Lotions</h2>
          <h4>Gorgeous and Beauty which you deserve.</h4>

          <p>
            Urna duis convallis convallis tellus id interdum. Placerat vestibulum
            lectus mauris ultrices eros in cursus turpis. Pellentesque habitant
            morbi tristique senectus et netus.
          </p>

          <button className="promo-btn">SHOP NOW</button>
        </div>
      </div>
    </section>
  );
}