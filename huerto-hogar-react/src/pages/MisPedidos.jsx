import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, leerError } from "../api/client";

const CLASES_ESTADO = {
  PENDIENTE: "bg-warning text-dark",
  CONFIRMADO: "bg-info text-dark",
  ENTREGADO: "bg-success",
  CANCELADO: "bg-secondary",
};

function formatoPrecio(valor) {
  return Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

function formatoFecha(valor) {
  return new Date(valor).toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    apiFetch("/api/pedidos/mis-pedidos")
      .then((respuesta) =>
        respuesta.ok
          ? respuesta.json()
          : leerError(respuesta).then((mensaje) => Promise.reject(new Error(mensaje)))
      )
      .then((datos) => {
        if (activo) setPedidos(datos);
      })
      .catch((e) => {
        if (activo) setError(e.message || "No se pudo cargar el historial.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <main className="container huerto-main">
        <p role="status">Cargando pedidos…</p>
      </main>
    );
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Mis pedidos</h2>

        {error && (
          <p className="alert alert-danger" role="alert">
            {error}
          </p>
        )}

        {!error && pedidos.length === 0 && (
          <p>
            Todavía no tienes pedidos. <Link to="/catalogo">Ir al catálogo</Link>
          </p>
        )}

        <div className="d-flex flex-column gap-3">
          {pedidos.map((pedido) => (
            <article className="huerto-panel" key={pedido.id}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <h3 className="h5 mb-0">Pedido #{pedido.id}</h3>
                <span className={`badge ${CLASES_ESTADO[pedido.estado] ?? "bg-secondary"}`}>
                  {pedido.estado}
                </span>
              </div>

              <p className="mb-2 small text-muted">
                {formatoFecha(pedido.fecha)} · Entrega: {pedido.direccionEntrega}
              </p>

              <ul className="list-group list-group-flush mb-2">
                {pedido.items.map((item) => (
                  <li
                    className="list-group-item d-flex justify-content-between px-0"
                    key={`${pedido.id}-${item.productoId}`}
                  >
                    <span>
                      {item.nombre} × {item.cantidad} kg
                    </span>
                    <span>{formatoPrecio(item.subtotal)}</span>
                  </li>
                ))}
              </ul>

              <p className="fw-bold mb-0 text-end">
                Total: {formatoPrecio(pedido.total)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
