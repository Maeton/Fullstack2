import productos from "../data/productos.js";
import ProductoCard from "../components/ProductoCard.jsx";

export default function Catalogo() {
  const frutas = productos.filter(
    (producto) => producto.categoria === "Frutas"
  );

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Catálogo de frutas</h2>

        <div className="row g-4">
          {frutas.map((producto) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={producto.id}
            >
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}