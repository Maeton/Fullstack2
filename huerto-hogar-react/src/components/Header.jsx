import { NavLink } from "react-router-dom";
import logoHuerto from "../assets/img/logo-huerto.jpg";

export default function Header() {
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
          <ul className="nav justify-content-center gap-1">
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

            <li className="nav-item">
              <NavLink to="/carrito" className="nav-link">
                Carrito
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/registro" className="nav-link">
                Registro
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}