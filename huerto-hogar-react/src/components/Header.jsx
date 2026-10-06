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
            <li><a href="index.html" className="nav-link">Inicio</a></li>
            <li><a href="nosotros.html" className="nav-link">Nosotros</a></li>
            <li><a href="carrito.html" className="nav-link">Carrito</a></li>
            <li><a href="registro.html" className="nav-link">Registro</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}