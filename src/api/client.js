// Cliente API — usa VITE_API_BASE (vacío = mismo origen en prod).
// En dev, Vite proxy reenvía /api → backend local.

const BASE = import.meta.env.VITE_API_BASE ?? "";

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(path, options = {}) {
  const init = {
    method: options.method || "GET",
    credentials: "include", // cookies httpOnly
    headers: {
      Accept: "application/json",
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };
  const res = await fetch(`${BASE}${path}`, init);
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    if (res.status === 401 && onUnauthorized) onUnauthorized();
    const err = new Error(data?.error?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.code = data?.error?.code;
    throw err;
  }
  return data;
}

export const api = {
  // --- Auth ---
  register: (payload) =>
    request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
  forgotPassword: (email) =>
    request("/api/auth/forgot", { method: "POST", body: { email } }),
  resetPassword: (token, password) =>
    request("/api/auth/reset", { method: "POST", body: { token, password } }),
  verifyEmail: (token) => request(`/api/auth/verify-email?token=${token}`),

  // --- Products ---
  listProducts: () => request("/api/products"),
  getProduct: (slug) => request(`/api/products/${slug}`),

  // --- Cart ---
  getCart: () => request("/api/cart"),
  addToCart: (variantId, quantity) =>
    request("/api/cart/items", { method: "POST", body: { variantId, quantity } }),
  updateCartItem: (id, quantity) =>
    request(`/api/cart/items/${id}`, { method: "PATCH", body: { quantity } }),
  removeCartItem: (id) =>
    request(`/api/cart/items/${id}`, { method: "DELETE" }),
  clearCart: () => request("/api/cart", { method: "DELETE" }),

  // --- Orders ---
  createOrder: (payload) =>
    request("/api/orders", { method: "POST", body: payload }),
  listOrders: () => request("/api/orders"),
  getOrder: (id) => request(`/api/orders/${id}`),
};
