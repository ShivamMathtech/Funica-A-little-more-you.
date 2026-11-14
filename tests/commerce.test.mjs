import test from "node:test";
import assert from "node:assert/strict";
import {
  addLine,
  quote,
  normalizeQuantity,
  sanitizeCart,
  validateAddress,
} from "../src/commerce.mjs";
const products = [
  { id: "chair", price: 8499, colors: [{ name: "Oak" }, { name: "Ivory" }] },
  { id: "lamp", price: 5499, colors: [{ name: "Black" }] },
];
const address = {
  name: "Demo Customer",
  email: "demo@example.com",
  phone: "9000000000",
  line: "12 Sample Street",
  city: "Dehradun",
  state: "Uttarakhand",
  pin: "248001",
};
test("same product and finish merge, preserving total quantity", () => {
  const cart = addLine(addLine([], "chair", "Oak", 2), "chair", "Oak", 3);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 5);
});
test("different finishes remain separate cart lines", () => {
  const cart = addLine(addLine([], "chair", "Oak"), "chair", "Ivory");
  assert.equal(cart.length, 2);
});
test("quantity never exceeds the 10 item limit", () => {
  const cart = addLine(addLine([], "chair", "Oak", 8), "chair", "Oak", 4);
  assert.equal(cart[0].quantity, 10);
});
test("invalid quantities are normalized safely", () => {
  for (const input of [-5, 0, NaN, Infinity, "oops"])
    assert.equal(normalizeQuantity(input), 1);
  assert.equal(normalizeQuantity(3.8), 3);
});
test("standard shipping below the threshold costs 499", () => {
  assert.equal(quote(addLine([], "chair", "Oak"), products).total, 8998);
});
test("free standard shipping applies at the subtotal threshold", () => {
  const q = quote(addLine([], "chair", "Oak", 2), products);
  assert.equal(q.shipping, 0);
  assert.equal(q.total, 16998);
});
test("welcome discount rounds to integer rupees", () => {
  const q = quote(addLine([], "chair", "Oak"), products, " welcome10 ");
  assert.equal(q.discount, 850);
  assert.equal(q.total, 8148);
  assert.equal(q.validPromo, true);
});
test("room code gives 15 percent; unknown code gives no discount", () => {
  assert.equal(
    quote(addLine([], "chair", "Oak"), products, "ROOM15").discount,
    1275,
  );
  assert.equal(
    quote(addLine([], "chair", "Oak"), products, "INVALID").discount,
    0,
  );
});
test("express shipping remains 999 even above free standard threshold", () => {
  assert.equal(
    quote(addLine([], "chair", "Oak", 2), products, "WELCOME10", "express")
      .shipping,
    999,
  );
});
test("empty carts do not acquire a shipping charge", () => {
  const q = quote([], products, "", "express");
  assert.equal(q.total, 0);
  assert.equal(q.shipping, 0);
});
test("unrecognized products cannot affect totals", () => {
  assert.equal(
    quote([{ productId: "missing", quantity: 2 }], products).total,
    0,
  );
});
test("corrupt stored lines and unknown finishes are discarded", () => {
  const cart = sanitizeCart(
    [
      null,
      { productId: "missing", color: "Oak" },
      { productId: "chair", color: "Unknown" },
      { productId: "lamp", color: "Black", quantity: 3 },
    ],
    products,
  );
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);
});
test("valid Indian delivery details pass validation", () =>
  assert.equal(validateAddress(address), ""));
test("missing and invalid delivery data is rejected", () => {
  for (const patch of [
    { name: " " },
    { email: "not-email" },
    { phone: "123" },
    { pin: "000000" },
    { pin: "24800" },
    { line: "" },
  ])
    assert.notEqual(validateAddress({ ...address, ...patch }), "");
});
