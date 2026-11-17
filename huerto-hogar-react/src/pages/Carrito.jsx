import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guardarCarrito, leerCarrito, MAX_CANTIDAD } from "../utils/carrito";
import { desglosarIva, formatoPrecio } from "../utils/dinero";

export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState(leerCarrito);
  const [error, setError] = useState("");

  function persistir(nuevoCarrito) {
    try {
      guardarCarrito(nuevoCarrito);
      setError("");
    } catch {
      setError("No se pudo guardar el carrito en este navegador.");
    }
  }

  const total = carrito.reduce(
    (suma, producto) => suma + producto.price * producto.quantity,
    0
  );
  const { neto, iva } = desglosarIva(total);

  function cambiarCantidad(id, valor) {
    const cantidad = Number(valor);

    if (
      !Number.isInteger(cantidad) ||
      cantidad < 0 ||
      cantidad > MAX_CANTIDAD
    ) {
      return;
    }

    const actualizado = carrito
      .map((producto) =>
        producto.id === id
          ? { ...producto, quantity: cantidad }
          : producto
      )
      .filter((producto) => producto.quantity > 0);

    persistir(actualizado);
    setCarrito(actualizado);
  }

  function finalizarCompra() {
    if (carrito.length === 0) return;
    navigate("/checkout");
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Tu Carrito de Compras</h2>

        {error && (
          <p className="alert alert-warning" role="alert">
            {error}
          </p>
        )}

        <div className="row g-4">
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            carrito.map((producto) => (
              <div className="col-12 col-md-6" key={producto.id}>
                <article className="huerto-panel h-100">
                  {producto.img && (
                    <img
                      src={producto.img}
                      alt={producto.name}
                      className="img-fluid rounded mb-3"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <h3>{producto.name}</h3>

                  <p>Precio por kilo: {formatoPrecio(producto.price)}</p>

                  <div className="mb-3">
                    <label
                      htmlFor={`cantidad-${producto.id}`}
                      className="form-label"
                    >
                      Cantidad
                    </label>

                    <select
                      id={`cantidad-${producto.id}`}
                      className="form-select"
                      value={producto.quantity}
                      onChange={(evento) =>
                        cambiarCantidad(producto.id, evento.target.value)
                      }
                    >
                      <option value={0}>0 — Eliminar del carrito</option>

                      {[1, 2, 3, 4, 5].map((cantidad) => (
                        <option key={cantidad} value={cantidad}>
                          {cantidad === 1 ? "1 kilo" : `${cantidad} kilos`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="fw-bold">
                    Subtotal:{" "}
                    {formatoPrecio(producto.price * producto.quantity)}
                  </p>
                </article>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="huerto-section">
        <h3 aria-live="polite">Total: {formatoPrecio(total)}</h3>

        <p className="mb-1">Neto: {formatoPrecio(neto)}</p>
        <p className="mb-1">IVA 19% incluido: {formatoPrecio(iva)}</p>

        <p className="text-muted">
          Los precios incluyen IVA. El total definitivo lo calcula el servidor
          al confirmar el pedido.
        </p>

        <button
          type="button"
          className="btn btn-huerto"
          disabled={carrito.length === 0}
          onClick={finalizarCompra}
        >
          Finalizar compra
        </button>
      </section>
    </main>
  );
}
