import { Link } from "react-router-dom";
import videoHuerto from "../assets/vid/Huerto-Hogar-promocional.mp4";
import ProductoCard from "../components/ProductoCard.jsx";
import productos from "../data/productos.js";

const beneficios = [
  {
    titulo: "Productos frescos",
    descripcion:
      "Encuentra frutas y alimentos para acompañar tu alimentación diaria.",
  },
  {
    titulo: "Comercio local",
    descripcion:
      "Apoyamos el trabajo de los productores y el desarrollo de nuestra comunidad.",
  },
  {
    titulo: "Consumo responsable",
    descripcion:
      "Promovemos el cuidado del medioambiente y una relación cercana con el origen de los alimentos.",
  },
];

const pasos = [
  {
    titulo: "Elige tus productos",
    descripcion:
      "Explora el catálogo y agrega tus productos favoritos al carrito.",
  },
  {
    titulo: "Revisa tu carrito",
    descripcion:
      "Ajusta las cantidades y consulta el total antes de finalizar.",
  },
  {
    titulo: "Finaliza tu compra",
    descripcion:
      "Confirma los productos seleccionados desde tu carrito.",
  },
];

export default function Inicio() {
  const destacados = productos.slice(0, 3);

  return (
    <main className="container huerto-main huerto-inicio">
      <section
        className="huerto-section"
        aria-labelledby="titulo-bienvenida"
      >
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7">
            <h2 id="titulo-bienvenida">Del huerto a tu mesa</h2>

            <p className="huerto-descripcion">
              Bienvenido a Huerto Hogar. Acercamos productos frescos
              y orgánicos a tu hogar, promoviendo una alimentación
              saludable y el apoyo a los productores locales.
            </p>

            <p>
              Explora nuestro catálogo y encuentra los sabores que
              necesitas para tus comidas de cada día.
            </p>

            <Link to="/catalogo" className="btn btn-huerto">
              Ver catálogo
            </Link>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-center">
            <video
              src={videoHuerto}
              controls
              preload="metadata"
              className="huerto-video"
              aria-label="Video promocional de Huerto Hogar"
            >
              Tu navegador no puede reproducir este video.
            </video>
          </div>
        </div>
      </section>

      <section
        className="huerto-section"
        aria-labelledby="titulo-destacados"
      >
        <h2 id="titulo-destacados">Productos destacados</h2>

        <p className="huerto-descripcion">
          Descubre algunos de los productos de nuestro catálogo.
        </p>

        <div className="row g-4">
          {destacados.map((producto) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={producto.id}
            >
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/catalogo" className="btn btn-huerto">
            Ver todos los productos
          </Link>
        </div>
      </section>

      <section
        className="huerto-section"
        aria-labelledby="titulo-beneficios"
      >
        <h2 id="titulo-beneficios">¿Por qué elegir Huerto Hogar?</h2>

        <div className="row g-4">
          {beneficios.map((beneficio) => (
            <div
              className="col-12 col-md-4"
              key={beneficio.titulo}
            >
              <article className="huerto-panel h-100">
                <h3>{beneficio.titulo}</h3>
                <p className="mb-0">{beneficio.descripcion}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section
        className="huerto-section"
        aria-labelledby="titulo-comprar"
      >
        <h2 id="titulo-comprar">¿Cómo comprar?</h2>

        <ol className="row g-4 list-unstyled">
          {pasos.map((paso, indice) => (
            <li className="col-12 col-md-4" key={paso.titulo}>
              <article className="huerto-panel h-100">
                <h3>
                  {indice + 1}. {paso.titulo}
                </h3>
                <p className="mb-0">{paso.descripcion}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}