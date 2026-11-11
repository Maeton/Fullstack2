import { useEffect, useState } from "react";
import { apiFetch, leerError } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const ESTADOS = ["PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"];

const USUARIO_VACIO = {
  nombre: "",
  email: "",
  password: "",
  telefono: "",
  direccion: "",
  rol: "CLIENTE",
};

function formatoPrecio(valor) {
  return Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

export default function PanelAdmin() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState(USUARIO_VACIO);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarTodo() {
    const [resUsuarios, resPedidos] = await Promise.all([
      apiFetch("/api/usuarios", {}, false),
      apiFetch("/api/pedidos", {}, false),
    ]);

    if (!resUsuarios.ok) {
      throw new Error(await leerError(resUsuarios, "No se pudieron cargar los usuarios"));
    }

    if (!resPedidos.ok) {
      throw new Error(await leerError(resPedidos, "No se pudieron cargar los pedidos"));
    }

    setUsuarios(await resUsuarios.json());
    setPedidos(await resPedidos.json());
  }

  useEffect(() => {
    let activo = true;

    Promise.all([
      apiFetch("/api/usuarios", {}, false),
      apiFetch("/api/pedidos", {}, false),
    ])
      .then(async ([resUsuarios, resPedidos]) => {
        if (!resUsuarios.ok) {
          throw new Error(
            await leerError(resUsuarios, "No se pudieron cargar los usuarios")
          );
        }

        if (!resPedidos.ok) {
          throw new Error(
            await leerError(resPedidos, "No se pudieron cargar los pedidos")
          );
        }

        return Promise.all([resUsuarios.json(), resPedidos.json()]);
      })
      .then(([listaUsuarios, listaPedidos]) => {
        if (!activo) return;
        setUsuarios(listaUsuarios);
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
    setNuevoUsuario((actual) => ({ ...actual, [name]: value }));
  }

  async function crearUsuario(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");

    const cuerpo = {
      nombre: nuevoUsuario.nombre.trim(),
      email: nuevoUsuario.email.trim(),
      password: nuevoUsuario.password,
      telefono: nuevoUsuario.telefono.trim() || null,
      direccion: nuevoUsuario.direccion.trim() || null,
      rol: nuevoUsuario.rol,
    };

    if (!cuerpo.nombre || !cuerpo.email || cuerpo.password.length < 6) {
      setError("Completa nombre, correo y una contraseña de al menos 6 caracteres.");
      return;
    }

    try {
      const respuesta = await apiFetch("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(cuerpo),
      });

      if (!respuesta.ok) {
        throw new Error(await leerError(respuesta, "No se pudo crear el usuario"));
      }

      setNuevoUsuario(USUARIO_VACIO);
      await cargarTodo();
      setMensaje("Usuario creado.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function desactivar(usuarioObjetivo) {
    if (usuarioObjetivo.id === usuario?.id) {
      setError("No puedes desactivar tu propia cuenta desde este panel.");
      return;
    }

    if (!window.confirm(`¿Desactivar la cuenta de ${usuarioObjetivo.email}?`)) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      const respuesta = await apiFetch(`/api/usuarios/${usuarioObjetivo.id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error(await leerError(respuesta, "No se pudo desactivar el usuario"));
      }

      await cargarTodo();
      setMensaje("Usuario desactivado.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function cambiarEstado(pedido, estado) {
    setError("");
    setMensaje("");

    try {
      const respuesta = await apiFetch(`/api/pedidos/${pedido.id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });

      if (!respuesta.ok) {
        throw new Error(await leerError(respuesta, "No se pudo cambiar el estado"));
      }

      await cargarTodo();
      setMensaje(`Pedido #${pedido.id} actualizado a ${estado}.`);
    } catch (e) {
      setError(e.message);
    }
  }

  if (cargando) {
    return (
      <main className="container huerto-main">
        <p role="status">Cargando administración…</p>
      </main>
    );
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <h2>Administración</h2>

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
          <h3 className="h5">Nuevo usuario</h3>

          <form onSubmit={crearUsuario} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label htmlFor="u-nombre" className="form-label">Nombre</label>
                <input
                  id="u-nombre"
                  name="nombre"
                  className="form-control"
                  value={nuevoUsuario.nombre}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="u-email" className="form-label">Correo</label>
                <input
                  id="u-email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={nuevoUsuario.email}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="u-password" className="form-label">Contraseña</label>
                <input
                  id="u-password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={nuevoUsuario.password}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="u-telefono" className="form-label">Teléfono</label>
                <input
                  id="u-telefono"
                  name="telefono"
                  className="form-control"
                  placeholder="+56912345678"
                  value={nuevoUsuario.telefono}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-12 col-md-5">
                <label htmlFor="u-direccion" className="form-label">Dirección</label>
                <input
                  id="u-direccion"
                  name="direccion"
                  className="form-control"
                  value={nuevoUsuario.direccion}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-12 col-md-3">
                <label htmlFor="u-rol" className="form-label">Rol</label>
                <select
                  id="u-rol"
                  name="rol"
                  className="form-select"
                  value={nuevoUsuario.rol}
                  onChange={cambiarCampo}
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-huerto mt-3">
              Crear usuario
            </button>
          </form>
        </div>

        <h3 className="h5">Usuarios</h3>
        <div className="table-responsive mb-4">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-secondary">{u.rol}</span></td>
                  <td>{u.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    {u.activo && u.id !== usuario?.id && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => desactivar(u)}
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="h5">Pedidos</h3>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.clienteNombre}</td>
                  <td>{formatoPrecio(pedido.total)}</td>
                  <td><span className="badge bg-secondary">{pedido.estado}</span></td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido, e.target.value)}
                      aria-label={`Estado del pedido ${pedido.id}`}
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
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
