import { useState } from "react";

export default function ProductoCard({ producto }) {
  const [mensaje, setMensaje] = useState("");

  function agregarAlCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem("huerto_cart"));
      const carrito = Array.isArray(datos) ? datos : [];

      const existente = carrito.find((item) => item.id === producto.id);
      const cantidadActual = existente?.quantity ?? 0;

      if (cantidadActual >= producto.stock) {
        setMensaje("No hay más unidades disponibles.");
        return;
      }

      const actualizado = existente
        ? carrito.map((item) =>
            item.id === producto.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...carrito,
            {
              id: producto.id,
              name: producto.nombre,
              price: producto.precio,
              img: producto.img,
              quantity: 1,
            },
          ];

      localStorage.setItem("huerto_cart", JSON.stringify(actualizado));
      setMensaje("Producto agregado al carrito.");
    } catch {
      setMensaje("No se pudo actualizar el carrito.");
    }
  }

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

        <button
          type="button"
          className="btn btn-huerto"
          disabled={producto.stock <= 0}
          onClick={agregarAlCarrito}
          aria-label={`Agregar ${producto.nombre} al carrito`}
        >
          {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </button>

        <p className="small mt-2 mb-0" role="status">
          {mensaje}
        </p>
      </div>
    </article>
  );
}