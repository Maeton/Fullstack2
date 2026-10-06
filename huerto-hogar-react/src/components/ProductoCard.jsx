export default function ProductoCard({ producto }) {
  return (
    <article className="card huerto-producto h-100">
      <img
        src={producto.img}
        alt={producto.nombre}
        className="card-img-top"
        loading="lazy"
      />

      <div className="card-body">
        <h3 className="card-title">{producto.nombre}</h3>

        <p className="card-text">{producto.descripcion}</p>

        <p className="huerto-precio">
          {producto.precio.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          })}
        </p>

        <p className="card-text">
          Disponibles: {producto.stock}
        </p>
      </div>
    </article>
  );
}