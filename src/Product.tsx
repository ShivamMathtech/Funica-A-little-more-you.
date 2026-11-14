import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Maximize2,
  PackageCheck,
  RotateCcw,
  Share2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Breadcrumb, Empty, Modal, ProductCard, Quantity } from "./components";
import { findProduct, money, products } from "./data";
import { useStore } from "./store";
export default function ProductPage() {
  const { id } = useParams();
  const p = findProduct(id || "");
  const s = useStore();
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [tab, setTab] = useState("Details");
  useEffect(() => {
    setColor(p?.colors[0].name || "");
    setQty(1);
    setTab("Details");
  }, [p?.id]);
  if (!p)
    return (
      <div className="container page">
        <Empty
          title="This piece isn’t here."
          text="Let’s find something else that feels like home."
        />
      </div>
    );
  const related = products
    .filter((x) => x.id !== p.id)
    .sort(
      (a, b) =>
        Number(b.category === p.category) - Number(a.category === p.category),
    )
    .slice(0, 4);
  return (
    <div className="container page product-page">
      <Breadcrumb current={p.name} shop />
      <div className="product-detail">
        <div className="detail-gallery">
          <div className="detail-image">
            <img src={`/images/${p.image}.jpg`} alt={p.name} />
            {p.tag && <span className="product-tag">{p.tag}</span>}
            <button
              className="image-zoom icon-btn"
              aria-label="Expand product photo"
              onClick={() => setZoom(true)}
            >
              <Maximize2 size={20} />
            </button>
          </div>
          <p className="gallery-note">
            A closer look at the details that make a difference.
          </p>
        </div>
        <div className="detail-copy">
          <div className="eyebrow">
            THE FUNICA {p.category.toUpperCase()} COLLECTION
          </div>
          <h1>{p.name}</h1>
          <div className="detail-rating">
            <span className="stars">★★★★★</span>
            <b>{p.rating}</b>
            <button onClick={() => setTab("Reviews")}>
              {p.reviews} sample ratings
            </button>
            <span className="in-stock">
              <i />
              In stock · Demo
            </span>
          </div>
          <div className="detail-price">
            {money(p.price)}{" "}
            {p.original && (
              <>
                <del>{money(p.original)}</del>
                <span>
                  Save {Math.round((1 - p.price / p.original) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="tax-note">
            Illustrative price, inclusive of demo taxes.
          </p>
          <p className="product-description">{p.description}</p>
          <div className="finish-label">
            Finish <b>{color}</b>
          </div>
          <div className="color-choices">
            {p.colors.map((c) => (
              <button
                key={c.name}
                title={c.name}
                aria-label={`Choose ${c.name}`}
                aria-pressed={color === c.name}
                className={color === c.name ? "selected" : ""}
                onClick={() => setColor(c.name)}
              >
                <span style={{ background: c.hex }}>
                  {color === c.name && (
                    <Check
                      size={17}
                      color={
                        [
                          "Ivory",
                          "Natural oak",
                          "Sand",
                          "Pebble grey",
                        ].includes(c.name)
                          ? "#222"
                          : "white"
                      }
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <p className="finish-note">
            Photo shows the original finish. Other finishes are demo options.
          </p>
          <div className="add-to-bag">
            <Quantity value={qty} onChange={setQty} />
            <button
              className="button"
              onClick={() => s.addToCart(p.id, color || p.colors[0].name, qty)}
            >
              <ShoppingBag size={19} /> Add to bag{" "}
              <span>{money(p.price * qty)}</span>
            </button>
            <button
              className={`outline-icon ${s.wishlist.includes(p.id) ? "saved" : ""}`}
              aria-label={
                s.wishlist.includes(p.id)
                  ? "Remove from wishlist"
                  : "Save to wishlist"
              }
              aria-pressed={s.wishlist.includes(p.id)}
              onClick={() => s.toggleWishlist(p.id)}
            >
              <Heart
                size={21}
                fill={s.wishlist.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="detail-benefits">
            <span>
              <Truck size={19} />
              <span>
                Standard delivery in 5–7 days
                <small>Free on orders over ₹15,000</small>
              </span>
            </span>
            <span>
              <RotateCcw size={19} />
              <span>
                30 days to find its place
                <small>Illustrative delivery & return policy</small>
              </span>
            </span>
          </div>
          <button
            className="text-link share-link"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                s.setToast("Product link copied");
              } catch {
                s.setToast("Copy the product URL from your address bar");
              }
            }}
          >
            <Share2 size={16} /> Share this find
          </button>
        </div>
      </div>
      <section className="product-info">
        <div className="detail-tabs" role="tablist">
          {["Details", "Care", "Reviews"].map((t) => (
            <button
              role="tab"
              aria-selected={tab === t}
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "active" : ""}
            >
              {t === "Reviews" ? "Sample reviews" : t}
            </button>
          ))}
        </div>
        <div className="tab-content" role="tabpanel">
          {tab === "Details" ? (
            <div className="spec-grid">
              <div>
                <p className="eyebrow">A LITTLE MORE ABOUT THIS PIECE</p>
                <h3>Considered from every angle.</h3>
                <p>{p.description}</p>
              </div>
              <dl>
                <div>
                  <dt>Materials</dt>
                  <dd>{p.material}</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>{p.dimensions}</dd>
                </div>
                <div>
                  <dt>Product code</dt>
                  <dd>FN-{p.id.toUpperCase()}</dd>
                </div>
                <div>
                  <dt>Assembly</dt>
                  <dd>
                    {["Decor", "Lighting"].includes(p.category)
                      ? "Minimal assembly required"
                      : "Simple assembly · Guide included"}
                  </dd>
                </div>
              </dl>
            </div>
          ) : tab === "Care" ? (
            <div className="care-copy">
              <h3>A little care goes a long way.</h3>
              <p>
                Dust regularly with a clean, dry cloth. Keep away from prolonged
                direct sunlight and excess moisture. Blot spills immediately,
                and avoid abrasive cleaners. For upholstered pieces, vacuum
                gently using a soft brush attachment.
              </p>
              <p className="muted">
                Care notes and product specifications are illustrative demo
                content.
              </p>
            </div>
          ) : (
            <div className="review-grid">
              <div>
                <h2>
                  {p.rating}
                  <small>/ 5</small>
                </h2>
                <div className="stars">★★★★★</div>
                <p className="muted">Illustrative reviews for this demo.</p>
              </div>
              {[
                {
                  name: "Ananya R.",
                  title: "Fits right into our home.",
                  text: "The understated design is exactly what our space needed. Such a lovely finishing touch.",
                },
                {
                  name: "Rohan M.",
                  title: "The details make it.",
                  text: "A thoughtful shape and a beautiful finish. It brings a little character to the room.",
                },
              ].map((r) => (
                <article key={r.name}>
                  <div className="stars">★★★★★</div>
                  <h4>{r.title}</h4>
                  <p>{r.text}</p>
                  <small>{r.name} · Sample review</small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BETTER TOGETHER</p>
            <h2>A few good companions.</h2>
          </div>
          <Link className="text-link" to="/shop">
            Explore more <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {related.map((x) => (
            <ProductCard key={x.id} product={x} />
          ))}
        </div>
      </section>
      {zoom && (
        <Modal title={p.name} wide onClose={() => setZoom(false)}>
          <img
            className="zoomed-image"
            src={`/images/${p.image}.jpg`}
            alt={p.name}
          />
        </Modal>
      )}
    </div>
  );
}
