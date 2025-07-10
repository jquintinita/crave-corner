export function createTransaction({ items, paymentMethod, discount = 0, staffId }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) - discount;

  return {
    id: crypto.randomUUID(),
    items, // [{ productId, name, quantity, price }]
    total,
    paymentMethod, // "cash" | "card"
    discount,
    date: new Date().toISOString(),
    staffId
  };
}
