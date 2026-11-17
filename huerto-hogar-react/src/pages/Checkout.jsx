import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, leerError } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { guardarCarrito, leerCarrito } from "../utils/carrito";
import { desglosarIva, formatoPrecio } from "../utils/dinero";

export default function Checkout() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [carrito] = useState(leerCarrito);
  const [datos, setDatos] = useState({
    nombre: usuario?.nombre ?? "",
    telefono: usuario?.telefono ?? "",
    direccion: usuario?.direccion ?? "",
  });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const total = carrito.reduce(
    (suma, producto) => suma + producto.price * producto.quantity,
    0
  );
  const { neto, iva } = desglosarIva(total);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
  }

  async function confirmarCompra(evento) {
    evento.preventDefault();
    setError("");

    if (carrito.length === 0 || enviando) return;

    const nombre = datos.nombre.trim();
    const telefono = datos.telefono.trim();
    const direccion = datos.direccion.trim();

    if (nombre.length < 3) {
      setError("Ingresa el nombre de quien recibe (mínimo 3 caracteres).");
      return;
    }

    if (direccion.length < 5) {
      setError("Ingresa una dirección de entrega válida (mínimo 5 caracteres).");
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await apiFetch("/api/pedidos", {
        method: "POST",
        body: JSON.stringify({
          items: carrito.map((producto) => ({
            productoId: producto.id,
            cantidad: producto.quantity,
          })),
          direccionEntrega: direccion,
          nombreContacto: nombre,
          telefonoContacto: telefono || null,
        }),
      });

      if (!respuesta.ok) {
        throw new Error(
          await leerError(respuesta, "No se pudo realizar el pago")
        );
      }

      const pedido = await respuesta.json();

      try {
        guardarCarrito([]);
      } catch {
        // El pedido ya fue creado; solo limpiamos el carrito local.
      }

      navigate("/compra-exitosa", { replace: true, state: { pedido } });
    } catch (e) {
      navigate("/compra-fallida", {
        state: { mensaje: e.message || "No se pudo realizar el pago" },
      });
    } finally {
      setEnviando(false);
    }
  }

  if (carrito.length === 0) {
    return (
      <main className="container huerto-main">
        <section className="huerto-section">
          <h2>Checkout</h2>
          <p>Tu carrito está vacío, no hay nada que pagar.</p>
          <Link to="/catalogo" className="btn btn-huerto">
            Ir al catálogo
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Checkout</h2>
        <p className="text-muted">
          Revisa tu pedido y completa los datos de entrega.
        </p>

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <form className="huerto-panel" onSubmit={confirmarCompra} noValidate>
              <h3 className="h5 mb-3">Datos de entrega</h3>

              {error && (
                <p className="alert alert-danger" role="alert">
                  {error}
                </p>
              )}

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="checkout-nombre" className="form-label">
                    Nombre de quien recibe
                  </label>
                  <input
                    id="checkout-nombre"
                    name="nombre"
                    className="form-control"
                    value={datos.nombre}
                    onChange={cambiarCampo}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="checkout-telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    id="checkout-telefono"
                    name="telefono"
                    type="tel"
                    className="form-control"
                    placeholder="+56912345678"
                    value={datos.telefono}
                    onChange={cambiarCampo}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="checkout-direccion" className="form-label">
                    Dirección de entrega
                  </label>
                  <input
                    id="checkout-direccion"
                    name="direccion"
                    className="form-control"
                    value={datos.direccion}
                    onChange={cambiarCampo}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="checkout-email" className="form-label">
                    Correo de contacto
                  </label>
                  <input
                    id="checkout-email"
                    className="form-control"
                    value={usuario?.email ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <p className="text-muted small mt-3 mb-0">
                Al confirmar se registra el pedido. El pago es simulado para
                esta entrega.
              </p>

              <button
                type="submit"
                className="btn btn-huerto mt-3"
                disabled={enviando}
              >
                {enviando ? "Procesando pago…" : "Confirmar compra"}
              </button>
            </form>
          </div>

          <div className="col-12 col-lg-5">
            <div className="huerto-panel">
              <h3 className="h5 mb-3">Resumen del pedido</h3>

              <ul className="list-group list-group-flush">
                {carrito.map((producto) => (
                  <li
                    className="list-group-item d-flex justify-content-between px-0"
                    key={producto.id}
                  >
                    <span>
                      {producto.name} × {producto.quantity} kg
                    </span>
                    <span>
                      {formatoPrecio(producto.price * producto.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="d-flex justify-content-between mb-1 mt-3">
                <span>Neto</span>
                <span>{formatoPrecio(neto)}</span>
              </p>
              <p className="d-flex justify-content-between mb-1">
                <span>IVA 19% incluido</span>
                <span>{formatoPrecio(iva)}</span>
              </p>
              <p className="d-flex justify-content-between fw-bold mb-0">
                <span>Total</span>
                <span>{formatoPrecio(total)}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
