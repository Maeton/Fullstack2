const IMAGENES = import.meta.glob("../assets/img/*.jpg", {
  eager: true,
  import: "default",
});

export function imagenProducto(imagenUrl) {
  if (!imagenUrl) return "";
  return IMAGENES[`../assets/img/${imagenUrl}`] ?? "";
}
