import imagenHuerto from "../assets/img/huerto.jpg";
import imagenCalidad from "../assets/img/Calidad.jpg";
import imagenSostenibilidad from "../assets/img/Sostenibilidad.jpg";
import imagenComercio from "../assets/img/ComercioLocal.jpg";

const valores = [
  {
    titulo: "Calidad",
    descripcion:
      "Buscamos ofrecer productos frescos, seleccionados con dedicación para acompañar una alimentación saludable.",
    imagen: imagenCalidad,
    alt: "Calidad de los productos de Huerto Hogar",
  },
  {
    titulo: "Sostenibilidad",
    descripcion:
      "Promovemos prácticas responsables con el medioambiente y el cuidado de los recursos naturales.",
    imagen: imagenSostenibilidad,
    alt: "Cultivo y cuidado del medioambiente",
  },
  {
    titulo: "Comercio local",
    descripcion:
      "Valoramos el trabajo de los productores locales y buscamos acercar sus productos a nuestros clientes.",
    imagen: imagenComercio,
    alt: "Apoyo a los productores locales",
  },
];

export default function Nosotros() {
  return (
    <main className="container huerto-main">
      <section
        className="huerto-section"
        aria-labelledby="titulo-nosotros"
      >
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7">
            <h2 id="titulo-nosotros">Sobre Nosotros</h2>

            <p className="huerto-descripcion">
              Somos Huerto Hogar, un emprendimiento dedicado a la
              producción y distribución de alimentos orgánicos en la
              zona central de Chile. Nuestro proyecto nace en Paine
              con el propósito de acercar productos frescos del huerto
              a tu mesa.
            </p>

            <p>
              Buscamos facilitar el acceso a una alimentación saludable,
              promoviendo el consumo responsable y el vínculo con
              productores locales.
            </p>
          </div>

          <div className="col-12 col-md-5 text-center">
            <img
              src={imagenHuerto}
              alt="Huerto con cultivos"
              className="img-fluid rounded"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section
        className="huerto-section"
        aria-labelledby="titulo-proposito"
      >
        <h2 id="titulo-proposito">Nuestro propósito</h2>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <article className="huerto-panel h-100">
              <h3>Misión</h3>
              <p className="mb-0">
                Acercar alimentos frescos y orgánicos a los hogares,
                ofreciendo una experiencia de compra sencilla y
                apoyando el desarrollo de los productores locales.
              </p>
            </article>
          </div>

          <div className="col-12 col-md-6">
            <article className="huerto-panel h-100">
              <h3>Visión</h3>
              <p className="mb-0">
                Ser una alternativa cercana y confiable para quienes
                buscan una alimentación saludable y un consumo más
                responsable con su comunidad y el medioambiente.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="huerto-section"
        aria-labelledby="titulo-valores"
      >
        <h2 id="titulo-valores">Nuestros valores</h2>

        <div className="row g-4">
          {valores.map((valor) => (
            <div
              className="col-12 col-md-4"
              key={valor.titulo}
            >
              <article className="huerto-panel h-100">
                <img
                  src={valor.imagen}
                  alt={valor.alt}
                  className="img-fluid rounded mb-3"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <h3>{valor.titulo}</h3>
                <p className="mb-0">{valor.descripcion}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section
        className="huerto-section"
        aria-labelledby="titulo-ubicacion"
      >
        <h2 id="titulo-ubicacion">Ubicación y contacto</h2>

        <p>
          Estamos ubicados en Paine, Región Metropolitana, Chile.
          Contáctanos para consultar la disponibilidad de despacho
          a tu domicilio.
        </p>

        <address>
          <p>
            Correo:{" "}
            <a href="mailto:contacto@huertoHogar.cl">
              contacto@huertoHogar.cl
            </a>
          </p>

          <p>
            Teléfono:{" "}
            <a href="tel:+56967676767">
              +56 9 6767 6767
            </a>
          </p>
        </address>

        <iframe
          title="Mapa de referencia de la zona de Paine"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-70.85%2C-33.87%2C-70.65%2C-33.75&layer=mapnik"
          width="100%"
          height="350"
          className="rounded border"
          loading="lazy"
        />

        <p className="small text-secondary mt-2">
          El mapa muestra la zona de referencia; no indica un punto
          exacto de atención.
        </p>
      </section>
    </main>
  );
}