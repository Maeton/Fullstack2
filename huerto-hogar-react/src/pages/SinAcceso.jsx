import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SinAcceso() {
  const { usuario } = useAuth();

  return (
    <main className="container huerto-main">
      <section className="huerto-section huerto-panel">
        <h2>Sin acceso</h2>
        <p>
          Tu rol actual ({usuario?.rol ?? "invitado"}) no tiene permisos para
          entrar a esta sección.
        </p>
        <p className="mb-0">
          <Link to="/" className="btn btn-huerto">
            Volver al inicio
          </Link>
        </p>
      </section>
    </main>
  );
}
