import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/client.js";
import { useAuth } from "./AuthContext.jsx";

const CART_LS_KEY = "roco_cart_local";

const CartContext = createContext({
  cart: null,
  loading: false,
  add: async () => {},
  update: async () => {},
  remove: async () => {},
  clear: async () => {},
  refresh: async () => {},
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => readLocal());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(readLocal());
      return;
    }
    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data);
      // Si había carrito local, lo descartamos al iniciar sesión (el backend
      // es la fuente de verdad). En un flujo real, aquí se haría merge.
      localStorage.removeItem(CART_LS_KEY);
    } catch (err) {
      // Si falla por red, mantenemos lo que tengamos
      console.warn("cart refresh failed", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (variantId, quantity = 1) => {
      if (!user) {
        // Carrito local anónimo (best-effort, no persistente en backend)
        const local = readLocal() ?? emptyCart();
        const idx = local.items.findIndex(
          (i) => i.variant.id === variantId,
        );
        if (idx >= 0) {
          local.items[idx].quantity = Math.min(
            100,
            local.items[idx].quantity + quantity,
          );
          local.items[idx].lineTotalCents =
            local.items[idx].unitPriceCents * local.items[idx].quantity;
        } else {
          // Carga info de la variante desde el catálogo (cacheado en memoria)
          // Para mantenerlo simple, sólo añadimos un placeholder; el usuario
          // deberá iniciar sesión para confirmar el carrito con precios reales.
          local.items.push({
            id: `local-${Date.now()}`,
            quantity,
            lineTotalCents: 0,
            variant: { id: variantId, size: "", color: "", sku: "" },
            product: { id: "", slug: "", name: "", gradient: { c1: "#000", c2: "#fff" } },
            unitPriceCents: 0,
          });
        }
        recomputeTotal(local);
        writeLocal(local);
        setCart(local);
        return local;
      }
      const data = await api.addToCart(variantId, quantity);
      setCart(data);
      return data;
    },
    [user],
  );

  const update = useCallback(
    async (itemId, quantity) => {
      if (!user) {
        const local = readLocal() ?? emptyCart();
        const it = local.items.find((i) => i.id === itemId);
        if (it) {
          it.quantity = quantity;
          it.lineTotalCents = it.unitPriceCents * quantity;
          recomputeTotal(local);
          writeLocal(local);
          setCart(local);
        }
        return local;
      }
      const data = await api.updateCartItem(itemId, quantity);
      setCart(data);
      return data;
    },
    [user],
  );

  const remove = useCallback(
    async (itemId) => {
      if (!user) {
        const local = readLocal() ?? emptyCart();
        local.items = local.items.filter((i) => i.id !== itemId);
        recomputeTotal(local);
        writeLocal(local);
        setCart(local);
        return local;
      }
      const data = await api.removeCartItem(itemId);
      setCart(data);
      return data;
    },
    [user],
  );

  const clear = useCallback(async () => {
    if (!user) {
      writeLocal(emptyCart());
      setCart(emptyCart());
      return emptyCart();
    }
    const data = await api.clearCart();
    setCart(data);
    return data;
  }, [user]);

  const value = useMemo(
    () => ({ cart, loading, add, update, remove, clear, refresh }),
    [cart, loading, add, update, remove, clear, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

function emptyCart() {
  return { id: null, items: [], totalCents: 0, itemCount: 0 };
}

function readLocal() {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(cart) {
  try {
    localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

function recomputeTotal(cart) {
  cart.totalCents = cart.items.reduce((s, it) => s + it.lineTotalCents, 0);
  cart.itemCount = cart.items.reduce((s, it) => s + it.quantity, 0);
}
