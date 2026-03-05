import Link from "next/link";
import { FaTwitter, FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";

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
          <h4>USEFULL LINKS</h4>
          <ul>
       <li>
      <Link href="/">Home</Link>
    </li>

    <li>
      <Link href="/shop/joint-care">Shop</Link>
    </li>

    <li>
      <Link href="/combo-offers">Combo-offers</Link>
    </li>

    <li>
      <Link href="/subscription-plans">Subscription Plan</Link>
    </li>

    <li>
      <Link href="/about-us">About Us</Link>
    </li>

    <li>
      <Link href="/contact">Contact</Link>
    </li>
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
          <div className="social-links">
            <a href="#" className="social-item">
              <FaTwitter className="social-icon" />
              <span>Twitter</span>
            </a>
            <a href="#" className="social-item">
              <FaFacebookF className="social-icon" />
              <span>Facebook</span>
            </a>
            <a href="#" className="social-item">
              <FaPinterestP className="social-icon" />
              <span>Pinterest</span>
            </a>
            <a href="#" className="social-item">
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Hureka. All Rights Reserved.</p>
       
      </div>
    </footer>
  );
}