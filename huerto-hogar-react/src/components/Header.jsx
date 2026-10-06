import logoHuerto from "../assets/img/logo-huerto.jpg";

export default function Header() {
  return (
    <header>
      <h1>Huerto Hogar</h1>
      <img src={logoHuerto} alt="Logo de Huerto Hogar" width="120" />
              <h2>Bienvenidos a Nuestro Huerto</h2>
              <nav>
                  <ul>
                      <li><a href="index.html">Inicio</a></li>
                      <li><a href="nosotros.html">Nosotros</a></li>
                      <li><a href="registro.html">Registro</a></li>
                      <li><a href="carrito.html">Carrito</a></li>
                  </ul>
              </nav>
    </header>
  );
}