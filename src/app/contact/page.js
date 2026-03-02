export default function ContactPage() {
  return (
    <section className="contact-page">

      {/* HERO */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We’re here to help you with your orders, products, and wellness
          queries. Reach out anytime.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div className="contact-cards">

        <div className="contact-card">
          <div className="contact-icon">📞</div>
          <h3>Phone</h3>
          <p><strong>Toll-Free:</strong> 0000-123-456789</p>
          <p><strong>Fax:</strong> 0000-123-456789</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">✉️</div>
          <h3>Email</h3>
          <p>support@hureka.in</p>
          <p>info@hureka.in</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">📍</div>
          <h3>Address</h3>
          <p>
            No: 58 A, East Madison Street,<br />
            Bangalore, Karnataka, India
          </p>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="contact-grid">

        {/* CONTACT INFO */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions about our products, subscriptions, or your order?
            Our support team is always happy to assist you.
          </p>

          <ul className="contact-details">
            <li><strong>Email:</strong> support@hureka.in</li>
            <li><strong>Phone:</strong> +91 9XXXXXXXXX</li>
            <li><strong>WhatsApp:</strong> Available for quick support</li>
            <li><strong>Support Hours:</strong> Mon – Sat, 10 AM – 6 PM</li>
          </ul>

          <a
            href="https://wa.me/919XXXXXXXXX"
            target="_blank"
            className="whatsapp-btn"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* CONTACT FORM */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Your Phone Number" />
            <textarea placeholder="Your Message" rows="5" required />
            <button type="submit">Submit Message</button>
          </form>
        </div>

      </div>
    </section>
  );
}