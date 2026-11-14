/** Pure commerce rules shared by the UI and tests. All amounts are integer INR. */
export const MAX_QUANTITY = 10;
export function normalizeQuantity(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? Math.max(1, Math.min(MAX_QUANTITY, Math.trunc(numeric)))
    : 1;
}
export function addLine(cart, productId, color, quantity = 1) {
  const key = `${productId}::${color}`;
  const found = cart.find((line) => line.key === key);
  return found
    ? cart.map((line) =>
        line.key === key
          ? {
              ...line,
              quantity: normalizeQuantity(
                line.quantity + normalizeQuantity(quantity),
              ),
            }
          : line,
      )
    : [
        ...cart,
        { key, productId, color, quantity: normalizeQuantity(quantity) },
      ];
}
export function quote(cart, products, promo = "", delivery = "standard") {
  const subtotal = cart.reduce((total, line) => {
    const product = products.find((item) => item.id === line.productId);
    return (
      total + (product ? product.price * normalizeQuantity(line.quantity) : 0)
    );
  }, 0);
  const normalized = String(promo).trim().toUpperCase();
  const rate =
    normalized === "WELCOME10" ? 0.1 : normalized === "ROOM15" ? 0.15 : 0;
  const discount = Math.round(subtotal * rate);
  const shipping =
    subtotal === 0
      ? 0
      : delivery === "express"
        ? 999
        : subtotal >= 15000
          ? 0
          : 499;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    validPromo: rate > 0,
  };
}
export function validateAddress(address) {
  if (
    !address.name?.trim() ||
    !address.line?.trim() ||
    !address.city?.trim() ||
    !address.state?.trim()
  )
    return "Please complete all delivery address fields.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email || ""))
    return "Enter a valid email address.";
  if (!/^\d{10}$/.test(address.phone || ""))
    return "Enter a 10-digit Indian mobile number.";
  if (!/^[1-9]\d{5}$/.test(address.pin || ""))
    return "Enter a valid 6-digit PIN code.";
  return "";
}
export function sanitizeCart(value, products) {
  if (!Array.isArray(value)) return [];
  return value.reduce((cart, line) => {
    const product = products.find((p) => p.id === line?.productId);
    if (!product || !product.colors.some((c) => c.name === line.color))
      return cart;
    return addLine(
      cart,
      product.id,
      line.color,
      normalizeQuantity(line.quantity),
    );
  }, []);
}
