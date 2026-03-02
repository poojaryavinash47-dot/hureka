export default function OilFreeSection() {
  return (
    <section className="oilfree-section">
      <div className="oilfree-container">
        {/* LEFT CONTENT */}
        <div className="oilfree-content">
          <h2>Oil Free Creams</h2>
          <h4>Fabulous In Every Way.</h4>

          <p>
            Ut consequat semper viverra nam libero. Volutpat diam ut venenatis
            tellus in metus. At tempor commodo ullamcorper a lacus. Proin
            sagittis nisl rhoncus mattis rhoncus urna. Cras fermentum odio eu
            feugiat pretium nibh.
          </p>

          <button className="oilfree-btn">SHOP NOW</button>
        </div>

        {/* RIGHT IMAGE */}
       <div className="promo-image">
  <img src="/products/oilfree.png" alt="Oil Free Cream" />
</div>
      </div>
    </section>
  );
}