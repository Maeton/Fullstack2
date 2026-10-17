import { useEffect, useState } from "react";

const CLAVE_CARRITO = "huerto_cart";

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

    if (!Array.isArray(datos)) return [];

    return datos.filter(
      (producto) =>
        typeof producto.id === "string" &&
        typeof producto.name === "string" &&
        Number.isFinite(producto.price) &&
        producto.price >= 0 &&
        Number.isInteger(producto.quantity) &&
        producto.quantity > 0
    );
  } catch {
    return [];
  }
}

function formatoPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

export default function Carrito() {
  const [carrito, setCarrito] = useState(leerCarrito);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
      setError("");
    } catch {
      setError("No se pudo guardar el carrito en este navegador.");
    }
  }, [carrito]);

  const total = carrito.reduce(
    (suma, producto) => suma + producto.price * producto.quantity,
    0
  );

  function eliminarProducto(id) {
    setMensaje("");
    setCarrito((actual) => actual.filter((producto) => producto.id !== id));
  }

  function finalizarCompra() {
    if (carrito.length === 0) return;

    setCarrito([]);
    setMensaje("Compra de demostración finalizada. Gracias por tu pedido.");
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
            {mensaje}
          </p>
        )}

        <div className="row g-4">
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            carrito.map((producto) => (
              <div className="col-12 col-md-6" key={producto.id}>
                <article className="huerto-panel h-100">
                  <h3>{producto.name}</h3>

                  <p>Precio: {formatoPrecio(producto.price)}</p>
                  <p>Cantidad: {producto.quantity}</p>

                  <p className="fw-bold">
                    Subtotal:{" "}
                    {formatoPrecio(producto.price * producto.quantity)}
                  </p>

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    aria-label={`Eliminar ${producto.name} del carrito`}
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </article>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="huerto-section">
        <h3 aria-live="polite">Total: {formatoPrecio(total)}</h3>

        <div>
          <button
            type="button"
            className="btn btn-huerto"
            disabled={carrito.length === 0}
            onClick={finalizarCompra}
          >
            Finalizar compra de demostración
          </button>
        </div>
      </section>
    </main>
  );
}