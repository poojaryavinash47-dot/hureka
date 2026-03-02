"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuth();

  const closeAll = () => {
    setMenuOpen(false);
    setShopOpen(false);
    setProfileOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (prev) setShopOpen(false);
      return !prev;
    });
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <Link href="/" onClick={closeAll}>HUREKA</Link>
      </div>

      {/* MENU */}
      <ul className={`menu ${menuOpen ? "menu-open" : ""}`}>
        <li><Link href="/" onClick={closeAll}>Home</Link></li>

        {/* SHOP DROPDOWN */}
        <li className={`dropdown ${shopOpen ? "open" : ""}`}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setShopOpen((prev) => !prev)}
          >
            <span>Shop</span>
            <span className="arrow">{shopOpen ? "▲" : "▼"}</span>
          </button>

          <ul className="dropdown-menu">
            {[
              ["joint-care", "Joint Care"],
              ["hair-care", "Hair Care"],
              ["bone-calcium", "Bone & Calcium"],
              ["multivitamins", "Multivitamins"],
              ["immunity-support", "Immunity Support"],
            ].map(([slug, label]) => (
              <li key={slug}>
                <Link href={`/shop/${slug}`} onClick={closeAll}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </li>

        <li><Link href="/combo-offers" onClick={closeAll}>Combo Offers</Link></li>
        <li><Link href="/subscription-plans" onClick={closeAll}>Subscription Plans</Link></li>
        <li><Link href="/about-us" onClick={closeAll}>About Us</Link></li>
        <li><Link href="/contact" onClick={closeAll}>Contact</Link></li>

        {/* CART ICON */}
    

        {/* PROFILE */}
       {/* RIGHT SIDE ICONS */}
<li className="nav-right">
  <div className="cart-icon">
    <Link href="/cart" onClick={closeAll}>🛒</Link>
  </div>

  <div className="profile-wrapper">
    <button
      className={`profile-btn ${user ? "logged-in" : ""}`}
      onClick={() => {
        if (!user) {
          router.push("/login");
        } else {
          setProfileOpen((prev) => !prev);
        }
      }}
    >
      👤
      {user && <span className="online-dot" />}
    </button>

    {user && profileOpen && (
      <div className="profile-dropdown">
        <Link href="/cart" onClick={closeAll}>🛒 View Cart</Link>
        <button
          onClick={() => {
            logout();
            closeAll();
            router.push("/login");
          }}
        >
          🚪 Logout
        </button>
      </div>
    )}
  </div>
</li>
      </ul>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}