export default function SubscriptionPlans() {
  return (
    <section className="plans-section">
      <div className="plans-grid">

        {/* BASIC */}
        <div className="plan-card">
          <h3>Essential Care</h3>
          <p className="plan-price">₹499 / month</p>
          <ul>
            <li>Monthly wellness essentials</li>
            <li>5% subscriber discount</li>
            <li>Standard delivery</li>
            <li>Email support</li>
          </ul>
          <button className="plan-btn">Choose Plan</button>
        </div>

        {/* POPULAR */}
        <div className="plan-card popular">
          <span className="badge">Most Popular</span>
          <h3>Complete Wellness</h3>
          <p className="plan-price">₹999 / month</p>
          <ul>
            <li>Curated skincare & wellness box</li>
            <li>10% subscriber discount</li>
            <li>Free priority delivery</li>
            <li>Early access to new launches</li>
          </ul>
          <button className="plan-btn primary">Choose Plan</button>
        </div>

        {/* PREMIUM */}
        <div className="plan-card">
          <h3>Luxury Ritual</h3>
          <p className="plan-price">₹1,499 / month</p>
          <ul>
            <li>Premium full-size products</li>
            <li>15% lifetime discount</li>
            <li>Free express delivery</li>
            <li>1-on-1 wellness consultation</li>
          </ul>
          <button className="plan-btn">Choose Plan</button>
        </div>

      </div>
    </section>
  );
}