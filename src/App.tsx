import { Component } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { StoreProvider } from "./store";
import { Layout } from "./components";
import Home from "./Home";
import Catalog, { Wishlist } from "./Catalog";
import Product from "./Product";
import { Cart, Checkout, OrderSuccess } from "./Checkout";
import Account, { Orders } from "./Account";
import { About, Help } from "./Information";
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty">
        <h1>Let’s take a fresh look.</h1>
        <p>Something didn’t load correctly. Reload the page to try again.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload Funica
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <StoreProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Catalog />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/account" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route
                path="*"
                element={
                  <div className="container empty">
                    <h1>This room is still empty.</h1>
                    <p>We couldn’t find that page.</p>
                    <Link className="button" to="/">
                      Back to home
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </StoreProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
