import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Heart,
  HelpCircle,
  MapPin,
  Package,
  Truck,
  UserRound,
} from "lucide-react";
import { Breadcrumb, Empty, Modal } from "./components";
import { money } from "./data";
import { useStore } from "./store";
import type { Order } from "./store";
import { AddressFields } from "./Checkout";
import { validateAddress } from "./commerce.mjs";
const statuses = ["Confirmed", "Preparing", "Dispatched", "Delivered"];
function receipt(order: Order) {
  const text = [
    "FUNICA — DEMO ORDER RECEIPT",
    "No payment collected. No items will be shipped.",
    `Order: ${order.id}`,
    `Created: ${new Date(order.date).toLocaleString("en-IN")}`,
    `Status: ${order.status}`,
    "",
    ...order.lines.map(
      (l) =>
        `${l.name} | ${l.color} | Qty ${l.quantity} | ${money(l.price * l.quantity)}`,
    ),
    "",
    `Subtotal: ${money(order.subtotal)}`,
    `Discount: ${money(order.discount)}`,
    `Delivery: ${money(order.shipping)}`,
    `Total: ${money(order.total)}`,
    "",
    `Delivery to: ${order.address.name}`,
    order.address.line,
    `${order.address.city}, ${order.address.state} ${order.address.pin}`,
    `Payment method: ${order.payment}`,
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = order.id + "-demo-receipt.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Orders() {
  const s = useStore();
  const [filter, setFilter] = useState("All");
  const [detail, setDetail] = useState("");
  const [cancel, setCancel] = useState("");
  const selected = s.orders.find((o) => o.id === detail);
  const visible = s.orders.filter(
    (o) =>
      filter === "All" ||
      (filter === "Active"
        ? !["Delivered", "Cancelled"].includes(o.status)
        : o.status === filter),
  );
  return (
    <div className="container page">
      <Breadcrumb current="Your orders" />
      <div className="page-heading">
        <p className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p>
        <h1>
          Your orders<span>.</span>
        </h1>
        <p>
          All your favourite finds, in one place. Orders here are a local demo.
        </p>
      </div>
      {s.orders.length ? (
        <>
          <div className="order-tabs">
            {["All", "Active", "Delivered", "Cancelled"].map((f) => (
              <button
                className={filter === f ? "active" : ""}
                key={f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="order-list">
            {visible.map((o) => (
              <article className="order-card" key={o.id}>
                <div className="order-card-head">
                  <div>
                    <b>{o.id}</b>
                    <small>
                      {new Date(o.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </small>
                  </div>
                  <span
                    className={`status-pill ${o.status === "Cancelled" ? "cancelled" : ""}`}
                  >
                    {o.status === "Delivered" ? (
                      <Check size={14} />
                    ) : (
                      <Package size={14} />
                    )}{" "}
                    {o.status}
                  </span>
                </div>
                {o.lines.map((l) => (
                  <div className="mini-item" key={l.key}>
                    <img src={"/images/" + l.image + ".jpg"} alt={l.name} />
                    <span>
                      <b>{l.name}</b>
                      <small>
                        {l.color} · Qty {l.quantity}
                      </small>
                    </span>
                    <strong>{money(l.price * l.quantity)}</strong>
                  </div>
                ))}
                <div className="order-card-footer">
                  <span>
                    Total <b>{money(o.total)}</b>
                  </span>
                  <button
                    className="button secondary small"
                    onClick={() => setDetail(o.id)}
                  >
                    View order <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
            {!visible.length && (
              <div className="empty compact">
                <Package size={32} />
                <h3>No {filter.toLowerCase()} orders.</h3>
                <p>Try another tab to see your demo purchases.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <Empty
          icon="orders"
          title="Your first favourite is still out there."
          text="Place a demo order and it will appear here, with a receipt and a simulated delivery timeline."
        />
      )}
      {selected && (
        <Modal
          wide
          title={"Order " + selected.id}
          onClose={() => setDetail("")}
        >
          <p className="muted">
            Demo order · Created{" "}
            {new Date(selected.date).toLocaleDateString("en-IN")}
          </p>
          {selected.status !== "Cancelled" ? (
            <div className="order-timeline">
              {statuses.map((st, i) => (
                <div
                  className={
                    statuses.indexOf(selected.status) >= i ? "done" : ""
                  }
                  key={st}
                >
                  <span>
                    {statuses.indexOf(selected.status) >= i ? (
                      <Check size={17} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <small>{st}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="demo-notice">
              This demo order has been cancelled.
            </div>
          )}
          <div className="receipt-address">
            <h4>Delivery details</h4>
            <p>
              {selected.address.name}
              <br />
              {selected.address.line}
              <br />
              {selected.address.city}, {selected.address.state}{" "}
              {selected.address.pin}
            </p>
            <span>
              {selected.delivery === "standard" ? "Standard" : "Express"}{" "}
              delivery · {selected.payment}
            </span>
          </div>
          <div className="receipt-totals">
            <p>
              Subtotal <b>{money(selected.subtotal)}</b>
            </p>
            <p>
              Discount <b>−{money(selected.discount)}</b>
            </p>
            <p>
              Delivery <b>{money(selected.shipping)}</b>
            </p>
            <p>
              Total <b>{money(selected.total)}</b>
            </p>
          </div>
          <div className="modal-buttons">
            <button
              className="button secondary"
              onClick={() => receipt(selected)}
            >
              <Download size={17} /> Download receipt
            </button>
            {!["Cancelled", "Delivered"].includes(selected.status) && (
              <button
                className="button"
                onClick={() =>
                  s.updateOrder(
                    selected.id,
                    statuses[statuses.indexOf(selected.status) + 1],
                  )
                }
              >
                Advance demo status <ArrowRight size={17} />
              </button>
            )}
            {["Confirmed", "Preparing"].includes(selected.status) && (
              <button
                className="text-link danger"
                onClick={() => setCancel(selected.id)}
              >
                Cancel demo order
              </button>
            )}
          </div>
          <p className="small-note">
            The timeline changes only when you advance the demo status. No
            carrier is connected.
          </p>
        </Modal>
      )}
      {cancel && (
        <Modal title="Cancel this demo order?" onClose={() => setCancel("")}>
          <p>
            Your order will remain in your history with a cancelled status. No
            refund is needed because this is a demo.
          </p>
          <div className="modal-buttons">
            <button className="button secondary" onClick={() => setCancel("")}>
              Keep order
            </button>
            <button
              className="button"
              onClick={() => {
                s.updateOrder(cancel, "Cancelled");
                setCancel("");
              }}
            >
              Cancel order
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default function Account() {
  const s = useStore();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(s.profile);
  const [address, setAddress] = useState(s.address);
  const [error, setError] = useState("");
  function saveAddress(e: FormEvent) {
    e.preventDefault();
    const msg = validateAddress(address);
    setError(msg);
    if (!msg) s.saveAddress(address);
  }
  return (
    <div className="container page">
      <Breadcrumb current="Your account" />
      <div className="page-heading">
        <p className="eyebrow">MAKE YOURSELF AT HOME</p>
        <h1>
          {s.profile.name
            ? `Hello, ${s.profile.name.split(" ")[0]}.`
            : "A space of your own."}
        </h1>
        <p>Your details, favourites, and little plans for home.</p>
      </div>
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-avatar">
            {s.profile.name ? (
              s.profile.name.slice(0, 1).toUpperCase()
            ) : (
              <UserRound size={27} />
            )}
          </div>
          <h3>{s.profile.name || "Welcome, home lover"}</h3>
          <p>Local demo profile</p>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
          >
            <UserRound size={19} /> My profile <ChevronRight size={16} />
          </button>
          <button
            className={tab === "address" ? "active" : ""}
            onClick={() => setTab("address")}
          >
            <MapPin size={19} /> Delivery address <ChevronRight size={16} />
          </button>
          <Link to="/orders">
            <Package size={19} /> My orders <ChevronRight size={16} />
          </Link>
          <Link to="/wishlist">
            <Heart size={19} /> My wishlist <ChevronRight size={16} />
          </Link>
          <Link to="/help">
            <HelpCircle size={19} /> Help centre <ChevronRight size={16} />
          </Link>
        </aside>
        <section className="account-panel">
          {tab === "profile" ? (
            <>
              <h2>Let’s get to know you.</h2>
              <p className="muted">
                A personal touch for your shopping experience.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!profile.name.trim()) {
                    setError("Please enter your name.");
                    return;
                  }
                  setError("");
                  s.saveProfile({
                    name: profile.name.trim(),
                    email: profile.email.trim(),
                  });
                }}
              >
                <div className="form-grid">
                  <label className="field">
                    Your name
                    <input
                      required
                      maxLength={60}
                      autoComplete="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    Email address
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </label>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button className="button" type="submit">
                  Save profile <Check size={17} />
                </button>
              </form>
              <div className="demo-notice">
                <UserRound size={20} />
                <p>
                  This is a browser-local demo profile. It does not create an
                  account or provide authentication. Use sample information.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2>Somewhere to call home.</h2>
              <p className="muted">
                Save an address to make your next demo checkout a little easier.
              </p>
              <form onSubmit={saveAddress}>
                <AddressFields value={address} onChange={setAddress} />
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="button" type="submit">
                  Save address <Check size={17} />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
