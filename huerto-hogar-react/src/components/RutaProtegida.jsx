import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RutaProtegida({ roles, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <main className="container huerto-main">
        <p role="status">Cargando sesión…</p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: location.pathname }}
      />
    );
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return children;
}
