import { Link, useLocation } from "react-router-dom";

export default function CompraFallida() {
  const { state } = useLocation();

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <div className="huerto-panel">
          <p className="alert alert-danger" role="alert">
            No se pudo realizar el pago.
          </p>

          <h2>Compra fallida</h2>
          <p className="text-muted">
            {state?.mensaje ??
              "Ocurrió un problema al procesar el pago. Tu carrito se mantiene intacto."}
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/checkout" className="btn btn-huerto">
              Intentar de nuevo
            </Link>
            <Link to="/carrito" className="btn btn-outline-secondary">
              Volver al carrito
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
