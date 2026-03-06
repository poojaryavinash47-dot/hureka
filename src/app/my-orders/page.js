"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrderCard from "@/components/OrderCard";

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user) return;

    const fetchOrders = async () => {
      setFetching(true);
      try {
        const res = await fetch(
          `/api/get-orders?email=${encodeURIComponent(user.email)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch orders error", err);
        setOrders([]);
      } finally {
        setFetching(false);
      }
    };

    fetchOrders();
  }, [user, loading]);

  if (loading || (!user && !fetching)) return null;

  return (
    <section className="my-orders-page">
      <div className="my-orders-container">
        <header className="my-orders-header">
          <h1 className="my-orders-title">My Orders</h1>
        </header>

        {fetching ? (
          <p className="my-orders-loading">Fetching your orders...</p>
        ) : orders.length === 0 ? (
          <div className="my-orders-empty">
            <p className="my-orders-empty-text">
              You haven't ordered anything yet
            </p>
            <button
              type="button"
              className="my-orders-empty-btn"
              onClick={() => router.push("shop/joint-care")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="my-orders-grid">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
