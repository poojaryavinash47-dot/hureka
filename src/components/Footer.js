export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LOGO */}
        <div className="footer-brand">
          <h2>Hureka</h2>
        </div>

        {/* INFORMATION */}
        <div className="footer-column">
          <h4>INFORMATION</h4>
          <ul>
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Journals</li>
            <li>Contact</li>
            <li>Account Login</li>
            <li>Subscription Settings</li>
          </ul>
        </div>

        {/* HELP */}
        <div className="footer-column">
          <h4>HELP</h4>
          <ul>
            {/* <li>faq's</li> */}
            <li>Privacy</li>
            <li>Policies</li>
            <li>Contactless Delivery</li>
            <li>Reviews</li>
            <li>Refund & Return</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer-column">
          <h4>FOLLOW US</h4>
          <ul className="social-links">
            <li>Twitter</li>
            <li>Facebook</li>
            <li>Pinterest</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Hureka. All Rights Reserved.</p>
       
      </div>
    </footer>
  );
}