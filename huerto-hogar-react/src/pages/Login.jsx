import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const CUENTAS = [
  {
    rol: "CLIENTE",
    titulo: "Cliente",
    icono: "cliente",
  },
  {
    rol: "VENDEDOR",
    titulo: "Vendedor",
    icono: "vendedor",
  },
  {
    rol: "ADMIN",
    titulo: "Administrador",
    icono: "admin",
  },
];

const DESTINO_POR_ROL = {
  CLIENTE: "/",
  VENDEDOR: "/vendedor",
  ADMIN: "/admin",
};

function destinoSeguro(rol, desde) {
  if (!desde) return DESTINO_POR_ROL[rol] ?? "/";

  if (rol === "ADMIN") {
    return desde.startsWith("/admin") || desde.startsWith("/vendedor")
      ? desde
      : DESTINO_POR_ROL.ADMIN;
  }

  if (rol === "VENDEDOR") {
    return desde.startsWith("/vendedor") ? desde : DESTINO_POR_ROL.VENDEDOR;
  }

  if (desde.startsWith("/admin") || desde.startsWith("/vendedor")) {
    return DESTINO_POR_ROL.CLIENTE;
  }

  return desde;
}

function IconoRol({ tipo }) {
  if (tipo === "vendedor") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M4 9h16l-1.2 10.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8L4 9Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8 9V7a4 4 0 0 1 8 0v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (tipo === "admin") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M12 3 5 6v5.5c0 4.4 3 7.6 7 9.5 4-1.9 7-5.1 7-9.5V6l-7-3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="m9 12 2.2 2.2L15.5 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle
        cx="12"
        cy="8.5"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("CLIENTE");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.desde ?? "/";

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setEnviando(true);

    try {
      const usuarioLogueado = await login(
        email.trim(),
        password,
        rolSeleccionado
      );
      navigate(destinoSeguro(usuarioLogueado.rol, destino), { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function elegirCuenta(cuenta) {
    setRolSeleccionado(cuenta.rol);
    setError("");
  }

  return (
    <main className="container huerto-main">
      <section className="huerto-section">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <h2>Iniciar sesión</h2>

            <fieldset className="tipo-cuenta mb-4">
              <legend className="form-label fw-bold fs-6 mb-2">
                Tipo de cuenta
              </legend>

              <div className="tipo-cuenta-opciones">
                {CUENTAS.map((cuenta) => {
                  const activa = rolSeleccionado === cuenta.rol;

                  return (
                    <button
                      key={cuenta.rol}
                      type="button"
                      className={`tipo-cuenta-opcion${activa ? " activa" : ""}`}
                      aria-pressed={activa}
                      onClick={() => elegirCuenta(cuenta)}
                    >
                      <span className="tipo-cuenta-icono">
                        <IconoRol tipo={cuenta.icono} />
                      </span>
                      <span className="tipo-cuenta-nombre">{cuenta.titulo}</span>
                    </button>
                  );
                })}
              </div>

              <p className="tipo-cuenta-nota">
                Solo podrás ingresar con las credenciales de este tipo de
                cuenta.
              </p>
            </fieldset>

            {error && (
              <p className="alert alert-danger" role="alert">
                {error}
              </p>
            )}

            <form
              className="huerto-panel"
              onSubmit={enviarFormulario}
              noValidate
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-huerto w-100"
                disabled={enviando}
              >
                {enviando ? "Ingresando…" : "Ingresar"}
              </button>
            </form>

            <p className="mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
