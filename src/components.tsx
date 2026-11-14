import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Armchair,
  ArrowRight,
  Check,
  Heart,
  Home,
  Menu,
  Package,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";
import { money, products } from "./data";
import type { Product } from "./data";
import { useStore } from "./store";

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Funica home">
      <span className="brand-mark">
        <Armchair size={23} strokeWidth={2} />
      </span>
      funica<span className="brand-dot">.</span>
    </Link>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-btn"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function SearchDialog({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const found = products
    .filter((p) =>
      (p.name + " " + p.category + " " + p.material)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .slice(0, 4);
  function go(url: string) {
    close();
    navigate(url);
  }
  return (
    <Modal title="Find something you love" onClose={close}>
      <form
        className="search-field"
        onSubmit={(e) => {
          e.preventDefault();
          go("/shop?q=" + encodeURIComponent(query));
        }}
      >
        <Search size={20} />
        <input
          aria-label="Search furniture"
          autoFocus
          placeholder="Try ‘chair’, ‘oak’, or ‘sofa’"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="icon-btn" aria-label="See search results">
          <ArrowRight size={20} />
        </button>
      </form>
      <p className="eyebrow search-label">
        {query ? "MATCHING PIECES" : "A FEW FAVOURITES"}
      </p>
      <div className="search-results">
        {found.map((p) => (
          <button key={p.id} onClick={() => go("/product/" + p.id)}>
            <img src={`/images/${p.image}.jpg`} alt="" />
            <span>
              <strong>{p.name}</strong>
              <small>
                {p.category} · {money(p.price)}
              </small>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
        {!found.length && (
          <p className="muted">
            No matches yet. Try another material or product name.
          </p>
        )}
      </div>
      <button
        className="button full"
        onClick={() => go("/shop?q=" + encodeURIComponent(query))}
      >
        View all results <ArrowRight size={18} />
      </button>
    </Modal>
  );
}
export function Layout({ children }: { children: ReactNode }) {
  const store = useStore();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenu(false);
  }, [location.pathname]);
  useEffect(() => {
    const names: Record<string, string> = {
      "/": "A little more you.",
      "/shop": "Shop the collection",
      "/cart": "Your shopping bag",
      "/wishlist": "Your favourites",
      "/orders": "Your orders",
      "/account": "Your account",
      "/checkout": "Demo checkout",
      "/about": "Our story",
      "/help": "Help & information",
    };
    document.title = `Funica — ${names[location.pathname] || "Thoughtful furniture"}`;
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <span>
          Good things come home. <b>10% off your first order</b>
        </span>
        <button
          onClick={() => {
            store.setPromo("WELCOME10");
            store.setToast("WELCOME10 applied to your bag");
          }}
        >
          Use WELCOME10 <ArrowRight size={13} />
        </button>
        <span className="announcement-side">
          Thoughtfully made. Beautifully lived.
        </span>
      </div>
      <header className="header">
        <div className="header-inner">
          <button
            className="icon-btn mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink
              to="/shop"
              className={
                location.pathname === "/shop" &&
                !location.search.includes("sort=new")
                  ? "active"
                  : ""
              }
            >
              Shop collection
            </NavLink>
            <NavLink
              to="/shop?sort=new"
              className={
                location.pathname === "/shop" &&
                location.search.includes("sort=new")
                  ? "active"
                  : ""
              }
            >
              New arrivals <span className="nav-dot" />
            </NavLink>
            <NavLink to="/about">Our story</NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn"
              aria-label="Search products"
              onClick={() => setSearch(true)}
            >
              <Search size={21} />
            </button>
            <Link
              className="icon-btn desktop-action"
              to="/wishlist"
              aria-label={`Wishlist, ${store.wishlist.length} items`}
            >
              <Heart size={21} />
              {store.wishlist.length > 0 && (
                <span className="count-dot">{store.wishlist.length}</span>
              )}
            </Link>
            <Link
              className="icon-btn desktop-action"
              to="/account"
              aria-label="Your account"
            >
              <UserRound size={21} />
            </Link>
            <span className="action-divider" />
            <Link
              className="bag-link"
              to="/cart"
              aria-label={`Shopping bag, ${store.cartCount} items`}
            >
              <ShoppingBag size={21} />
              <span className="bag-word">Bag</span>
              <b>{store.cartCount}</b>
            </Link>
          </div>
        </div>
        {menu && (
          <nav className="mobile-dropdown">
            <Link to="/shop" onClick={() => setMenu(false)}>
              Shop collection <ArrowRight size={18} />
            </Link>
            <Link to="/shop?sort=new" onClick={() => setMenu(false)}>
              New arrivals <ArrowRight size={18} />
            </Link>
            <Link to="/about">
              Our story <ArrowRight size={18} />
            </Link>
            <Link to="/help">
              Help & information <ArrowRight size={18} />
            </Link>
          </nav>
        )}
      </header>
      {store.storageWarning && (
        <div className="storage-alert">
          Browser storage is unavailable. Your shopping session will not persist
          after a refresh.
        </div>
      )}
      <main id="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-top container">
          <div className="footer-intro">
            <Brand />
            <p>
              Good design feels like home.
              <br />
              Find the pieces that feel like you.
            </p>
            <span className="small-label">
              A little more thoughtful. A little more you.
            </span>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/shop">All furniture</Link>
            <Link to="/shop?sort=new">New arrivals</Link>
            <Link to="/wishlist">Your favourites</Link>
          </div>
          <div>
            <h4>Here to help</h4>
            <Link to="/orders">Your orders</Link>
            <Link to="/help#delivery">Delivery & returns</Link>
            <Link to="/help">FAQs & support</Link>
          </div>
          <div>
            <h4>Make yourself at home</h4>
            <Link to="/about">The Funica story</Link>
            <Link to="/account">Your account</Link>
            <Link to="/help#privacy">Privacy & demo information</Link>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>
            © {new Date().getFullYear()} Funica. Made for everyday living.
          </span>
          <span>Demo storefront · No real payments</span>
          <span>INR ₹ · India</span>
        </div>
      </footer>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/" end>
          <Home />
          <span>Home</span>
        </NavLink>
        <NavLink to="/shop">
          <Search />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/wishlist">
          <Heart />
          <span>Saved</span>
        </NavLink>
        <NavLink to="/orders">
          <Package />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/account">
          <UserRound />
          <span>Profile</span>
        </NavLink>
      </nav>
      {search && <SearchDialog close={() => setSearch(false)} />}
      <div
        className={`toast ${store.toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {store.toast && (
          <>
            <Check size={18} />
            {store.toast}
          </>
        )}
      </div>
    </>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const s = useStore();
  const wished = s.wishlist.includes(p.id);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={"/product/" + p.id} aria-label={`View ${p.name}`}>
          <img
            src={`/images/${p.image}.jpg`}
            alt={p.name}
            loading="lazy"
            width="450"
            height="450"
          />
        </Link>
        {p.tag && (
          <span className={`product-tag ${p.tag === "New" ? "new" : ""}`}>
            {p.tag}
          </span>
        )}
        <button
          className={`favourite ${wished ? "saved" : ""}`}
          aria-label={`${wished ? "Remove" : "Save"} ${p.name} ${wished ? "from" : "to"} wishlist`}
          aria-pressed={wished}
          onClick={() => s.toggleWishlist(p.id)}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
        <button
          className="quick-add"
          aria-label={`Add ${p.name} to bag`}
          onClick={() => s.addToCart(p.id, p.colors[0].name)}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="product-meta">
        <span>{p.category}</span>
        <span className="rating">
          <span>★</span> {p.rating.toFixed(1)} <em>({p.reviews})</em>
        </span>
      </div>
      <Link className="product-name" to={"/product/" + p.id}>
        {p.name}
      </Link>
      <div className="product-bottom">
        <div className="product-price">
          {money(p.price)} {p.original && <del>{money(p.original)}</del>}
        </div>
        <div
          className="mini-swatches"
          aria-label={`Available in ${p.colors.length} finishes`}
        >
          {p.colors.map((c) => (
            <i style={{ background: c.hex }} key={c.name} title={c.name} />
          ))}
        </div>
      </div>
    </article>
  );
}
export function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= 10}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function Empty({
  title,
  text,
  icon = "bag",
  action = "Explore the collection",
}: {
  title: string;
  text: string;
  icon?: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        {icon === "heart" ? (
          <Heart size={35} />
        ) : icon === "orders" ? (
          <Package size={35} />
        ) : (
          <ShoppingBag size={35} />
        )}
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" to="/shop">
        {action}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
export function Breadcrumb({
  current,
  shop = false,
}: {
  current: string;
  shop?: boolean;
}) {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={13} />
      {shop && (
        <>
          <Link to="/shop">Collection</Link>
          <ChevronRight size={13} />
        </>
      )}
      <span>{current}</span>
    </div>
  );
}
