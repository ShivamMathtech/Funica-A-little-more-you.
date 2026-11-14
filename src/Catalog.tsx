import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { products, money, categories } from "./data";
import { Breadcrumb, Empty, ProductCard } from "./components";
import { CategoryTabs } from "./Home";
import { useStore } from "./store";
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(false);
  const query = params.get("q") || "";
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "featured";
  const max = Number(params.get("max") || 60000);
  const sale = params.get("sale") === "true";
  const rating = params.get("rating") === "true";
  function update(key: string, value: string) {
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  let found = products.filter(
    (p) =>
      (category === "All" ||
        !categories.includes(category as (typeof categories)[number]) ||
        p.category === category) &&
      (!query ||
        (p.name + " " + p.category + " " + p.material)
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      p.price <= max &&
      (!sale || p.original) &&
      (!rating || p.rating >= 4.8),
  );
  if (sort === "price-low") found.sort((a, b) => a.price - b.price);
  if (sort === "price-high") found.sort((a, b) => b.price - a.price);
  if (sort === "rating") found.sort((a, b) => b.rating - a.rating);
  if (sort === "new") found.sort((a, b) => Number(!!b.new) - Number(!!a.new));
  return (
    <div className="container page">
      <Breadcrumb current="The collection" />
      <div className="page-heading">
        <p className="eyebrow">THOUGHTFUL PIECES, EVERYDAY LIVING</p>
        <h1>
          {query
            ? `Looking for “${query}”`
            : category !== "All"
              ? category
              : sort === "new"
                ? "Something new. Something you."
                : "Find your kind of home."}
        </h1>
        <p>
          A collection of considered shapes, natural textures, and everyday
          favourites.
        </p>
      </div>
      <CategoryTabs
        value={category}
        onChange={(v) => update("category", v === "All" ? "" : v)}
      />
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <Search size={18} />
          <input
            aria-label="Search collection"
            placeholder="Search the collection"
            value={query}
            onChange={(e) => update("q", e.target.value)}
          />
          {query && (
            <button
              className="icon-btn"
              aria-label="Clear search"
              onClick={() => update("q", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="catalog-controls">
          <button
            className={`filter-button ${filters ? "selected" : ""}`}
            onClick={() => setFilters(!filters)}
            aria-expanded={filters}
          >
            <SlidersHorizontal size={17} /> Filters{" "}
            {(sale || rating || max < 60000) && <span className="filter-dot" />}
          </button>
          <label className="sort-label">
            <span>Sort by</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="new">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>
      {filters && (
        <div className="filters-panel">
          <label className="price-filter">
            Maximum price <b>{money(max)}</b>
            <input
              type="range"
              min="3000"
              max="60000"
              step="500"
              value={max}
              onChange={(e) => update("max", e.target.value)}
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sale}
              onChange={(e) => update("sale", e.target.checked ? "true" : "")}
            />{" "}
            Sale pieces only
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rating}
              onChange={(e) => update("rating", e.target.checked ? "true" : "")}
            />{" "}
            Rated 4.8 and above
          </label>
          <button className="text-link" onClick={() => setParams({})}>
            Reset all <X size={15} />
          </button>
        </div>
      )}
      <div className="results-count">
        {found.length} thoughtful {found.length === 1 ? "piece" : "pieces"}{" "}
        <span>Find the one that fits.</span>
      </div>
      {found.length ? (
        <div className="product-grid">
          {found.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Search size={38} />
          <h2>No pieces found</h2>
          <p>Try a different search or give your filters a little more room.</p>
          <button className="button" onClick={() => setParams({})}>
            Clear all filters <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
export function Wishlist() {
  const { wishlist } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container page">
      <Breadcrumb current="Your wishlist" />
      <div className="page-heading">
        <p className="eyebrow">KEEP THE GOOD ONES CLOSE</p>
        <h1>
          Your favourites<span>.</span>
        </h1>
        <p>
          {saved.length
            ? `${saved.length} lovely ${saved.length === 1 ? "find" : "finds"}, saved for a little later.`
            : "A little collection of things you love."}
        </p>
      </div>
      {saved.length ? (
        <>
          <div className="product-grid">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Link className="text-link wishlist-more" to="/shop">
            Find a few more favourites <ArrowRight size={18} />
          </Link>
        </>
      ) : (
        <Empty
          icon="heart"
          title="Something will catch your eye."
          text="Tap the heart on any piece to save it here. Your favourites stay with you on this browser."
        />
      )}
    </div>
  );
}
