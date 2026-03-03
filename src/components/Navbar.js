"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
const { user, loading, logout } = useAuth();
 // ✅ include loading

  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
// ⬇️ add this INSIDE Navbar component (above return)
const handleProfileClick = () => {
  console.log("PROFILE CLICKED", { user, loading });

  if (loading) return;

  if (!user) {
    router.push("/login");
  } else {
    setProfileOpen(prev => !prev);
  }
};
  const closeAll = () => {
    setMenuOpen(false);
    setShopOpen(false);
    setProfileOpen(false);
  };

 

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <Link href="/" onClick={closeAll}>
          HUREKA
        </Link>
      </div>

      {/* MENU */}
      <ul className={`menu ${menuOpen ? "menu-open" : ""}`}>
        <li><Link href="/" onClick={closeAll}>Home</Link></li>

        {/* SHOP */}
        <li className={`dropdown ${shopOpen ? "open" : ""}`}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setShopOpen((prev) => !prev)}
          >
            <span>Shop</span>
            <span className="arrow">▼</span>
          </button>

          <ul className="dropdown-menu">
            <li><Link href="/shop/joint-care" onClick={closeAll}>Joint Care</Link></li>
            <li><Link href="/shop/hair-care" onClick={closeAll}>Hair Care</Link></li>
            <li><Link href="/shop/bone-calcium" onClick={closeAll}>Bone & Calcium</Link></li>
            <li><Link href="/shop/multivitamins" onClick={closeAll}>Multivitamins</Link></li>
            <li><Link href="/shop/immunity-support" onClick={closeAll}>Immunity Support</Link></li>
          </ul>
        </li>

        <li><Link href="/combo-offers" onClick={closeAll}>Combo Offers</Link></li>
        <li><Link href="/subscription-plans" onClick={closeAll}>Subscription Plans</Link></li>
        <li><Link href="/about-us" onClick={closeAll}>About Us</Link></li>
        <li><Link href="/contact" onClick={closeAll}>Contact</Link></li>
      </ul>

      {/* PROFILE */}
   <div className="profile-wrapper">
  <button
    className="profile-btn"
    disabled={loading}
    onClick={handleProfileClick}
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

      {/* HAMBURGER */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}