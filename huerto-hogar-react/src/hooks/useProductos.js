import { useEffect, useState } from "react";
import { apiFetch, leerError } from "../api/client";

const IMAGENES = import.meta.glob("../assets/img/*.jpg", {
  eager: true,
  import: "default",
});

function imagenDe(producto) {
  return IMAGENES[`../assets/img/${producto.imagenUrl}`] ?? "";
}

/**
 * Carga el catálogo público desde el backend.
 * Devuelve los productos con la imagen local resuelta.
 */
export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    apiFetch("/api/productos")
      .then((respuesta) =>
        respuesta.ok
          ? respuesta.json()
          : leerError(respuesta).then((mensaje) =>
              Promise.reject(new Error(mensaje))
            )
      )
      .then((datos) => {
        if (!activo) return;
        setProductos(
          datos.map((producto) => ({
            ...producto,
            img: imagenDe(producto),
          }))
        );
      })
      .catch((e) => {
        if (activo) {
          setError(e.message || "No se pudo cargar el catálogo.");
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return { productos, cargando, error };
}
