import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, leerError } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { formatoPrecio } from "../utils/dinero";
import { imagenProducto } from "../utils/imagenes";

const FORMULARIO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "Frutas",
  imagenUrl: "",
};

function formatoFecha(valor) {
  return new Date(valor).toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

async function obtenerProductos() {
  const respuesta = await apiFetch("/api/productos", {}, false);

  if (!respuesta.ok) {
    throw new Error(
      await leerError(respuesta, "No se pudo cargar el catálogo")
    );
  }

  return respuesta.json();
}

async function obtenerPedidos() {
  const respuesta = await apiFetch("/api/pedidos", {}, false);

  if (!respuesta.ok) {
    throw new Error(
      await leerError(respuesta, "No se pudieron cargar las órdenes")
    );
  }

  return respuesta.json();
}

export default function PanelVendedor({ seccion = "productos" }) {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "ADMIN";

  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [detallePedido, setDetallePedido] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function recargar() {
    const [listaProductos, listaPedidos] = await Promise.all([
      obtenerProductos(),
      obtenerPedidos(),
    ]);

    setProductos(listaProductos);
    setPedidos(listaPedidos);
  }

  useEffect(() => {
    let activo = true;

    Promise.all([obtenerProductos(), obtenerPedidos()])
      .then(([listaProductos, listaPedidos]) => {
        if (!activo) return;
        setProductos(listaProductos);
        setPedidos(listaPedidos);
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

    if (
      !cuerpo.nombre ||
      !Number.isFinite(cuerpo.precio) ||
      !Number.isInteger(cuerpo.stock)
    ) {
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
        throw new Error(
          await leerError(respuesta, "No se pudo guardar el producto")
        );
      }

      await recargar();
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
        throw new Error(
          await leerError(respuesta, "No se pudo desactivar el producto")
        );
      }

      await recargar();
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
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h2>{seccion === "ordenes" ? "Órdenes" : "Productos"}</h2>

          <div className="d-flex gap-2">
            <Link
              to="/vendedor"
              className={`btn btn-sm ${
                seccion === "productos"
                  ? "btn-huerto"
                  : "btn-outline-secondary"
              }`}
            >
              Productos
            </Link>
            <Link
              to="/vendedor/ordenes"
              className={`btn btn-sm ${
                seccion === "ordenes"
                  ? "btn-huerto"
                  : "btn-outline-secondary"
              }`}
            >
              Órdenes
            </Link>
          </div>
        </div>

        <p className="text-muted">
          {esAdmin
            ? "Como administrador puedes revisar y gestionar el catálogo y las órdenes."
            : "Puedes revisar el catálogo y las órdenes. La edición está reservada al administrador."}
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

        {seccion === "productos" ? (
          <>
            {esAdmin && (
              <div className="huerto-panel mb-4">
                <h3 className="h5">
                  {editandoId
                    ? `Editar producto #${editandoId}`
                    : "Nuevo producto"}
                </h3>

                <form onSubmit={guardar} noValidate>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="nombre" className="form-label">
                        Nombre
                      </label>
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
                      <label htmlFor="categoria" className="form-label">
                        Categoría
                      </label>
                      <input
                        id="categoria"
                        name="categoria"
                        className="form-control"
                        value={formulario.categoria}
                        onChange={cambiarCampo}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="descripcion" className="form-label">
                        Descripción
                      </label>
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
                      <label htmlFor="precio" className="form-label">
                        Precio (CLP)
                      </label>
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
                      <label htmlFor="stock" className="form-label">
                        Stock (kg)
                      </label>
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
                      <label htmlFor="imagenUrl" className="form-label">
                        Imagen
                      </label>
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
            )}

            <h3 className="h5">Lista de productos</h3>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Vendedor</th>
                    <th></th>
                    {esAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <Fragment key={producto.id}>
                      <tr>
                        <td>
                          <strong>{producto.nombre}</strong>
                        </td>
                        <td>{formatoPrecio(producto.precio)}</td>
                        <td>{producto.stock}</td>
                        <td>{producto.categoria ?? "—"}</td>
                        <td>{producto.vendedorNombre ?? "—"}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setDetalleProducto(
                                detalleProducto?.id === producto.id
                                  ? null
                                  : producto
                              )
                            }
                          >
                            {detalleProducto?.id === producto.id
                              ? "Ocultar"
                              : "Ver detalle"}
                          </button>
                        </td>
                        {esAdmin && (
                          <td>
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
                          </td>
                        )}
                      </tr>

                      {detalleProducto?.id === producto.id && (
                        <tr>
                          <td colSpan={esAdmin ? 7 : 6}>
                            <div className="huerto-panel">
                              <div className="row g-3">
                                {producto.imagenUrl && (
                                  <div className="col-12 col-md-3">
                                    <img
                                      src={imagenProducto(producto.imagenUrl)}
                                      alt={producto.nombre}
                                      className="img-fluid rounded"
                                    />
                                  </div>
                                )}

                                <div className="col">
                                  <h4 className="h5">{producto.nombre}</h4>
                                  <p className="mb-1">
                                    {producto.descripcion || "Sin descripción."}
                                  </p>
                                  <p className="mb-1">
                                    Precio: {formatoPrecio(producto.precio)} por
                                    kilo
                                  </p>
                                  <p className="mb-1">
                                    Stock: {producto.stock} kg
                                  </p>
                                  <p className="mb-1">
                                    Categoría: {producto.categoria ?? "—"}
                                  </p>
                                  <p className="mb-0">
                                    Vendedor: {producto.vendedorNombre ?? "—"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {productos.length === 0 && <p>No hay productos disponibles.</p>}
          </>
        ) : (
          <>
            <h3 className="h5">Lista de órdenes</h3>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <Fragment key={pedido.id}>
                      <tr>
                        <td>{pedido.id}</td>
                        <td>{formatoFecha(pedido.fecha)}</td>
                        <td>{pedido.clienteNombre}</td>
                        <td>{formatoPrecio(pedido.total)}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {pedido.estado}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setDetallePedido(
                                detallePedido?.id === pedido.id
                                  ? null
                                  : pedido
                              )
                            }
                          >
                            {detallePedido?.id === pedido.id
                              ? "Ocultar"
                              : "Ver detalle"}
                          </button>
                        </td>
                      </tr>

                      {detallePedido?.id === pedido.id && (
                        <tr>
                          <td colSpan={6}>
                            <div className="huerto-panel">
                              <p className="mb-1">
                                <strong>Entrega:</strong>{" "}
                                {pedido.direccionEntrega ?? "—"}
                              </p>
                              <p className="mb-2">
                                <strong>Contacto:</strong>{" "}
                                {pedido.nombreContacto ??
                                  pedido.clienteNombre}
                                {pedido.telefonoContacto
                                  ? ` · ${pedido.telefonoContacto}`
                                  : ""}
                              </p>

                              <ul className="list-group list-group-flush mb-2">
                                {pedido.items?.map((item) => (
                                  <li
                                    className="list-group-item d-flex justify-content-between px-0"
                                    key={`${pedido.id}-${item.productoId}`}
                                  >
                                    <span>
                                      {item.nombre} × {item.cantidad} kg
                                    </span>
                                    <span>
                                      {formatoPrecio(item.subtotal)}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              <p className="fw-bold text-end mb-0">
                                Total: {formatoPrecio(pedido.total)}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {pedidos.length === 0 && <p>No hay órdenes registradas.</p>}
          </>
        )}
      </section>
    </main>
  );
}
