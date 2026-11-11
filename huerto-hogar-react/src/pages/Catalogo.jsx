import ProductoCard from "../components/ProductoCard.jsx";
import { useProductos } from "../hooks/useProductos.js";

export default function Catalogo() {
  const { productos, cargando, error } = useProductos();

  if (cargando) {
    return (
      <main className="container huerto-main">
        <p role="status">Cargando catálogo…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container huerto-main">
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Catálogo de frutas</h2>

        {productos.length === 0 ? (
          <p>No hay productos disponibles por ahora.</p>
        ) : (
          <div className="row g-4">
            {productos.map((producto) => (
              <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
