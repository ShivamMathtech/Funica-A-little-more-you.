import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Armchair,
  BedDouble,
  Lamp,
  LayoutGrid,
  Leaf,
  MoveUpRight,
  ShieldCheck,
  Sofa,
  Table2,
  Truck,
  Flower2,
  RotateCcw,
} from "lucide-react";
import { categories, products } from "./data";
import { ProductCard } from "./components";
const icons = [LayoutGrid, Armchair, Sofa, Table2, Lamp, Flower2, BedDouble];
export function CategoryTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="category-tabs" aria-label="Furniture categories">
      {categories.map((c, i) => {
        const Icon = icons[i];
        return (
          <button
            key={c}
            className={value === c ? "active" : ""}
            onClick={() => onChange(c)}
            aria-pressed={value === c}
          >
            <Icon size={19} />
            {c === "All" ? "All furniture" : c}
          </button>
        );
      })}
    </div>
  );
}
export default function Home() {
  const [category, setCategory] = useState("All");
  const visible = products
    .filter((p) => category === "All" || p.category === category)
    .slice(0, 8);
  return (
    <div className="home">
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> THE EVERYDAY COLLECTION
          </div>
          <h1>
            A home.
            <br />A feeling.
            <br />A little more <i>you.</i>
          </h1>
          <p>
            Thoughtful furniture. Beautiful little details.
            <br className="desktop-br" /> For the life you make at home.
          </p>
          <Link className="button" to="/shop">
            Explore the collection <ArrowRight size={18} />
          </Link>
          <div className="hero-caption">
            <span className="caption-line" /> Considered design. Everyday
            comfort.
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/images/hero.jpg"
            alt="Sunlit living room with warm wooden furniture, plants, and soft neutral seating"
            fetchPriority="high"
          />
          <span className="image-label">SPACES TO SLOW DOWN</span>
          <Link to="/shop?category=Sofas" className="hero-product">
            <span className="hero-product-icon">
              <ArrowRight size={22} />
            </span>
            <span>
              <small>Curated for your living room</small>
              <strong>The art of feeling at home</strong>
            </span>
          </Link>
          <span className="hero-image-index">THE LIVING EDIT</span>
        </div>
      </section>
      <div className="service-strip container">
        <span>
          <Truck />
          <span>
            <b>A lovely delivery</b>
            <small>Free standard delivery over ₹15,000</small>
          </span>
        </span>
        <span>
          <RotateCcw />
          <span>
            <b>Room to change your mind</b>
            <small>30-day returns on our demo store</small>
          </span>
        </span>
        <span>
          <ShieldCheck />
          <span>
            <b>Made to be lived in</b>
            <small>Thoughtful materials. Lasting quality.</small>
          </span>
        </span>
      </div>
      <section className="collection container" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR SPACE, YOUR WAY</p>
            <h2>
              Find your next favourite<span>.</span>
            </h2>
          </div>
          <Link className="text-link" to="/shop">
            Shop all furniture <ArrowRight size={17} />
          </Link>
        </div>
        <CategoryTabs value={category} onChange={setCategory} />
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="collection-bottom">
          <span>Good design, down to the last detail.</span>
          <Link
            className="button secondary"
            to={category === "All" ? "/shop" : "/shop?category=" + category}
          >
            Discover more pieces <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="editorial container">
        <div className="editorial-image">
          <img
            src="/images/living.jpg"
            alt="A calm neutral living room with sculptural seating and natural textures"
            loading="lazy"
          />
          <span>THE SLOW LIVING EDIT</span>
        </div>
        <div className="editorial-copy">
          <Leaf size={29} strokeWidth={1.4} />
          <p className="eyebrow">LESS, BUT LOVELIER</p>
          <h2>
            Make room
            <br />
            for the everyday.
          </h2>
          <p>
            The quiet coffee. The long conversation. The Sunday that goes
            nowhere. We believe the best rooms are the ones that make you feel
            something.
          </p>
          <Link className="button light" to="/about">
            A little about us <ArrowRight size={17} />
          </Link>
          <div className="editorial-foot">
            Thoughtfully chosen. Endlessly enjoyed.
          </div>
        </div>
      </section>
      <section className="room-section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A FRESH PERSPECTIVE</p>
            <h2>Every room has a story.</h2>
          </div>
          <span className="room-heading-note">
            Let’s make yours a good one.
          </span>
        </div>
        <div className="room-grid">
          {[
            {
              name: "The living room",
              tag: "For your favourite kind of downtime",
              image: "hero",
              category: "Sofas",
            },
            {
              name: "A restful bedroom",
              tag: "A softer end to every day",
              image: "bedroom",
              category: "Beds",
            },
            {
              name: "The finishing touches",
              tag: "Little details, a lovely difference",
              image: "sofa-caramel",
              category: "Decor",
            },
          ].map((r) => (
            <Link
              to={"/shop?category=" + r.category}
              className="room-card"
              key={r.name}
            >
              <img
                src={"/images/" + r.image + ".jpg"}
                alt={r.name}
                loading="lazy"
              />
              <div>
                <span>
                  <h3>{r.name}</h3>
                  <p>{r.tag}</p>
                </span>
                <MoveUpRight size={24} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="closing-banner container">
        <div className="closing-symbol">
          <Armchair size={38} strokeWidth={1.3} />
        </div>
        <div>
          <p className="eyebrow">THAT FEELS LIKE YOU</p>
          <h2>A little inspiration. A lot of possibility.</h2>
          <p>
            Keep your favourite finds together, until the room feels just right.
          </p>
        </div>
        <Link className="text-link" to="/wishlist">
          Make your wishlist <ArrowRight size={19} />
        </Link>
      </section>
    </div>
  );
}
