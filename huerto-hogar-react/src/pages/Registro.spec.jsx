/* global describe, beforeEach, afterEach, it, expect, spyOn */

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Registro from "./Registro.jsx";

describe("Registro", () => {
  const datosValidos = {
    "Nombre completo": "Mateon Ogueira",
    "Correo electrónico": "mateo@correo.cl",
    "Contraseña": "clave123",
    "Teléfono de contacto": "+56912345678",
    "Dirección de entrega": "Calle Los Aromos 123, Paine",
  };

  let almacenamiento;
  let guardar;

  function completarFormulario(datos = datosValidos) {
    Object.entries(datos).forEach(([etiqueta, valor]) => {
      fireEvent.change(screen.getByLabelText(etiqueta), {
        target: { value: valor },
      });
    });
  }

  function enviarFormulario() {
    fireEvent.click(screen.getByRole("button", { name: "Registrar datos" }));
  }

  beforeEach(() => {
    almacenamiento = {};

    guardar = spyOn(Storage.prototype, "setItem").and.callFake((clave, valor) => {
      almacenamiento[clave] = String(valor);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("rechaza el formulario vacío y enfoca el primer campo con error", () => {
    // Comprueba que los campos obligatorios muestren errores y no se guarden datos.
    render(<Registro />);

    enviarFormulario();

    expect(screen.getAllByRole("alert").length).toBe(5);
    Object.keys(datosValidos).forEach((etiqueta) => {
      expect(screen.getByLabelText(etiqueta).getAttribute("aria-invalid"))
        .toBe("true");
    });
    expect(document.activeElement).toBe(screen.getByLabelText("Nombre completo"));
    expect(guardar).not.toHaveBeenCalled();
  });

  it("rechaza datos que no cumplen los formatos y longitudes requeridos", () => {
    // Comprueba las validaciones de nombre, correo, contraseña, teléfono y dirección.
    render(<Registro />);
    completarFormulario({
      "Nombre completo": "Ma",
      "Correo electrónico": "correo-invalido",
      "Contraseña": "12345",
      "Teléfono de contacto": "123456",
      "Dirección de entrega": "ABC",
    });

    enviarFormulario();

    const mensajes = screen.getAllByRole("alert").map((alerta) => alerta.textContent);
    expect(mensajes).toEqual([
      "El nombre debe tener al menos 3 caracteres.",
      "Ingresa un correo electrónico válido.",
      "La contraseña debe tener al menos 6 caracteres.",
      "Usa el formato +56912345678, sin espacios.",
      "La dirección debe tener al menos 5 caracteres.",
    ]);
    expect(guardar).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("guarda un registro válido, confirma el resultado y limpia los campos", () => {
    // Comprueba que se guarden los datos sin la contraseña y se reinicie el formulario.
    render(<Registro />);
    completarFormulario();

    enviarFormulario();

    expect(guardar).toHaveBeenCalledTimes(1);
    expect(JSON.parse(almacenamiento.huerto_user)).toEqual({
      nombre: "Mateo Nogueira",
      email: "mateo@correo.cl",
      telefono: "+56912345678",
      direccion: "Calle Los Aromos 123, Paine",
    });
    expect(screen.getByRole("status").textContent)
      .toBe("Tus datos se guardaron correctamente en este navegador.");
    expect(screen.queryByRole("alert")).toBeNull();
    Object.keys(datosValidos).forEach((etiqueta) => {
      expect(screen.getByLabelText(etiqueta).value).toBe("");
    });
  });

  it("muestra un error y conserva los datos si falla el almacenamiento", () => {
    // Simula un fallo al guardar y comprueba que el usuario pueda reintentar el registro.
    guardar.and.throwError("Almacenamiento no disponible");
    render(<Registro />);
    completarFormulario();

    enviarFormulario();

    expect(guardar).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert").textContent)
      .toBe("No se pudieron guardar tus datos. Intenta nuevamente.");
    expect(screen.queryByRole("status")).toBeNull();
    expect(almacenamiento.huerto_user).toBeUndefined();
    Object.entries(datosValidos).forEach(([etiqueta, valor]) => {
      expect(screen.getByLabelText(etiqueta).value).toBe(valor);
    });
  });
});
