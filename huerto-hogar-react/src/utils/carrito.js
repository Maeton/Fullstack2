export const CLAVE_CARRITO = "huerto_cart";
export const MAX_CANTIDAD = 5;

export function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

    if (!Array.isArray(datos)) return [];

    return datos
      .filter(
        (producto) =>
          Number.isInteger(Number(producto.id)) &&
          typeof producto.name === "string" &&
          Number.isFinite(producto.price) &&
          producto.price >= 0 &&
          Number.isInteger(producto.quantity) &&
          producto.quantity > 0
      )
      .map((producto) => ({
        ...producto,
        id: Number(producto.id),
        quantity: Math.min(producto.quantity, MAX_CANTIDAD),
      }));
  } catch {
    return [];
  }
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}
