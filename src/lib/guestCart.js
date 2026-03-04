const GUEST_CART_KEY = "guest_cart";

const isBrowser = () => typeof window !== "undefined";

export const getGuestCart = () => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read guest_cart", err);
    return [];
  }
};

const saveGuestCart = (items) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save guest_cart", err);
  }
};

export const addItemToGuestCart = (product) => {
  if (!isBrowser() || !product?.productId) return;

  const current = getGuestCart();
  const idx = current.findIndex((item) => item.productId === product.productId);

  if (idx >= 0) {
    current[idx].quantity = (current[idx].quantity || 1) + 1;
  } else {
    current.push({
      productId: product.productId,
      title: product.name || product.title || "",
      price: Number(product.price) || 0,
      quantity: 1,
      image: product.image || "",
    });
  }

  saveGuestCart(current);
};

export const updateGuestCartQuantity = (productId, qty) => {
  if (!isBrowser()) return [];
  const safeQty = Math.max(1, Number(qty) || 1);
  const current = getGuestCart();
  const updated = current.map((item) =>
    item.productId === productId
      ? { ...item, quantity: safeQty }
      : item
  );
  saveGuestCart(updated);
  return updated;
};

export const removeGuestCartItem = (productId) => {
  if (!isBrowser()) return [];
  const current = getGuestCart();
  const updated = current.filter((item) => item.productId !== productId);
  saveGuestCart(updated);
  return updated;
};

export const clearGuestCart = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(GUEST_CART_KEY);
  } catch (err) {
    console.error("Failed to clear guest_cart", err);
  }
};
