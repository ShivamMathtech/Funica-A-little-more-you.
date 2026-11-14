import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { products, findProduct } from "./data";
import {
  addLine,
  normalizeQuantity,
  quote,
  sanitizeCart,
  validateAddress,
} from "./commerce.mjs";
export type CartLine = {
  key: string;
  productId: string;
  color: string;
  quantity: number;
};
export type Address = {
  name: string;
  email: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  pin: string;
};
export type Order = {
  id: string;
  date: string;
  lines: (CartLine & { name: string; price: number; image: string })[];
  address: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  delivery: string;
  payment: string;
};
export const blankAddress: Address = {
  name: "",
  email: "",
  phone: "",
  line: "",
  city: "",
  state: "",
  pin: "",
};
type StoredState = {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  profile: { name: string; email: string };
  address: Address;
  promo: string;
};
const defaults: StoredState = {
  cart: [],
  wishlist: [],
  orders: [],
  profile: { name: "", email: "" },
  address: blankAddress,
  promo: "",
};
const STORAGE_KEY = "funica-demo-v1";
function initialState(): StoredState {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!s || typeof s !== "object") return defaults;
    return {
      cart: sanitizeCart(s.cart, products),
      wishlist: Array.isArray(s.wishlist)
        ? s.wishlist.filter(
            (id: unknown) => typeof id === "string" && findProduct(id),
          )
        : [],
      orders: Array.isArray(s.orders)
        ? s.orders.filter(
            (o: Order) =>
              o &&
              typeof o.id === "string" &&
              Array.isArray(o.lines) &&
              o.address &&
              Number.isFinite(o.total),
          )
        : [],
      profile: {
        name: typeof s.profile?.name === "string" ? s.profile.name : "",
        email: typeof s.profile?.email === "string" ? s.profile.email : "",
      },
      address: Object.fromEntries(
        Object.keys(blankAddress).map((k) => [
          k,
          typeof s.address?.[k] === "string" ? s.address[k] : "",
        ]),
      ) as Address,
      promo: ["WELCOME10", "ROOM15"].includes(s.promo) ? s.promo : "",
    };
  } catch {
    return defaults;
  }
}
function useStoreState() {
  const [state, setState] = useState<StoredState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    try {
      const serialized = JSON.stringify(state);
      if (localStorage.getItem(STORAGE_KEY) !== serialized)
        localStorage.setItem(STORAGE_KEY, serialized);
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [state]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next = initialState();
        stateRef.current = next;
        setState(next);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);
  function addToCart(id: string, color: string, quantity = 1) {
    if (!findProduct(id)) return;
    setState((s) => ({ ...s, cart: addLine(s.cart, id, color, quantity) }));
    setToast("Added to your bag");
  }
  function toggleWishlist(id: string) {
    setState((s) => ({
      ...s,
      wishlist: s.wishlist.includes(id)
        ? s.wishlist.filter((x) => x !== id)
        : [...s.wishlist, id],
    }));
  }
  function quantity(key: string, n: number) {
    setState((s) => ({
      ...s,
      cart: s.cart.map((l) =>
        l.key === key ? { ...l, quantity: normalizeQuantity(n) } : l,
      ),
    }));
  }
  function removeLine(key: string) {
    setState((s) => ({ ...s, cart: s.cart.filter((l) => l.key !== key) }));
    setToast("Item removed from your bag");
  }
  function setPromo(promo: string) {
    setState((s) => ({ ...s, promo }));
  }
  function saveProfile(profile: StoredState["profile"]) {
    setState((s) => ({ ...s, profile }));
    setToast("Profile saved on this device");
  }
  function saveAddress(address: Address) {
    setState((s) => ({ ...s, address }));
    setToast("Delivery address saved");
  }
  function placeOrder(
    address: Address,
    delivery: string,
    payment: string,
  ): string {
    const current = stateRef.current;
    if (!current.cart.length) throw new Error("Your bag is empty.");
    const error = validateAddress(address);
    if (error) throw new Error(error);
    const totals = quote(current.cart, products, current.promo, delivery);
    const order: Order = {
      id: "FN-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      date: new Date().toISOString(),
      lines: current.cart.map((l) => {
        const p = findProduct(l.productId)!;
        return { ...l, name: p.name, price: p.price, image: p.image };
      }),
      address,
      delivery,
      payment,
      ...totals,
      status: "Confirmed",
    };
    const next = {
      ...current,
      cart: [],
      promo: "",
      address,
      orders: [order, ...current.orders],
    };
    stateRef.current = next;
    setState(next);
    return order.id;
  }
  function updateOrder(id: string, status: string) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
    setToast(
      status === "Cancelled"
        ? "Demo order cancelled"
        : "Demo order status updated",
    );
  }
  return {
    ...state,
    toast,
    storageWarning,
    setToast,
    addToCart,
    toggleWishlist,
    quantity,
    removeLine,
    setPromo,
    saveProfile,
    saveAddress,
    placeOrder,
    updateOrder,
    cartCount: state.cart.reduce((n, l) => n + l.quantity, 0),
  };
}
const Store = createContext<ReturnType<typeof useStoreState> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreState();
  return <Store.Provider value={store}>{children}</Store.Provider>;
}
export function useStore() {
  const store = useContext(Store);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}
