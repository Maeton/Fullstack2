import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, leerError } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const CLAVE_CARRITO = "huerto_cart";
const MAX_CANTIDAD = 5;

function leerCarrito() {
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

function formatoPrecio(valor) {
  return Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

export default function Carrito() {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState(leerCarrito);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function persistir(nuevoCarrito) {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(nuevoCarrito));
      setError("");
    } catch {
      setError("No se pudo guardar el carrito en este navegador.");
    }
  }

  const total = carrito.reduce(
    (suma, producto) => suma + producto.price * producto.quantity,
    0
  );

  function cambiarCantidad(id, valor) {
    const cantidad = Number(valor);

    if (
      !Number.isInteger(cantidad) ||
      cantidad < 0 ||
      cantidad > MAX_CANTIDAD
    ) {
      return;
    }

    setMensaje("");

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

  async function finalizarCompra() {
    if (carrito.length === 0 || enviando) return;

    setError("");
    setMensaje("");
    setEnviando(true);

    try {
      const respuesta = await apiFetch("/api/pedidos", {
        method: "POST",
        body: JSON.stringify({
          items: carrito.map((producto) => ({
            productoId: producto.id,
            cantidad: producto.quantity,
          })),
          direccionEntrega: usuario?.direccion ?? "",
        }),
      });

      if (!respuesta.ok) {
        throw new Error(await leerError(respuesta, "No se pudo crear el pedido"));
      }

      const pedido = await respuesta.json();

      persistir([]);
      setCarrito([]);
      setMensaje(
        `Pedido #${pedido.id} creado por ${formatoPrecio(
          pedido.total
        )}. Revisa su estado en "Mis pedidos".`
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
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

        {mensaje && (
          <p className="alert alert-success" role="status">
            {mensaje}{" "}
            <Link to="/mis-pedidos" className="alert-link">
              Ver mis pedidos
            </Link>
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

        <p className="text-muted">
          El total definitivo lo calcula el servidor al confirmar el pedido.
        </p>

        <button
          type="button"
          className="btn btn-huerto"
          disabled={carrito.length === 0 || enviando}
          onClick={finalizarCompra}
        >
          {enviando ? "Creando pedido…" : "Finalizar compra"}
        </button>
      </section>
    </main>
  );
}
