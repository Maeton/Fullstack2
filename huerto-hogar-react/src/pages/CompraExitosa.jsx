import { Link, useLocation } from "react-router-dom";
import { desglosarIva, formatoPrecio } from "../utils/dinero";

export default function CompraExitosa() {
  const { state } = useLocation();
  const pedido = state?.pedido;

  if (!pedido) {
    return (
      <main className="container huerto-main">
        <section className="huerto-section">
          <h2>Compra exitosa</h2>
          <p>No encontramos el detalle de la compra realizada.</p>
          <div className="d-flex gap-2">
            <Link to="/mis-pedidos" className="btn btn-huerto">
              Ver mis pedidos
            </Link>
            <Link to="/catalogo" className="btn btn-outline-secondary">
              Ir al catálogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { neto, iva } = desglosarIva(pedido.total);

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <div className="huerto-panel">
          <p className="alert alert-success" role="status">
            Pago simulado aprobado. Tu pedido quedó registrado.
          </p>

          <h2>¡Compra exitosa!</h2>
          <p className="text-muted">
            Pedido #{pedido.id} · Estado: {pedido.estado}
          </p>

          <p className="mb-1">
            <strong>Entrega:</strong> {pedido.direccionEntrega ?? "—"}
          </p>
          <p className="mb-3">
            <strong>Contacto:</strong>{" "}
            {pedido.nombreContacto ?? "—"}
            {pedido.telefonoContacto ? ` · ${pedido.telefonoContacto}` : ""}
          </p>

          <ul className="list-group list-group-flush mb-3">
            {pedido.items?.map((item) => (
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

          <p className="d-flex justify-content-between mb-1">
            <span>Neto</span>
            <span>{formatoPrecio(neto)}</span>
          </p>
          <p className="d-flex justify-content-between mb-1">
            <span>IVA 19% incluido</span>
            <span>{formatoPrecio(iva)}</span>
          </p>
          <p className="d-flex justify-content-between fw-bold mb-4">
            <span>Total pagado</span>
            <span>{formatoPrecio(pedido.total)}</span>
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/mis-pedidos" className="btn btn-huerto">
              Ver mis pedidos
            </Link>
            <Link to="/catalogo" className="btn btn-outline-secondary">
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
