import { NavLink, useNavigate } from "react-router-dom";
import logoHuerto from "../assets/img/logo-huerto.jpg";
import { useAuth } from "../context/AuthContext.jsx";

const ETIQUETAS_ROL = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
};

export default function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  async function cerrarSesion() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="huerto-header">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <img
            src={logoHuerto}
            alt="Logo de Huerto Hogar"
            className="logo-sitio"
          />
          <h1>Huerto Hogar</h1>
        </div>

        <nav aria-label="Navegación principal">
          <ul className="nav justify-content-center align-items-center gap-1">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link">
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/catalogo" className="nav-link">
                Catálogo
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/nosotros" className="nav-link">
                Nosotros
              </NavLink>
            </li>

            {usuario?.rol === "CLIENTE" && (
              <>
                <li className="nav-item">
                  <NavLink to="/carrito" className="nav-link">
                    Carrito
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/mis-pedidos" className="nav-link">
                    Mis pedidos
                  </NavLink>
                </li>
              </>
            )}

            {(usuario?.rol === "VENDEDOR" || usuario?.rol === "ADMIN") && (
              <li className="nav-item">
                <NavLink to="/vendedor" className="nav-link">
                  Panel vendedor
                </NavLink>
              </li>
            )}

            {usuario?.rol === "ADMIN" && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">
                  Administración
                </NavLink>
              </li>
            )}

            {!usuario && (
              <li className="nav-item">
                <NavLink to="/registro" className="nav-link">
                  Registro
                </NavLink>
              </li>
            )}

            {usuario ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text small px-2">
                    {usuario.nombre} · {ETIQUETAS_ROL[usuario.rol] ?? usuario.rol}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={cerrarSesion}
                  >
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Ingresar
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
