import { useEffect, useState } from "react";
import { apiFetch, leerError } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const FORMULARIO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "Frutas",
  imagenUrl: "",
};

function formatoPrecio(valor) {
  return Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

export default function PanelVendedor() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarProductos() {
    const respuesta = await apiFetch("/api/productos", {}, false);

    if (!respuesta.ok) {
      throw new Error(await leerError(respuesta, "No se pudo cargar el catálogo"));
    }

    setProductos(await respuesta.json());
  }

  useEffect(() => {
    let activo = true;

    apiFetch("/api/productos", {}, false)
      .then((respuesta) =>
        respuesta.ok
          ? respuesta.json()
          : leerError(respuesta).then((mensaje) =>
              Promise.reject(new Error(mensaje))
            )
      )
      .then((datos) => {
        if (activo) setProductos(datos);
      })
      .catch((e) => {
        if (activo) setError(e.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  function puedeGestionar(producto) {
    return usuario?.rol === "ADMIN" || producto.vendedorId === usuario?.id;
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: String(producto.precio),
      stock: String(producto.stock),
      categoria: producto.categoria ?? "Frutas",
      imagenUrl: producto.imagenUrl ?? "",
    });
    setMensaje("");
    setError("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");

    const cuerpo = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim() || null,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      categoria: formulario.categoria.trim() || null,
      imagenUrl: formulario.imagenUrl.trim() || null,
    };

    if (!cuerpo.nombre || !Number.isFinite(cuerpo.precio) || !Number.isInteger(cuerpo.stock)) {
      setError("Completa nombre, precio y stock con valores válidos.");
      return;
    }

    try {
      const respuesta = await apiFetch(
        editandoId ? `/api/productos/${editandoId}` : "/api/productos",
        {
          method: editandoId ? "PUT" : "POST",
          body: JSON.stringify(cuerpo),
        }
      );

      if (!respuesta.ok) {
        throw new Error(await leerError(respuesta, "No se pudo guardar el producto"));
      }

      await cargarProductos();
      cancelarEdicion();
      setMensaje(editandoId ? "Producto actualizado." : "Producto creado.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(producto) {
    if (!window.confirm(`¿Desactivar "${producto.nombre}"?`)) return;

    setError("");
    setMensaje("");

    try {
      const respuesta = await apiFetch(`/api/productos/${producto.id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error(await leerError(respuesta, "No se pudo desactivar el producto"));
      }

      await cargarProductos();
      setMensaje("Producto desactivado.");
    } catch (e) {
      setError(e.message);
    }
  }

  if (cargando) {
    return (
      <main className="container huerto-main">
        <p role="status">Cargando panel…</p>
      </main>
    );
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Panel de vendedor</h2>
        <p className="text-muted">
          Publica productos y administra solo los que tú creaste. Un
          administrador puede gestionar todos.
        </p>

        {error && (
          <p className="alert alert-danger" role="alert">
            {error}
          </p>
        )}

        {mensaje && (
          <p className="alert alert-success" role="status">
            {mensaje}
          </p>
        )}

        <div className="huerto-panel mb-4">
          <h3 className="h5">
            {editandoId ? `Editar producto #${editandoId}` : "Nuevo producto"}
          </h3>

          <form onSubmit={guardar} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <input
                  id="categoria"
                  name="categoria"
                  className="form-control"
                  value={formulario.categoria}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-12">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  rows={2}
                  value={formulario.descripcion}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-6 col-md-3">
                <label htmlFor="precio" className="form-label">Precio (CLP)</label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="1"
                  className="form-control"
                  value={formulario.precio}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-6 col-md-3">
                <label htmlFor="stock" className="form-label">Stock (kg)</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formulario.stock}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="imagenUrl" className="form-label">Imagen</label>
                <input
                  id="imagenUrl"
                  name="imagenUrl"
                  className="form-control"
                  placeholder="mango.jpg"
                  value={formulario.imagenUrl}
                  onChange={cambiarCampo}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-huerto">
                {editandoId ? "Guardar cambios" : "Crear producto"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <strong>{producto.nombre}</strong>
                    <div className="small text-muted">{producto.categoria}</div>
                  </td>
                  <td>{formatoPrecio(producto.precio)}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.vendedorNombre ?? "—"}</td>
                  <td>
                    {puedeGestionar(producto) ? (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editar(producto)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminar(producto)}
                        >
                          Desactivar
                        </button>
                      </div>
                    ) : (
                      <span className="small text-muted">Solo lectura</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
