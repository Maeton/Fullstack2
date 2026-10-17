import { useState } from "react";

const MAX_CANTIDAD = 5;
const CLAVE_CARRITO = "huerto_cart";

export default function ProductoCard({ producto }) {
  const [mensaje, setMensaje] = useState("");

  function agregarAlCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
      const carrito = Array.isArray(datos) ? datos : [];

      const existente = carrito.find((item) => item.id === producto.id);
      const cantidadActual = existente?.quantity ?? 0;
      const limite = Math.min(MAX_CANTIDAD, producto.stock);

      if (cantidadActual >= limite) {
        setMensaje(
          limite === MAX_CANTIDAD
            ? "Puedes agregar un máximo de 5 kilos por producto."
            : "No hay más cantidad disponible de este producto."
        );
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

      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(actualizado));
      setMensaje("Se agregó 1 kilo al carrito.");
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
          {" / kilo"}
        </p>

        <button
          type="button"
          className="btn btn-huerto"
          disabled={producto.stock <= 0}
          onClick={agregarAlCarrito}
          aria-label={`Agregar un kilo de ${producto.nombre} al carrito`}
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