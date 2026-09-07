// Currency formatter (cents → human readable EUR).
const EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function money(cents) {
  if (typeof cents !== "number" || Number.isNaN(cents)) return "—";
  return EUR.format(cents / 100);
}

export function dateShort(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function statusLabel(status) {
  const map = {
    pending: "Pendiente de pago",
    paid: "Pagado",
    processing: "En preparación",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
  };
  return map[status] ?? status;
}
