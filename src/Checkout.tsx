import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { Breadcrumb, Empty, Quantity } from "./components";
import { findProduct, money, products } from "./data";
import { quote, validateAddress } from "./commerce.mjs";
import { useStore } from "./store";
import type { Address } from "./store";
export function AddressFields({
  value,
  onChange,
}: {
  value: Address;
  onChange: (v: Address) => void;
}) {
  const field = (
    name: keyof Address,
    label: string,
    type = "text",
    autoComplete?: string,
  ) => (
    <label className={name === "line" ? "field span-2" : "field"} key={name}>
      {label}
      <input
        required
        name={name}
        type={type}
        value={value[name]}
        autoComplete={autoComplete}
        maxLength={name === "pin" ? 6 : name === "phone" ? 10 : 150}
        inputMode={["pin", "phone"].includes(name) ? "numeric" : undefined}
        pattern={
          name === "pin"
            ? "[1-9][0-9]{5}"
            : name === "phone"
              ? "[0-9]{10}"
              : undefined
        }
        onChange={(e) => onChange({ ...value, [name]: e.target.value })}
      />
    </label>
  );
  return (
    <div className="form-grid">
      {field("name", "Full name", "text", "name")}
      {field("email", "Email address", "email", "email")}
      {field("phone", "Mobile number (10 digits)", "tel", "tel-national")}
      {field("pin", "PIN code", "text", "postal-code")}
      {field("line", "Address, apartment, street", "text", "street-address")}
      {field("city", "City", "text", "address-level2")}
      {field("state", "State", "text", "address-level1")}
    </div>
  );
}
function Promo() {
  const s = useStore();
  const [code, setCode] = useState(s.promo);
  const [error, setError] = useState("");
  function apply(e: FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (quote(s.cart, products, c).validPromo) {
      s.setPromo(c);
      setCode(c);
      setError("");
      s.setToast("Your promo code is applied");
    } else setError("Try WELCOME10 for 10% off or ROOM15 for 15% off.");
  }
  return (
    <div className="promo-box">
      <label htmlFor="promo">A little something off</label>
      <form onSubmit={apply}>
        <div>
          <Tag size={16} />
          <input
            id="promo"
            placeholder="Promo code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit">Apply</button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {s.promo && (
        <div className="applied-promo">
          <Check size={14} />
          {s.promo} applied
          <button
            onClick={() => {
              s.setPromo("");
              setCode("");
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
export function Summary({
  delivery = "standard",
  children,
  promo = false,
}: {
  delivery?: string;
  children?: React.ReactNode;
  promo?: boolean;
}) {
  const s = useStore();
  const q = quote(s.cart, products, s.promo, delivery);
  return (
    <aside className="order-summary">
      <h3>Order summary</h3>
      <dl>
        <div>
          <dt>Subtotal ({s.cartCount} items)</dt>
          <dd>{money(q.subtotal)}</dd>
        </div>
        {q.discount > 0 && (
          <div className="discount">
            <dt>Discount · {s.promo}</dt>
            <dd>−{money(q.discount)}</dd>
          </div>
        )}
        <div>
          <dt>{delivery === "express" ? "Express" : "Standard"} delivery</dt>
          <dd>{q.shipping ? money(q.shipping) : "Free"}</dd>
        </div>
      </dl>
      {promo && <Promo />}
      <div className="summary-total">
        <span>Total</span>
        <b>{money(q.total)}</b>
      </div>
      <p className="tax-note">All demo taxes included</p>
      {children}
      <div className="secure-note">
        <LockKeyhole size={14} /> Demo checkout · No charges
      </div>
    </aside>
  );
}
export function Cart() {
  const s = useStore();
  const subtotal = quote(s.cart, products).subtotal;
  return (
    <div className="container page">
      <Breadcrumb current="Your bag" />
      <div className="page-heading">
        <p className="eyebrow">THE START OF SOMETHING LOVELY</p>
        <h1>
          Your shopping bag<span>.</span>
        </h1>
        <p>
          {s.cartCount
            ? `${s.cartCount} ${s.cartCount === 1 ? "piece" : "pieces"} to make yourself at home.`
            : "A little room for a new favourite."}
        </p>
      </div>
      {s.cart.length ? (
        <div className="checkout-layout">
          <div>
            <div className="shipping-progress">
              <Truck size={21} />
              <div>
                <b>
                  {subtotal >= 15000
                    ? "Your order qualifies for free standard delivery."
                    : `You’re ${money(15000 - subtotal)} away from free standard delivery.`}
                </b>
                <div className="progress-track">
                  <i
                    style={{
                      width: `${Math.min((subtotal / 15000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="cart-items">
              {s.cart.map((l) => {
                const p = findProduct(l.productId)!;
                return (
                  <article className="cart-item" key={l.key}>
                    <Link to={"/product/" + p.id}>
                      <img src={"/images/" + p.image + ".jpg"} alt={p.name} />
                    </Link>
                    <div className="cart-item-copy">
                      <span className="eyebrow">{p.category}</span>
                      <Link to={"/product/" + p.id}>
                        <h3>{p.name}</h3>
                      </Link>
                      <p>{l.color}</p>
                      <div className="cart-item-actions">
                        <Quantity
                          value={l.quantity}
                          onChange={(q) => s.quantity(l.key, q)}
                        />
                        <button
                          className="text-link"
                          onClick={() => {
                            s.toggleWishlist(p.id);
                            s.setToast(
                              s.wishlist.includes(p.id)
                                ? "Removed from your wishlist"
                                : "Saved to your wishlist",
                            );
                          }}
                        >
                          {s.wishlist.includes(p.id)
                            ? "Saved"
                            : "Save for later"}
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      <b>{money(p.price * l.quantity)}</b>
                      <button
                        className="icon-btn"
                        aria-label={`Remove ${p.name} from bag`}
                        onClick={() => s.removeLine(l.key)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link className="text-link" to="/shop">
              <ArrowLeft size={17} /> Keep exploring
            </Link>
          </div>
          <Summary promo>
            <Link className="button full" to="/checkout">
              Continue to checkout <ArrowRight size={18} />
            </Link>
          </Summary>
        </div>
      ) : (
        <Empty
          title="Your bag is waiting for a favourite."
          text="Explore thoughtful furniture and little details for your everyday spaces."
        />
      )}
    </div>
  );
}
export function Checkout() {
  const s = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    ...s.address,
    name: s.address.name || s.profile.name,
    email: s.address.email || s.profile.email,
  });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("Demo card");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitted = useRef(false);
  function next(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      const msg = validateAddress(address);
      setError(msg);
      if (msg) return;
    }
    setStep(step + 1);
    setError("");
    window.scrollTo({ top: 100, behavior: "smooth" });
  }
  function place() {
    if (submitted.current) return;
    submitted.current = true;
    setBusy(true);
    try {
      const id = s.placeOrder(address, delivery, payment);
      nav("/order-success/" + id, { replace: true });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save this demo order.",
      );
      submitted.current = false;
      setBusy(false);
    }
  }
  if (!s.cart.length)
    return (
      <div className="container page">
        <Empty
          title="Your bag is empty."
          text="Choose a favourite before heading to checkout."
        />
      </div>
    );
  return (
    <div className="container page">
      <Breadcrumb current="Checkout" />
      <div className="page-heading">
        <p className="eyebrow">ONE STEP CLOSER TO HOME</p>
        <h1>
          Make it yours<span>.</span>
        </h1>
        <p>
          This is a demo purchase. No payment is collected and no items are
          shipped.
        </p>
      </div>
      <div className="checkout-steps">
        {["Your details", "Delivery & payment", "Review order"].map((t, i) => (
          <button
            key={t}
            disabled={i + 1 > step}
            className={step >= i + 1 ? "active" : ""}
            onClick={() => setStep(i + 1)}
          >
            <span>{step > i + 1 ? <Check size={16} /> : i + 1}</span>
            {t}
          </button>
        ))}
      </div>
      <div className="checkout-layout">
        <section className="checkout-form">
          <div className="section-subheading">
            {step === 1 ? <MapPin /> : step === 2 ? <Truck /> : <ShoppingBag />}
            <h2>
              {step === 1
                ? "Where should it feel like home?"
                : step === 2
                  ? "The finishing details."
                  : "Looking good. One last look."}
            </h2>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {step === 1 ? (
            <form onSubmit={next}>
              <p className="muted form-note">
                Use sample details for this demo. They stay in this browser.
              </p>
              <AddressFields value={address} onChange={setAddress} />
              <button className="button" type="submit">
                Continue to delivery <ArrowRight size={18} />
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={next}>
              <h4>Choose delivery</h4>
              {[
                {
                  id: "standard",
                  title: "Standard delivery",
                  text: "5–7 business days",
                  cost: quote(s.cart, products, s.promo, "standard").shipping,
                },
                {
                  id: "express",
                  title: "Express delivery",
                  text: "2–3 business days",
                  cost: 999,
                },
              ].map((d) => (
                <label
                  className={`option-card ${delivery === d.id ? "selected" : ""}`}
                  key={d.id}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === d.id}
                    onChange={() => setDelivery(d.id)}
                  />
                  <Truck size={23} />
                  <span>
                    <b>{d.title}</b>
                    <small>{d.text} · Illustrative estimate</small>
                  </span>
                  <strong>{d.cost ? money(d.cost) : "Free"}</strong>
                </label>
              ))}
              <h4 className="payment-heading">Payment method</h4>
              {["Demo card", "Demo cash on delivery"].map((p) => (
                <label
                  className={`option-card ${payment === p ? "selected" : ""}`}
                  key={p}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === p}
                    onChange={() => setPayment(p)}
                  />
                  <CreditCard size={23} />
                  <span>
                    <b>{p}</b>
                    <small>
                      {p === "Demo card"
                        ? "No card details required or collected"
                        : "Simulated cash payment only"}
                    </small>
                  </span>
                </label>
              ))}
              <button className="button" type="submit">
                Review your order <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="review-order">
              <div className="review-address">
                <div>
                  <h4>Delivery address</h4>
                  <b>{address.name}</b>
                  <p>
                    {address.line}
                    <br />
                    {address.city}, {address.state} {address.pin}
                    <br />
                    {address.phone} · {address.email}
                  </p>
                </div>
                <button className="text-link" onClick={() => setStep(1)}>
                  Edit
                </button>
              </div>
              <div className="review-delivery">
                <span>
                  <Truck size={19} />
                  {delivery === "standard" ? "Standard" : "Express"} delivery
                </span>
                <span>
                  <CreditCard size={19} />
                  {payment}
                </span>
              </div>
              {s.cart.map((l) => {
                const p = findProduct(l.productId)!;
                return (
                  <div className="mini-item" key={l.key}>
                    <img src={"/images/" + p.image + ".jpg"} alt={p.name} />
                    <span>
                      <b>{p.name}</b>
                      <small>
                        {l.color} · Qty {l.quantity}
                      </small>
                    </span>
                    <strong>{money(p.price * l.quantity)}</strong>
                  </div>
                );
              })}
              <div className="demo-notice">
                <LockKeyhole size={18} />
                <p>
                  This creates a demo order on this device. No real purchase,
                  payment, or delivery takes place.
                </p>
              </div>
              <button className="button full" disabled={busy} onClick={place}>
                {busy ? "Saving order…" : "Place demo order"}{" "}
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>
        <Summary delivery={delivery} />
      </div>
    </div>
  );
}
export function OrderSuccess() {
  const { id } = useParams();
  const s = useStore();
  const order = s.orders.find((o) => o.id === id);
  if (!order)
    return (
      <div className="container page">
        <Empty
          title="We can’t find this demo order."
          text="Orders are saved on the browser where you placed them."
          icon="orders"
        />
      </div>
    );
  return (
    <div className="container success-page">
      <div className="success-icon">
        <CheckCircle2 size={48} strokeWidth={1.3} />
      </div>
      <p className="eyebrow">A LOVELY CHOICE</p>
      <h1>Home looks good on you.</h1>
      <p>
        Your demo order <b>{order.id}</b> is confirmed.
        <br />
        No charge was made, and no items will be shipped.
      </p>
      <div className="success-details">
        <span>
          <small>Order total</small>
          <b>{money(order.total)}</b>
        </span>
        <span>
          <small>Delivery choice</small>
          <b>{order.delivery === "standard" ? "Standard" : "Express"} demo</b>
        </span>
        <span>
          <small>Pieces</small>
          <b>{order.lines.reduce((n, l) => n + l.quantity, 0)} for your home</b>
        </span>
      </div>
      <div className="success-actions">
        <Link className="button" to="/orders">
          View your orders <Package size={18} />
        </Link>
        <Link className="button secondary" to="/shop">
          Keep exploring <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
