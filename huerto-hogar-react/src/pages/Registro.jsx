import { useState } from "react";
import imagenRegistro from "../assets/img/pasos-registro.jpg";

const DATOS_INICIALES = {
  nombre: "",
  email: "",
  password: "",
  telefono: "",
  direccion: "",
};

const campos = [
  {
    nombre: "nombre",
    etiqueta: "Nombre completo",
    tipo: "text",
    autocomplete: "name",
    placeholder: "Tu nombre completo",
  },
  {
    nombre: "email",
    etiqueta: "Correo electrónico",
    tipo: "email",
    autocomplete: "email",
    placeholder: "nombre@correo.cl",
  },
  {
    nombre: "password",
    etiqueta: "Contraseña",
    tipo: "password",
    autocomplete: "new-password",
    placeholder: "Mínimo 6 caracteres",
  },
  {
    nombre: "telefono",
    etiqueta: "Teléfono de contacto",
    tipo: "tel",
    autocomplete: "tel",
    placeholder: "+56912345678",
  },
  {
    nombre: "direccion",
    etiqueta: "Dirección de entrega",
    tipo: "text",
    autocomplete: "street-address",
    placeholder: "Calle, número, comuna y ciudad",
  },
];

function validarFormulario(datos) {
  const errores = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) {
    errores.email = "Ingresa un correo electrónico válido.";
  }

  if (datos.password.length < 6) {
    errores.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (!/^\+56[0-9]{9}$/.test(datos.telefono.trim())) {
    errores.telefono = "Usa el formato +56912345678, sin espacios.";
  }

  if (datos.direccion.trim().length < 5) {
    errores.direccion = "La dirección debe tener al menos 5 caracteres.";
  }

  return errores;
}

export default function Registro() {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  function cambiarCampo(evento) {
    const { name, value } = evento.target;

    setDatos((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actual) => ({
      ...actual,
      [name]: "",
    }));

    setMensaje("");
    setErrorGuardado("");
  }

  function enviarFormulario(evento) {
    evento.preventDefault();

    setMensaje("");
    setErrorGuardado("");

    const nuevosErrores = validarFormulario(datos);
    setErrores(nuevosErrores);

    const primerCampoConError = Object.keys(nuevosErrores)[0];

    if (primerCampoConError) {
      evento.currentTarget.elements
        .namedItem(primerCampoConError)
        ?.focus();

      return;
    }

    const usuario = {
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      telefono: datos.telefono.trim(),
      direccion: datos.direccion.trim(),
    };

    try {
      localStorage.setItem("huerto_user", JSON.stringify(usuario));

      setDatos(DATOS_INICIALES);
      setErrores({});
      setMensaje("Tus datos se guardaron correctamente en este navegador.");
    } catch {
      setErrorGuardado(
        "No se pudieron guardar tus datos. Intenta nuevamente."
      );
    }
  }

  return (
    <main className="container huerto-main">
      <section
        className="huerto-section"
        aria-labelledby="titulo-registro"
      >
        <div className="row align-items-start g-5">
          <div className="col-12 col-lg-7">
            <h2 id="titulo-registro">Registro</h2>

            <p className="huerto-descripcion">
              Ingresa tus datos de contacto y dirección de entrega.
              Todos los campos son obligatorios.
            </p>

            {mensaje && (
              <p className="alert alert-success" role="status">
                {mensaje}
              </p>
            )}

            {errorGuardado && (
              <p className="alert alert-danger" role="alert">
                {errorGuardado}
              </p>
            )}

            <form
              className="huerto-form huerto-panel"
              onSubmit={enviarFormulario}
              noValidate
            >
              {campos.map((campo) => (
                <div className="mb-3" key={campo.nombre}>
                  <label
                    htmlFor={campo.nombre}
                    className="form-label"
                  >
                    {campo.etiqueta}
                  </label>

                  <input
                    id={campo.nombre}
                    name={campo.nombre}
                    type={campo.tipo}
                    autoComplete={campo.autocomplete}
                    placeholder={campo.placeholder}
                    className={`form-control ${
                      errores[campo.nombre] ? "is-invalid" : ""
                    }`}
                    value={datos[campo.nombre]}
                    onChange={cambiarCampo}
                    aria-invalid={Boolean(errores[campo.nombre])}
                    aria-describedby={
                      errores[campo.nombre]
                        ? `error-${campo.nombre}`
                        : undefined
                    }
                    required
                  />

                  {errores[campo.nombre] && (
                    <span
                      id={`error-${campo.nombre}`}
                      className="error-mensaje"
                      role="alert"
                    >
                      {errores[campo.nombre]}
                    </span>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="btn btn-huerto w-100"
              >
                Registrar datos
              </button>
            </form>
          </div>

          <div className="col-12 col-lg-5">
            <img
              src={imagenRegistro}
              alt="Pasos para registrarse en Huerto Hogar"
              className="imagen-registro"
              loading="lazy"
            />

            <div className="huerto-panel mt-4">
              <h3>Completa tus datos</h3>
              <p className="mb-0">
                Revisa que tu correo, teléfono y dirección estén
                escritos correctamente antes de enviar el formulario.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}