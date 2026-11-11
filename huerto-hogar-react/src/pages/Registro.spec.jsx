import { describe, afterEach, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Registro from "./Registro.jsx";

const { registrar } = vi.hoisted(() => ({ registrar: vi.fn() }));

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({ registrar }),
}));

describe("Registro", () => {
  const datosValidos = {
    "Nombre completo": "Mateo Nogueira",
    "Correo electrónico": "mateo@correo.cl",
    "Contraseña": "clave123",
    "Teléfono de contacto": "+56912345678",
    "Dirección de entrega": "Calle Los Aromos 123, Paine",
  };

  function completarFormulario(datos = datosValidos) {
    Object.entries(datos).forEach(([etiqueta, valor]) => {
      fireEvent.change(screen.getByLabelText(etiqueta), {
        target: { value: valor },
      });
    });
  }

  function enviarFormulario() {
    fireEvent.click(screen.getByRole("button", { name: "Registrarme" }));
  }

  afterEach(() => {
    cleanup();
    registrar.mockReset();
  });

  it("rechaza el formulario vacío y enfoca el primer campo con error", () => {
    render(<Registro />);

    enviarFormulario();

    expect(screen.getAllByRole("alert").length).toBe(5);
    Object.keys(datosValidos).forEach((etiqueta) => {
      expect(screen.getByLabelText(etiqueta).getAttribute("aria-invalid"))
        .toBe("true");
    });
    expect(document.activeElement).toBe(
      screen.getByLabelText("Nombre completo")
    );
    expect(registrar).not.toHaveBeenCalled();
  });

  it("rechaza datos que no cumplen los formatos y longitudes requeridos", () => {
    render(<Registro />);
    completarFormulario({
      "Nombre completo": "Ma",
      "Correo electrónico": "correo-invalido",
      "Contraseña": "12345",
      "Teléfono de contacto": "123456",
      "Dirección de entrega": "ABC",
    });

    enviarFormulario();

    const mensajes = screen
      .getAllByRole("alert")
      .map((alerta) => alerta.textContent);

    expect(mensajes).toEqual([
      "El nombre debe tener al menos 3 caracteres.",
      "Ingresa un correo electrónico válido.",
      "La contraseña debe tener al menos 6 caracteres.",
      "Usa el formato +56912345678, sin espacios.",
      "La dirección debe tener al menos 5 caracteres.",
    ]);
    expect(registrar).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("registra un usuario válido en la API y limpia los campos", async () => {
    registrar.mockResolvedValue({ id: 1, rol: "CLIENTE" });

    render(<Registro />);
    completarFormulario();

    enviarFormulario();

    expect(await screen.findByRole("status")).toBeTruthy();
    expect(registrar).toHaveBeenCalledTimes(1);
    expect(registrar).toHaveBeenCalledWith({
      nombre: "Mateo Nogueira",
      email: "mateo@correo.cl",
      password: "clave123",
      telefono: "+56912345678",
      direccion: "Calle Los Aromos 123, Paine",
    });
    expect(screen.getByRole("status").textContent).toContain(
      "Cuenta creada"
    );
    Object.keys(datosValidos).forEach((etiqueta) => {
      expect(screen.getByLabelText(etiqueta).value).toBe("");
    });
  });

  it("muestra el error del backend y conserva los datos", async () => {
    registrar.mockRejectedValue(
      new Error("Ya existe una cuenta registrada con ese correo")
    );

    render(<Registro />);
    completarFormulario();

    enviarFormulario();

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe(
      "Ya existe una cuenta registrada con ese correo"
    );
    expect(screen.queryByRole("status")).toBeNull();
    Object.entries(datosValidos).forEach(([etiqueta, valor]) => {
      expect(screen.getByLabelText(etiqueta).value).toBe(valor);
    });
  });
});
