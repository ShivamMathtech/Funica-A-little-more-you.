import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Leaf, MoveUpRight, Heart, Armchair } from "lucide-react";
import { Breadcrumb } from "./components";
export function About() {
  return (
    <div className="container page">
      <Breadcrumb current="The Funica story" />
      <div className="about-intro">
        <p className="eyebrow">A LITTLE MORE THOUGHTFUL</p>
        <h1>
          Good design is a feeling.
          <br />
          <i>We call it home.</i>
        </h1>
        <p>Not a perfect room. A room that’s perfectly you.</p>
      </div>
      <div className="about-image">
        <img
          src="/images/living.jpg"
          alt="An airy, considered room filled with natural light and comfortable seating"
        />
        <span>SPACE FOR LIFE TO HAPPEN.</span>
      </div>
      <section className="about-story">
        <p className="eyebrow">THE IDEA BEHIND FUNICA</p>
        <div>
          <h2>For the way you really live.</h2>
          <p>
            Home is the familiar corner, the mismatched mug, the chair everyone
            wants to sit in. It’s where the everyday becomes something worth
            keeping.
          </p>
          <p>
            Funica is a furniture storefront concept inspired by a simpler way
            of living: considered shapes, honest textures, and pieces that earn
            their place. From your first flat to your favourite reading nook,
            there’s room for something lovely.
          </p>
          <Link className="text-link" to="/shop">
            Find your next favourite <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <div className="values-grid">
        {[
          {
            icon: Armchair,
            title: "Thoughtful by design",
            text: "Useful shapes, gentle curves, and details that make everyday living feel a little better.",
          },
          {
            icon: Leaf,
            title: "A natural kind of lovely",
            text: "Warm woods and quiet colours inspired by the spaces we love spending time in.",
          },
          {
            icon: Heart,
            title: "Made for your story",
            text: "A collection to mix, make your own, and grow with — one favourite at a time.",
          },
        ].map((v) => (
          <article key={v.title}>
            <v.icon size={31} strokeWidth={1.4} />
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </article>
        ))}
      </div>
      <p className="about-demo">
        Funica is an interactive demo storefront. Products, prices, policies,
        ratings, and availability are illustrative. No commercial operation is
        represented.
      </p>
    </div>
  );
}
export function Help() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash)
      setTimeout(
        () =>
          document
            .getElementById(location.hash.slice(1))
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
  }, [location.hash]);
  return (
    <div className="container page help-page">
      <Breadcrumb current="Here to help" />
      <div className="page-heading">
        <p className="eyebrow">A LITTLE GUIDANCE</p>
        <h1>Make yourself comfortable.</h1>
        <p>Everything you need to know about this Funica demo.</p>
      </div>
      <div className="help-grid">
        <section>
          <h2>Good questions. Simple answers.</h2>
          {[
            {
              q: "Can I buy real furniture here?",
              a: "This is a fully interactive frontend demo. You can explore products, build a wishlist, add items to your bag, and complete a simulated checkout. No real purchase is made, no money is charged, and no physical items are shipped.",
            },
            {
              q: "Will my bag and wishlist stay here?",
              a: "Yes. Your cart, wishlist, profile, delivery address, and demo order history are saved in this browser’s local storage. They are not synced across devices. Clearing browser data removes them.",
            },
            {
              q: "How do the promo codes work?",
              a: "Enter WELCOME10 for 10% off or ROOM15 for 15% off your demo subtotal. One code can be used at a time. Standard delivery is free on subtotals of ₹15,000 or above, otherwise ₹499; express demo delivery costs ₹999.",
            },
            {
              q: "How can I track a demo order?",
              a: "Open Your orders and select View order. Use Advance demo status to simulate preparation, dispatch, and delivery. There is no real carrier integration. Confirmed or preparing demo orders can be cancelled.",
            },
            {
              q: "Can I download an order receipt?",
              a: "Yes. Open an order and choose Download receipt. You’ll receive a plain-text demo receipt with the item list, delivery details, and order totals.",
            },
            {
              q: "Are the product photos exact catalogue images?",
              a: "The bundled photos are illustrative imagery from Unsplash. Product names, prices, finishes, specifications, and reviews are sample data. Alternative finishes do not change the original product photograph.",
            },
          ].map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span>+</span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
        <aside className="help-aside">
          <Armchair size={35} strokeWidth={1.4} />
          <h3>Find your way home.</h3>
          <p>All the little things you might be looking for.</p>
          <Link to="/orders">
            Your order history <ArrowRight size={17} />
          </Link>
          <Link to="/account">
            Profile & address <ArrowRight size={17} />
          </Link>
          <Link to="/shop">
            Explore the collection <ArrowRight size={17} />
          </Link>
        </aside>
      </div>
      <section className="policy-section" id="delivery">
        <h2>Delivery & returns</h2>
        <p>
          The interface demonstrates standard delivery (5–7 business days),
          express delivery (2–3 business days), and a 30-day return policy.
          These are sample shopping policies for demonstration, not actual
          fulfilment commitments. No products are dispatched from this project.
        </p>
      </section>
      <section className="policy-section" id="privacy">
        <h2>Privacy & demo information</h2>
        <p>
          Your shopping data is stored locally under the browser key{" "}
          <code>funica-demo-v1</code>. The app has no account server, analytics
          trackers, payment gateway, or email service. Use sample profile and
          address details. Do not enter sensitive personal or payment
          information. Clear this site’s browser storage to remove saved
          shopping data.
        </p>
        <p>
          All photos and fonts are bundled with the project. Product details and
          ratings are illustrative. For real commerce, connect authenticated
          server-side accounts, inventory, pricing, payment verification, and
          order management before accepting customers.
        </p>
      </section>
    </div>
  );
}
